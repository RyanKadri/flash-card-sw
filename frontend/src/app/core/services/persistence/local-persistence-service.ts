import { Injectable } from "@angular/core";
import idb, { Transaction, ObjectStore } from 'idb';
import { HasId } from "../state";
import { PersistenceProvider, FetchCriteria, FetchStatus, FetchGraph, PersistenceSchema, TopLevelSchema, AnySchema, FieldDefinitions, PersistPlan, FieldLink } from "./persistence-types";
import { IdbEvolutionService } from "./idb-evolution.service";
import { extractTopLevelInfo, extractSchemaFromDef } from "../static-libs";
import { SchemaTypeToken } from "./schemaTypeToken";
import { SchemaRegistryService } from "./schema-registry.service";

const nav: Navigator & {storage: 
    { persist: () => Promise<boolean>, persisted: () => Promise<boolean> }} = window.navigator as any

@Injectable({ providedIn: 'root' })
export class LocalPersistenceService implements PersistenceProvider {
    private persistentStorage = false;
    private databaseVersion: number;

    constructor(
        private evolutionService: IdbEvolutionService,
        private schemaService: SchemaRegistryService
    ) { }

    async initialize() {
        if(nav.storage && nav.storage.persisted) {
            const hasPersistentStorage = await nav.storage.persisted();
            if(!hasPersistentStorage) {
                const persisted = await nav.storage.persist();
                if(!persisted) {
                    this.persistentStorage = false;
                }
            }
        }

        await this.evolutionService.ensureDatabaseUpdate();
    }

    async persist<T extends HasId>(plan: PersistPlan, schema: TopLevelSchema<T>) {
        const db = await idb.open(schema.metadata.idbDatabase, this.databaseVersion);

        const tx = db.transaction(plan.groups.map(group => group.store), 'readwrite');
        const toPersist = [];
        for(const group of plan.groups) {
            const store = tx.objectStore(group.store);
            group.items.forEach(val => {
                toPersist.push(this.putToStore(store, val, group.schema));
            })
        }
        await Promise.all(toPersist);
        await tx.complete;
        db.close();
    }

    async fetch<T extends HasId>(schema: TopLevelSchema<T>, criteria: FetchCriteria<T>) {
        const db = await idb.open(schema.metadata.idbDatabase, this.databaseVersion);
        const stores = extractTopLevelInfo(criteria.fetch, schema, this.schemaService, schema => schema.metadata.idbObjectStore);

        const tx = db.transaction(stores, 'readonly');
        const initStore = tx.objectStore(stores[0]);
        let initRes;
        if(Object.keys(criteria.search).length === 0) {
            initRes = await initStore.getAll() as T[];
        } else {
            if(criteria.search.id) {
                initRes = [await initStore.get(criteria.search.id)];
            } else {
                throw new Error('Not sure yet how to make generic queries')
            }
        }
        const graph = await this.fetchLinked(tx, initRes, criteria.fetch, schema);
        await tx.complete;
        db.close();
        return graph;
    }

    private async fetchLinked<T>(tx: Transaction, startingFrom: T[], fetch: FetchGraph<T>, schema: TopLevelSchema<T>) {
        const fetchMap = new Map<TopLevelSchema<any>, any[]>();
        fetchMap.set(schema, startingFrom);

        if(fetch) {
            const traverse = async (items: T[], fetch: FetchGraph<any>, schema: AnySchema<T>) => {
                for(const entry of Object.entries(fetch)) {
                    const key = entry[0];
                    const subgraph = entry[1] as FetchGraph<any>;
    
                    const fieldDef = schema.fields[key as keyof T];
                    const [nestedSchema, fieldRef] = extractSchemaFromDef(fieldDef, this.schemaService);
    
                    if(nestedSchema.type === 'top') {
                        const store = tx.objectStore(nestedSchema.metadata.idbObjectStore);
                        const toFetch = unpack(items, fieldRef)
                            .map(el => this.getFromStore(store, el, nestedSchema));
                        const children = await Promise.all(toFetch);
                        children.forEach(child => {
                            fetchMap.set(nestedSchema, (fetchMap.get(nestedSchema) || []).concat(child));
                        })
                        if(typeof subgraph !== 'boolean' && typeof subgraph !== 'undefined') {
                            await traverse(children, subgraph, nestedSchema as any);
                        }
                    } else {
                        const children = unpack(items, key);
                        if(typeof subgraph !== 'boolean' && typeof subgraph !== 'undefined') {
                            await traverse(children, subgraph, nestedSchema);
                        }
                    }
                }
            }

            await traverse.bind(this)(startingFrom, fetch, schema);
        }

        function unpack(items: T[], key: string): any[] {
            if(!items || items.length === 0) return [];
            if(!Array.isArray(items[0][key])) {
                return items
                    .filter(item => item[key] !== undefined)
                    .map(item => item[key]);
            } else {
                const res = [];
                for(const item of items) {
                    for(const el of (<any> item[key])) {
                        res.push(el);
                    }
                }
                return res;
            }
        }

        return {
            error: false,
            status: FetchStatus.OK,
            groups: Array.from(fetchMap.entries()).map(([schema, items]) => ({
                schema, results: items
            }))
        };
    }

    private getFromStore(store: ObjectStore<any, any>, id: string, schema: TopLevelSchema<any>) {
        const getPromise = store.get(id);
        if(schema.metadata.idbAfterFetch) {
            return getPromise.then(item => schema.metadata.idbAfterFetch(item));
        } else {
            return getPromise;
        }
    }

    private putToStore(store: ObjectStore<any, any>, item: any, schema: TopLevelSchema<any>) {
        let toPersist;
        if(schema.metadata.idbBeforePersist) {
            toPersist = schema.metadata.idbBeforePersist(item);
        } else {
            toPersist = item;
        }
        return store.put(toPersist);
    }

    async delete<T extends HasId>(items: T[], schema: TopLevelSchema<T>) {
        const db = await idb.open(schema.metadata.idbDatabase, this.databaseVersion);
        const tx = db.transaction(schema.metadata.idbObjectStore, 'readwrite')
        const store = tx.objectStore(schema.metadata.idbObjectStore);
        const deletes = items.map(item => store.delete(item.id));
        await Promise.all(deletes);
        await tx.complete;
        db.close();
        return items;
    }

    hasPersistentStorage() {
        return this.persistentStorage;
    }

}

interface DatabaseInfo {
    dbName: string;
    stores: string[];
}
import { Injectable } from "@angular/core";
import idb from 'idb';
import { HasId } from "../state";
import { PersistenceProvider, FetchCriteria, FetchStatus, FetchGraph, PersistenceSchema, TopLevelSchema, AnySchema, FieldDefinitions, PersistPlan } from "./persistence-types";
import { IdbEvolutionService } from "./idb-evolution.service";

const nav: Navigator & {storage: 
    { persist: () => Promise<boolean>, persisted: () => Promise<boolean> }} = window.navigator as any

@Injectable({ providedIn: 'root' })
export class LocalPersistenceService implements PersistenceProvider {
    private persistentStorage = false;
    private databaseVersion: number;

    constructor(
        private evolutionService: IdbEvolutionService
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
                toPersist.push(store.put(val));
            })
        }
        await Promise.all(toPersist);
        await tx.complete;
        db.close();
    }

    async fetch<T extends HasId>(schema: TopLevelSchema<T>, criteria: FetchCriteria<T>) {
        const db = await idb.open(schema.metadata.idbDatabase, this.databaseVersion);
        const execInfo = this.extractExecInfo(criteria.fetch, schema);
        console.log(execInfo);
        const tx = db.transaction(execInfo.stores, 'readonly');
        const store = tx.objectStore(execInfo.stores[0]);
        let result;
        if(Object.keys(criteria.search).length === 0) {
            result = await store.getAll() as T[];
        } else {
            if(criteria.search.id) {
                result = await store.get(criteria.search.id);
            } else {
                throw new Error('Not sure yet how to make generic queries')
            }
        }
        await tx.complete;
        db.close();
        return {
            result,
            status: FetchStatus.OK
        };
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

    private extractExecInfo<T>(fetchGraph: FetchGraph<PersistenceSchema<T>>, schema: TopLevelSchema<T>) {
        const stores = new Set<string>();
        const fetchPaths = [];
        stores.add(schema.metadata.idbObjectStore);
        if(fetchGraph) {
            traverse(fetchGraph, schema);
        }
        return {
            stores: Array.from(stores),
            fetchPaths
        };

        function traverse(graph: FetchGraph<any>, schema: AnySchema<T>, keypath: string[] = []) {
            for(const [key, subgraph] of Object.entries(graph)) {
                const subSchema: AnySchema<any> = schema.fields[key];
                if(subSchema.type === 'top') {
                    fetchPaths.push(keypath.concat(key));
                    stores.add(subSchema.metadata.idbObjectStore);
                }
                if(typeof subgraph !== 'boolean') {
                    traverse(subgraph, subSchema, [...keypath, key]);
                }
            }
        }
    }
}

interface DatabaseInfo {
    dbName: string;
    stores: string[];
}
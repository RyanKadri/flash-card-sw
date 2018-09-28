import { Injectable } from "@angular/core";
import idb from 'idb';
import { HasId } from "./state";
import { PersistenceProvider, PersistenceSchema, FetchCriteria, FetchStatus } from "./persistence-types";
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

    async persist<T extends HasId, IDB = T, Remote = T>(items: T[], schema: PersistenceSchema<T, IDB, Remote>) {
        const db = await idb.open(schema.idbDatabase, this.databaseVersion);
        const tx = db.transaction(schema.idbObjectStore, 'readwrite');
        const store = tx.objectStore(schema.idbObjectStore);
        for(const toPersist of items) {
            await store.put(toPersist);
        }
        await tx.complete;
        db.close();
        return items;
    }

    async fetch<T extends HasId>(schema: PersistenceSchema<T>, criteria: FetchCriteria<T>) {
        const db = await idb.open(schema.idbDatabase, this.databaseVersion);
        const tx = db.transaction(schema.idbObjectStore, 'readonly');
        const store = tx.objectStore(schema.idbObjectStore);
        let result;
        if(Object.keys(criteria).length === 0) {
            result = await store.getAll() as T[];
        } else {
            if(criteria.id) {
                result = await store.get(criteria.id);
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

    async delete<T extends HasId>(items: T[], schema: PersistenceSchema<T>) {
        const db = await idb.open(schema.idbDatabase, this.databaseVersion);
        const tx = db.transaction(schema.idbObjectStore, 'readwrite')
        const store = tx.objectStore(schema.idbObjectStore);
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
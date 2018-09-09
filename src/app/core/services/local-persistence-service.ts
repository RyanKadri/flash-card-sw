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

    async persist<T extends HasId>(items: T[], schema: PersistenceSchema<T>) {
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
        const quizzes = await store.getAll() as T[];
        await tx.complete;
        db.close();
        return {
            result: quizzes,
            status: FetchStatus.OK
        };
    }

    hasPersistentStorage() {
        return this.persistentStorage;
    }
}

interface DatabaseInfo {
    dbName: string;
    stores: string[];
}
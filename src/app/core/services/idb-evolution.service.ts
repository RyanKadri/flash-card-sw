import { Injectable } from "@angular/core";
import { HasId, State } from "./state";
import { PersistenceSchemaService } from "./persistence-schema.service";
import { PersistenceSchema } from "./persistence-types";
import idb, { UpgradeDB, DB } from 'idb';

@Injectable({ providedIn: 'root' })
export class IdbEvolutionService {

    private evolutionSteps: DatabaseEvolutionStep[];
    get dbVersion() {
        return this.evolutionSteps.length;
    }

    constructor(
        private schemaService: PersistenceSchemaService
    ) {
        this.evolutionSteps = [
            new CreateObjectStore(this.schemaService.quizSchema),
        ]
    }

    async ensureDatabaseUpdate() {
        const uniqueDatabases = new Set<string>();
        this.evolutionSteps.forEach(step => uniqueDatabases.add(step.database))
        for(const db of uniqueDatabases) {
            await idb.open(db, this.evolutionSteps.length, upgrade => {
                const relevantSteps = this.evolutionSteps.filter((step, i) => step.database === db && i >= upgrade.oldVersion);
                this.applyUpgrade(relevantSteps, upgrade)
            });
        }
        
    }

    private async applyUpgrade(upgradeSteps: DatabaseEvolutionStep[], upgrader: UpgradeDB) {
        for(const step of upgradeSteps) {
            switch(step.type) {
                case 'create-store':
                    upgrader.createObjectStore(step.store, { keyPath: step.index });
                    break;
                case 'remove-store':
                    upgrader.deleteObjectStore(step.store);
                    break;
            }
        }
    }
}

type DatabaseEvolutionStep = CreateObjectStore<any> | RemoveObjectStore;

class CreateObjectStore<T extends HasId> {
    type : "create-store" = "create-store";
    database: string;
    store: string;

    constructor(
        schema: PersistenceSchema<T>,
        public index = "id"
    ) { 
        this.database = schema.idbDatabase;
        this.store = schema.idbObjectStore;
    }
}

class RemoveObjectStore {
    type : "remove-store" = "remove-store";
    constructor(
        public database: string,
        public store: string
    ){}
}
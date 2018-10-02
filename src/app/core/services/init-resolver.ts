import { Resolve } from "@angular/router";
import { PersistenceService } from "./persistence/persistence-service";
import { Injectable } from "@angular/core";
import { PersistenceSchemaService } from "./persistence/persistence-schema.service";

@Injectable({ providedIn: 'root' })
export class InitResolver implements Resolve<void> {

    constructor(   
        private persistenceService: PersistenceService,
        private schemaService: PersistenceSchemaService
    ) { }

    resolve() {
        this.schemaService.initialize();
        return this.persistenceService.initialize();
    }
}
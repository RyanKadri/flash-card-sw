import { Resolve } from "@angular/router";
import { PersistenceService } from "./persistence/persistence-service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class InitResolver implements Resolve<void> {

    constructor(   
        private persistenceService: PersistenceService
    ) { }

    resolve() {
        return this.persistenceService.initialize();
    }
}
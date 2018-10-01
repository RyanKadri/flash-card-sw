import { Injectable } from "@angular/core";
import { HasId } from "../state";
import { HttpClient } from "@angular/common/http";
import { PersistenceProvider, PersistenceMetadata, FetchCriteria, FetchStatus, FetchResult, PersistenceSchema, TopLevelSchema, PersistPlan } from "./persistence-types";

@Injectable({ providedIn: 'root' })
export class RemotePersistenceService implements PersistenceProvider {
    
    constructor(
        private http: HttpClient
    ) {}

    async persist<T extends HasId>(plan: PersistPlan, schema: TopLevelSchema<T>): Promise<void> {
        const url = schema.metadata.remoteResourceBulk;
        await this.http.put<T[]>(url, plan.groups, { responseType: 'json' }).toPromise()
    }

    async fetch<T extends HasId>(schema: TopLevelSchema<any>, criteria: FetchCriteria<T>): Promise<FetchResult<T[]>> {
        const url = schema.metadata.remoteResourceBulk;
        const res = await this.http.get<T[]>(url).toPromise();
        return { result: res, status: FetchStatus.OK }
    }

    async delete<T extends HasId>(toPersist: T[], schema: TopLevelSchema<T>): Promise<T[]> {
        if(toPersist.length > 1) throw new Error('Oops. Need to implement bulk delete');
        const url = schema.metadata.remoteResource(toPersist[0]);
        return this.http.delete<T[]>(url, { responseType: 'json' }).toPromise();
    }
}
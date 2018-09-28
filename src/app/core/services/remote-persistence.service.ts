import { Injectable } from "@angular/core";
import { HasId } from "./state";
import { HttpClient } from "@angular/common/http";
import { PersistenceProvider, PersistenceSchema, FetchCriteria, FetchStatus, FetchResult } from "./persistence-types";

@Injectable({ providedIn: 'root' })
export class RemotePersistenceService implements PersistenceProvider {
    
    constructor(
        private http: HttpClient
    ) {}

    async persist<T extends HasId>(toPersist: T[], schema: PersistenceSchema<any>): Promise<T[]> {
        const url = schema.remoteResourceBulk;
        return this.http.put<T[]>(url, toPersist, { responseType: 'json' }).toPromise()
    }

    async fetch<T extends HasId, >(schema: PersistenceSchema<any>, criteria: FetchCriteria<T>): Promise<FetchResult<T[]>> {
        const url = schema.remoteResourceBulk;
        const res = await this.http.get<T[]>(url).toPromise();
        return { result: res, status: FetchStatus.OK }
    }

    async delete<T extends HasId>(toPersist: T[], schema: PersistenceSchema<T>): Promise<T[]> {
        if(toPersist.length > 1) throw new Error('Oops. Need to implement bulk delete');
        const url = schema.remoteResource(toPersist[0]);
        return this.http.delete<T[]>(url, { responseType: 'json' }).toPromise();
    }
}
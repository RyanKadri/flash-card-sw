import { Injectable } from "@angular/core";
import { LocalPersistenceService } from "./local-persistence-service";
import { State, HasId } from "./state";
import { RemotePersistenceService } from "./remote-persistence.service";
import * as uuidv4 from 'uuid/v4'
import { CompletionGuarantee, FetchSource, PersistenceSchema, PersistenceOptions, FetchCriteria, PersistenceProvider, FetchStatus, FetchResult, FetchOptions } from "./persistence-types";
import { PersistenceSchemaService } from "./persistence-schema.service";

@Injectable({ providedIn: 'root' })
export class PersistenceService {

    private readonly defaultPersistenceOptions = {
        guarantee: CompletionGuarantee.LOCAL_ONLY,
        shouldPublish: false
    }

    private readonly defaultFetchOptions = {
        source: FetchSource.LOCAL_FIRST,
        fallback: true
    }

    constructor(
        private localPersistenceService: LocalPersistenceService,
        private remotePersistenceService: RemotePersistenceService,
    ) { }

    async initialize() {
        return await this.localPersistenceService.initialize();
    }

    async persist<T>(toPersist: T[], schema: PersistenceSchema<T & HasId>, options?: Partial<PersistenceOptions>) {
        const fullOptions = { ...this.defaultPersistenceOptions, ...options }
        const toPersistWithIds = toPersist.map(item => item['id'] ? item : ({ ...item as any, id: uuidv4() })) as (T & HasId)[];
        schema.localState.upsert(...toPersistWithIds);

        const localPersist = this.localPersistenceService.persist(toPersistWithIds, schema);
        let remotePersist: Promise<(T & HasId)[]>;
        if(fullOptions.shouldPublish) {
            remotePersist = this.remotePersistenceService.persist(toPersistWithIds, schema);
        }

        switch(fullOptions.guarantee) {
            case CompletionGuarantee.IN_MEMORY:
                return Promise.resolve(toPersistWithIds);
            case CompletionGuarantee.LOCAL_ONLY:
                return localPersist;
            case CompletionGuarantee.REMOTE_ONLY:
                return remotePersist;
            case CompletionGuarantee.LOCAL_AND_REMOTE:
                return Promise.all([localPersist, remotePersist]).then(res => res[0]);
        }
    }

    async fetch<T extends HasId>(schema: PersistenceSchema<T>, criteria?: FetchCriteria<T>, options?: Partial<FetchOptions>) {
        const fullOptions = { ...this.defaultFetchOptions, ...options };
        let firstProvider: PersistenceProvider;
        let fallback: PersistenceProvider;

        if(fullOptions.source === FetchSource.LOCAL_FIRST) {
            firstProvider = this.localPersistenceService;
            fallback = this.remotePersistenceService;
        } else if(fullOptions.source === FetchSource.REMOTE_FIRST) {
            firstProvider = this.remotePersistenceService;
            fallback = this.localPersistenceService;
        } else {
            firstProvider = this.remotePersistenceService;
        }

        let failed = false;
        let retry = false;
        let res: T[];
        try {
            const fetchRes = await firstProvider.fetch(schema, criteria)
            if(fetchRes.error) {
                failed = true;
            } else if(fetchRes.status === FetchStatus.INCOMPLETE_RESULT || fetchRes.status === FetchStatus.OUTDATED_RESULT) {
                retry = true;
            } else {
                res = fetchRes.result;
            }
        } catch(e) {
            failed = true;
        }

        if(failed || retry) {
            let retryRes: FetchResult<T[]>;
            if(fallback) {
                retryRes = await fallback.fetch(schema, criteria);
            }
            if(!retryRes || retryRes.error) {
                throw new Error("Failed to fetch requested items")
            }
            return retryRes.result;
        } else {
            schema.localState.upsert(...res);
            return res;
        }
    }

}
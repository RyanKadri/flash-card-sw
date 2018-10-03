import { Injectable } from "@angular/core";
import { LocalPersistenceService } from "./local-persistence-service";
import { HasId, StateBase } from "../state";
import { RemotePersistenceService } from "./remote-persistence.service";
import { CompletionGuarantee, FetchSource, PersistenceMetadata, PersistenceOptions, FetchCriteria, PersistenceProvider, FetchStatus, FetchResult, FetchOptions, DeleteOptions, PersistenceSchema, TopLevelSchema, AnySchema, PersistPlan, FetchGroup, FieldDefinition, FieldLink } from "./persistence-types";
import * as uuidv4 from 'uuid/v4'
import { SchemaTypeToken } from "./schemaTypeToken";
import { SchemaRegistryService } from "./schema-registry.service";
import { extractSchemaFromDef } from "../static-libs";


@Injectable({ providedIn: 'root' })
export class PersistenceService {

    private readonly defaultPersistenceOptions = {
        guarantee: CompletionGuarantee.LOCAL_ONLY,
        shouldPublish: false
    }

    private readonly defaultDeletionOptions = {
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
        private schemaRegistry: SchemaRegistryService
    ) { }

    async initialize() {
        return await this.localPersistenceService.initialize();
    }

    async persist<T>(toPersist: T[], type: SchemaTypeToken<T>, options?: Partial<PersistenceOptions>) {
        const fullOptions = { ...this.defaultPersistenceOptions, ...options }
        
        const schema = this.assertTopLevelSchema(this.schemaRegistry.fetchSchema(type));
        const plan = this.createPersistPlan(toPersist, schema);

        const localPersist = this.localPersistenceService.persist(plan, schema);
        let remotePersist: Promise<void>;
        if(fullOptions.shouldPublish) {
            remotePersist = this.remotePersistenceService.persist(plan, schema);
        }
        plan.groups.forEach(group => group.state.upsert(...group.items))

        switch(fullOptions.guarantee) {
            case CompletionGuarantee.IN_MEMORY:
                return Promise.resolve(toPersist);
            case CompletionGuarantee.LOCAL_ONLY:
                return localPersist;
            case CompletionGuarantee.REMOTE_ONLY:
                return remotePersist;
            case CompletionGuarantee.LOCAL_AND_REMOTE:
                return Promise.all([localPersist, remotePersist]).then(res => res[0]);
        }
    }

    async fetch<T extends HasId>(type: SchemaTypeToken<T>, criteria?: FetchCriteria<T>, options?: Partial<FetchOptions>) {
        const fullOptions = { ...this.defaultFetchOptions, ...options };
        let firstProvider: PersistenceProvider;
        let fallback: PersistenceProvider;
        const schema = this.assertTopLevelSchema(this.schemaRegistry.fetchSchema(type));

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
        let groups: FetchGroup<T>[];
        try {
            const fetchRes = await firstProvider.fetch(schema, criteria)
            if(fetchRes.error) {
                failed = true;
            } else if(fetchRes.status === FetchStatus.INCOMPLETE_RESULT || fetchRes.status === FetchStatus.OUTDATED_RESULT) {
                retry = true;
            } else {
                groups = fetchRes.groups;
            }
        } catch(e) {
            console.error(e);
            failed = true;
        }

        if(failed || retry) {
            let retryRes: FetchResult<T>;
            if(fallback) {
                retryRes = await fallback.fetch(schema, criteria);
            }
            if(!retryRes || retryRes.error) {
                throw new Error("Failed to fetch requested items")
            }
            return retryRes.groups;
        } else {
            groups.forEach(group => group.schema.metadata.localState.upsert(...group.results));
            return groups;
        }
    }

    async delete<T extends HasId>(toDelete: T[], type: SchemaTypeToken<T>, options?: Partial<DeleteOptions>) {
        const fullOptions = { ...this.defaultDeletionOptions, ...options }
        const schema = this.assertTopLevelSchema(this.schemaRegistry.fetchSchema(type));

        schema.metadata.localState.delete( ...toDelete );

        const localDelete = this.localPersistenceService.delete(toDelete, schema);
        let remoteDelete: Promise<(T & HasId)[]>;
        if(fullOptions.shouldPublish) {
            remoteDelete = this.remotePersistenceService.delete(toDelete, schema);
        }

        switch(fullOptions.guarantee) {
            case CompletionGuarantee.IN_MEMORY:
                return Promise.resolve(toDelete);
            case CompletionGuarantee.LOCAL_ONLY:
                return localDelete;
            case CompletionGuarantee.REMOTE_ONLY:
                return remoteDelete;
            case CompletionGuarantee.LOCAL_AND_REMOTE:
                return Promise.all([localDelete, remoteDelete]).then(res => res[0]);
        }
    }

    private createPersistPlan<T>(items: T[], schema: TopLevelSchema<T>) {
        const persistMap = new Map<string, { state: StateBase<any>, items: any[], schema: TopLevelSchema<any> }>(); // Object Store -> Objects being persisted
        
        const persistPlan = (item: T, schema: AnySchema<T>) => {
            if(!item) return;
            const replacements = {};
            for(const entry of Object.entries(schema.fields)) {
                const field = entry[0];
                const graphNode = entry[1] as FieldDefinition<any, any>;

                const [innerSchema, referenceField] = extractSchemaFromDef(graphNode, this.schemaRegistry);

                if(!(field in item)) {
                    continue;
                } else {
                    let toReplace = [];
                    if(item[field] instanceof Array) {
                        toReplace = item[field].map(inner => persistPlan(inner, innerSchema));
                    } else {
                        toReplace = persistPlan(item[field], innerSchema);
                    }
                    if(referenceField) {
                        replacements[referenceField] = toReplace;
                        replacements[field] = undefined;
                    } else {
                        replacements[field] = toReplace;
                    }
                }
            }
            const res = {
                ...(item as any),
                ...Object.entries(replacements).reduce((acc, [field, val]) => {
                    acc[field] = val;
                    return acc;
                }, {})
            };

            if(schema.type === 'top') {
                const key = schema.metadata.idbObjectStore;
                let toPersist;
                let newItem;
                if(res['id'] === undefined) {
                    newItem = {...res, id: uuidv4()}
                } else {
                    newItem = res;
                }
                if(!persistMap.has(key)) {
                    toPersist = { state: schema.metadata.localState, items: [ newItem ], schema }
                } else {
                    toPersist = { state: schema.metadata.localState, items: [...persistMap.get(key).items, newItem], schema}
                }
                persistMap.set(key, toPersist);
                return newItem['id'];
            } else {
                return res;
            }
        }

        items.forEach(item => persistPlan(item, schema));
        const plan: PersistPlan = { groups: [] }
        for(const [key, vals] of persistMap.entries()) {
            plan.groups.push({ store: key, state: vals.state, items: vals.items, schema: vals.schema });
        }
        return plan;

    }

    private assertTopLevelSchema<T>(schema: AnySchema<T>): TopLevelSchema<T> {
        if(schema.type !== 'top') throw new Error('You must pass a top-level schema');
        return schema;
    }
}
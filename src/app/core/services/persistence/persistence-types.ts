import { HasId, StateBase } from "../state";
import { UpgradeDB } from "idb";
import { SchemaTypeToken } from "./schemaTypeToken";

export interface FetchOptions {
    source: FetchSource;
    fallback: boolean;
}

export interface FetchCriteria<T> {
    search: {[ field in keyof T ]?: T[field] }
    fetch?: FetchGraph<T>;
}

type StripArray<T> = T extends Array<any> ? T[0] : T;

export type FetchGraph<T> = {
    [field in keyof T]?: FetchGraph<StripArray<T[field]>> | true
}


export interface PersistenceSchema<T> {
    type: 'top' | 'nested';
    fields: FieldDefinitions<T>
}

export class TopLevelSchema<T> implements PersistenceSchema<T> {
    public type: 'top' = 'top';
    constructor(public metadata: PersistenceMetadata<T, any, any>, public fields: FieldDefinitions<T>) { }
}

export class NestedSchema<T> implements PersistenceSchema<T> {
    public type: 'nested' = 'nested';
    constructor(public fields: FieldDefinitions<T>) { }
}

export type FieldDefinition<T, L extends keyof T> = FieldLink<T, L> | SchemaTypeToken<T>;

export interface FieldLink<T, L extends keyof T> {
    references: keyof T;
    type: SchemaTypeToken<T[L]>
}

export type AnySchema<T> = TopLevelSchema<T> | NestedSchema<T>

export type FieldDefinitions<T> = { 
    [field in keyof T]?: T[field] extends Array<any> 
        ? FieldDefinition<T, field> : FieldDefinition<T, field> 
}

export interface PersistPlan {
    groups: {
        store: string;
        schema: TopLevelSchema<any>
        state: StateBase<any>;
        items: any[];
    }[]
}

//Do I want to generalize this to more types of persistence providers? Maybe make each one its own sub-object?
export interface PersistenceMetadata<StateType extends HasId, IDBPersistenceType = StateType, RemotePersistenceType = StateType> {
    localState: StateBase<StateType>

    idbDatabase: string;
    idbObjectStore: string;

    //These methods are both needed if StateType !== IDBPersistenceType
    idbBeforePersist?: (toPersist: StateType) => IDBPersistenceType;
    idbAfterFetch?: (fetched: IDBPersistenceType) => StateType;

    remoteResourceBulk: string;
    remoteResource: (item: StateType) => string;

    // This may need to change based on how fancy we get with responses
    remoteResourceBeforePersist?: (toPersist: StateType) => RemotePersistenceType;
    remoteResourceAfterFetch?: (fetched: RemotePersistenceType) => StateType;
}

export interface SchemaUpgrade {
    upgrade: (upgrader: UpgradeDB) => void;
}

export interface PersistenceOptions extends MutationOptions{
    
}

export interface DeleteOptions extends MutationOptions {

}

interface MutationOptions {
    shouldPublish: boolean;
    guarantee: CompletionGuarantee;
}

export enum CompletionGuarantee {
    IN_MEMORY,
    LOCAL_ONLY,
    REMOTE_ONLY,
    LOCAL_AND_REMOTE
}

export enum FetchSource {
    LOCAL_FIRST,
    REMOTE_FIRST, 
    REMOTE_ONLY
}

export interface PersistenceProvider {
    fetch<T extends HasId>(schema: TopLevelSchema<T>, criteria?: FetchCriteria<T>): Promise<FetchResult<T>>;
    persist<T extends HasId>(plan: PersistPlan, schema: TopLevelSchema<T>): Promise<void>;
}

export interface FetchResult<T> {
    groups: FetchGroup<T>[];
    error: boolean;
    status: FetchStatus;
}

export interface FetchGroup<T> {
    schema: TopLevelSchema<T>;
    results: T[];
}

export enum FetchStatus {
    OK,
    OUTDATED_RESULT,
    INCOMPLETE_RESULT
}

export enum FetchError {
    NO_RESULT,
    INVALID_RESULT
}
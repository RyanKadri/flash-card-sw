import { HasId, State } from "./state";
import { UpgradeDB } from "idb";

export interface FetchOptions {
    source: FetchSource;
    fallback: boolean;
}

export interface FetchCriteria<T> {
    [field: string]: any
}

export interface PersistenceSchema<T extends HasId> {
    localState: State<T>

    idbDatabase: string;
    idbObjectStore: string;

    remoteResourceBulk: string;
    remoteResource: (item: T) => string;
}

export interface SchemaUpgrade {
    upgrade: (upgrader: UpgradeDB) => void;
}

export interface PersistenceOptions {
    shouldPublish: boolean;
    guarantee: CompletionGuarantee
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
    fetch<T extends HasId>(schema: PersistenceSchema<T>, criteria?: FetchCriteria<T>): Promise<FetchResult<T[]>>;
    persist<T extends HasId>(items: T[], schema: PersistenceSchema<T>): Promise<T[]>;
}

export interface FetchResult<T> {
    result?: T,
    status?: FetchStatus;
    error?: FetchError;
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
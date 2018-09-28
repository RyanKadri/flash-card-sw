import { HasId, State } from "./state";
import { UpgradeDB } from "idb";

export interface FetchOptions {
    source: FetchSource;
    fallback: boolean;
}

export interface FetchCriteria<T> {
    [field: string]: any
}

//Do I want to generalize this to more types of persistence providers? Maybe make each one its own sub-object?
export interface PersistenceSchema<StateType extends HasId, IDBPersistenceType = StateType, RemotePersistenceType = StateType> {
    localState: State<StateType>

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
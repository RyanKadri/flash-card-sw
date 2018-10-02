import { BehaviorSubject, Observable, combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import 'reflect-metadata'
import { SchemaRegistryService } from "./persistence/schema-registry.service";
import { FetchGraph, PersistenceSchema, TopLevelSchema, AnySchema } from "./persistence/persistence-types";
import { extractTopLevelInfo, join } from "./static-libs";
import { SchemaTypeToken } from "./persistence/schemaTypeToken";

export class StateProjection<StateType extends HasId> {
    protected constructor(
        protected schemaService: SchemaRegistryService,
        protected dataSource: Observable<IdMap<StateType>>,
        protected idField?: string,
        protected type?: SchemaTypeToken<StateType>,
    ){ 
        if(!idField) {
            this.idField = this.constructor['idField'] || "id";
        }
        if(!type) {
            this.type = this.constructor['type'];
        }
    }

    select(options: { unique: true}) : Observable<StateType>
    select(): Observable<StateType[]>
    select(options?: { unique: boolean}) {
        return this.dataSource.pipe(
            map(data => {
                const values = Object.values(data);
                if(options && options.unique) {
                    return values[0];
                } else {
                    return values;
                }
            })
        );
    }

    where(search: {[p in keyof StateType]?: StateType[p] | StateType[p][]}): StateProjection<StateType> {
        let searchKeys = Object.keys(search);
        let searchIds: string[];
        let otherKeys = searchKeys.filter(key => key !== this.idField);

        if(searchKeys.includes(this.idField as string)) {
            let searchIds = search[this.idField]
            if(!Array.isArray(searchIds)) {
                searchIds = [searchIds as any];
            }
        }
        const res = this.dataSource.pipe(
            map(data => {
                let searchAmong: StateType[];
                if(searchIds) {
                    searchAmong = searchIds.map(id => data[id])
                } else {
                    searchAmong = Object.values(data);
                }
                const searchResults = searchAmong.filter(item => otherKeys
                    .every(key =>
                        item[key] === searchKeys[key]
                    )
                );
                return searchResults.reduce((acc, res) => {
                    acc[res.id] = res;
                    return acc;
                }, {})
            })
        );
        return new StateProjection(this.schemaService, res, this.idField, this.type);
    }

    join(join: FetchGraph<PersistenceSchema<StateType>>): StateProjection<StateType> {
        const schema = this.schemaService.fetchSchema(this.type) as TopLevelSchema<StateType>;
        const states = extractTopLevelInfo(join, schema, schema => schema.metadata.localState);
        const stateObs = states
            .map(state => state.dataSource
                .pipe(map(source => ({ state, source }))) 
            );
        const joinObs = combineLatest([this.select(), ...stateObs]).pipe(
            map(([current, ...stateGroups]) => {
                const stateMap = new Map<StateProjection<any>, IdMap<any>>();
                (stateGroups as any).forEach(group => stateMap.set(group.state, group.source));
                return this.joinCurrent(current, join, schema, stateMap);
            }),
            map(items => items.
                reduce((acc, el) => {
                    acc[el.id] = el;
                    return acc;
                }, {})
            )
        );
        return new StateProjection(this.schemaService, joinObs, this.idField, this.type);
    }

    private joinCurrent(current: StateType[], graph: FetchGraph<PersistenceSchema<StateType>>, schema: TopLevelSchema<StateType>, stateMap: Map<StateProjection<StateType>, IdMap<StateType>>) {
        return current.map(el => traverse(el, graph, schema));

        function traverse<T>(element: T, graph: FetchGraph<any>, schema: AnySchema<any>): T {
            const newObj: Partial<T> = {};
            for(const [key, val] of Object.entries(element)) {
                const schemaEntry: AnySchema<any> = schema.fields[key];
                const graphEntry = graph[key];
                const elementVal = element[key];
                if(!schemaEntry || !graphEntry) {
                    newObj[key] = elementVal;
                } else {
                    let toTraverse;
                    let replaceKey;
                    if(schemaEntry.type === 'top') {
                        const state = schemaEntry.metadata.localState;
                        const valMap = stateMap.get(state);
                        replaceKey = key.replace(/^_/, '');
                        if(Array.isArray(elementVal)) {
                            toTraverse = elementVal.map(key => valMap[key])
                        } else {
                            toTraverse = valMap[elementVal];
                        }
                    } else {
                        toTraverse = elementVal;
                        replaceKey = key
                    }
                    if(typeof graphEntry !== 'boolean') {
                        if(Array.isArray(toTraverse)) {
                            newObj[replaceKey] = toTraverse.map(res => traverse(res, graphEntry, schemaEntry))
                        } else {
                            newObj[replaceKey] = traverse(toTraverse, graphEntry, schemaEntry);
                        }
                    } else {
                        newObj[replaceKey] = toTraverse;
                    }
                }
            }
            return newObj as T;
        }
    }
}

export abstract class StateBase<StateType extends HasId> extends StateProjection<StateType> {

    private writableSource: BehaviorSubject<IdMap<StateType>>;
    constructor(
        schemaService: SchemaRegistryService
    ) {
        super(schemaService, new BehaviorSubject<IdMap<StateType>>({}));
        this.writableSource = this.dataSource as BehaviorSubject<IdMap<StateType>>;
    }

    upsert(...items: StateType[]) {
        const last = this.writableSource.getValue();
        const next = { ...last, ...items.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {})
        }
        this.writableSource.next(next);
    }

    delete(...items: StateType[]) {
        const last = this.writableSource.getValue();
        const toDelete = new Set<string | number>();
        items.forEach(item => toDelete.add(item.id));
        const next = Object.entries(last)
            .filter(([id]) => !toDelete.has(id))
            .map(([_, val]) => val)
            .reduce((acc, val) => {
                acc[val['id']] = val;
                return acc;
            }, {});
        this.writableSource.next(next);
    }
}

export interface IdMap<T> {
    [id: string]: T;
}

export interface HasId {
    id?: number | string;
}

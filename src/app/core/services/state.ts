import { BehaviorSubject } from "rxjs";
import { map } from "rxjs/operators";

export abstract class State<StateType extends HasId> {
    private writeableObs = new BehaviorSubject<IdMap<StateType>>({});

    upsert(...items: StateType[]) {
        const last = this.writeableObs.getValue();
        const next = { ...last, ...items.reduce((acc, item) => {
                acc[item.id] = item;
                return acc;
            }, {})
        }
        this.writeableObs.next(next);
    }

    select() {
        return this.writeableObs.asObservable().pipe(
            map(stateMap => Object.values(stateMap))
        );
    }
}

export interface IdMap<T> {
    [id: string]: T;
}

export interface HasId {
    id: number | string;
}

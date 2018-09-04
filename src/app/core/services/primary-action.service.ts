import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PrimaryActionService {

  private regActionSub = new BehaviorSubject<RegisteredAction>(undefined);
  private currCallback: () => void;

  constructor() { }

  currentAction(): Observable<RegisteredAction> {
    return this.regActionSub.asObservable().pipe(filter(action => !!action));
  }

  pushPrimaryActionEvent() {
    this.currCallback();
    this.regActionSub.next({
      ...this.regActionSub.getValue(),
      disabled: true
    });
  }

  registerNewAction(action: RegisteredAction) {
    this.regActionSub.next(action);
    this.currCallback = action.callback;
  }

}

export interface RegisteredAction {
  icon: string;
  description?: string;
  callback: () => void;
  disabled?: boolean;
}
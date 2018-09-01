import { Injectable } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PrimaryActionService {

  private regActionSub = new ReplaySubject<RegisteredAction>();
  private actionEventSub = new ReplaySubject<void>();

  constructor() { }

  watchForAction() {
    return this.actionEventSub.asObservable();
  }

  currentAction(): Observable<RegisteredAction> {
    return this.regActionSub.asObservable();
  }

  pushPrimaryActionEvent() {
    this.actionEventSub.next();
  }

  registerNewAction(action: RegisteredAction) {
    this.regActionSub.next(action);
  }

}

export interface RegisteredAction {
  icon: string;
  description?: string;
  disabled?: boolean;
}
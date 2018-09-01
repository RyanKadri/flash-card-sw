import { Component, OnInit } from '@angular/core';
import { PrimaryActionService } from '../services/primary-action.service';
import { map as rxMap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    private primaryActionService: PrimaryActionService
  ) {}
  
  actionIcon: string;
  actionDesc: string;
  actionDisabled: boolean;

  ngOnInit() {
    this.primaryActionService.currentAction().subscribe(action => {
      setTimeout(() => { //TODO - Gross! Why?!
        this.actionIcon = action.icon;
        this.actionDesc = action.description;
        this.actionDisabled = action.disabled;
      })
    })
  }

  primaryAction() {
    this.primaryActionService.pushPrimaryActionEvent();
  }
}

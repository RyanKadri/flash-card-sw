import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNavComponent implements OnInit, OnDestroy {

  constructor(
    private router: Router
  ) { }

  private subs: Subscription[];

  @Output()
  close = new EventEmitter<void>();

  ngOnInit() {
    this.subs = [
      this.router.events.pipe(
        filter(event => event instanceof NavigationStart)
      ).subscribe(evt => this.close.emit())
    ]
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}

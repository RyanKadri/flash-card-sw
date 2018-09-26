import { Component, Input, HostListener, Output, EventEmitter, OnChanges } from "@angular/core";
import { FlashCardInfo } from "../../types/flash-card.types";
import { trigger, state, style, transition, animate } from "@angular/animations";

@Component({
    selector: 'flash-card-panel',
    templateUrl: './flash-card-panel.component.html',
    styleUrls: ['./flash-card-panel.component.scss'],
    animations: [
        trigger('side', [
          state('term', style({
            transform: 'rotateY(0)'
          })),
          state('definition', style({
            transform: 'rotateY(179.9deg)'
          })),
          transition('term => definition', animate('300ms ease-out')),
          transition('definition => term', animate('300ms ease-in'))
        ])
      ]
})
export class FlashCardPanel implements OnChanges {

    @Input()
    card: FlashCardInfo
    _card: FlashCardInfo

    @Input()
    editable = false;

    @Output()
    save = new EventEmitter<FlashCardInfo>();

    @Output()
    delete = new EventEmitter<void>();
    
    editing = false;
    termSide = true;

    get _animationSide() {
        return this.termSide ? "term" : "definition";
    }
    
    ngOnChanges() {
        this._card = { ...this.card };
    }

    edit() {
        this.editing = true;
    }

    _save() {
        this.save.emit(this._card);
        this.editing = false;
    }

    flip() {
        this.termSide = !this.termSide;
    }

}
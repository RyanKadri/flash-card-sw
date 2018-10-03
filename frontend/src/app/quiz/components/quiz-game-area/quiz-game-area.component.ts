import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { QuizInfo, FlashCardInfo } from '../../types/flash-card.types';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'quiz-game-area',
  templateUrl: './quiz-game-area.component.html',
  styleUrls: ['./quiz-game-area.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('cardPos', [
      state('before', style({ transform: 'translateX(-100%)', opacity: 0 })),
      state('after', style({ transform: 'translateX(100%)', opacity: 0 })),
      state('current', style({ transform: 'translateX(0%)'})),
      transition('* <=> *', [
        animate('150ms ease-out')
      ]),
    ])
  ]
})
export class QuizGameCardComponent implements OnChanges {

  constructor() { }

  ngOnChanges() {

  }

  @Input()
  cards: FlashCardInfo[]

  @Input()
  currentCard = 0

  @Output()
  currentCardChange = new EventEmitter<number>()

  private readonly STACK_DEPTH = 2;

  get stack() {
    return this.cards.slice(Math.max(0, this.currentCard - this.STACK_DEPTH), Math.min(this.currentCard + this.STACK_DEPTH, this.cards.length));
  }

  next() {
    if(this.currentCard < this.cards.length - 1) {
      this.currentCardChange.emit(this.currentCard + 1);
    }
  }

  previous() {
    if(this.currentCard > 0) {
      this.currentCardChange.emit(this.currentCard - 1);
    }
  }

  calcState(card: FlashCardInfo) {
    const pos = this.cards.indexOf(card);
    if(pos < this.currentCard) {
      return 'before';
    } else if(pos > this.currentCard) {
      return 'after';
    } else {
      return 'current';
    }
  }

}

import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { QuizInfo, FlashCardInfo } from '../../types/flash-card.types';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'quiz-game-area',
  templateUrl: './quiz-game-area.component.html',
  styleUrls: ['./quiz-game-area.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
  animations: [
    trigger('cardState', [
      transition('void => *', [
        style({
          transform: 'translateX(-100%)'
        }),
        animate('500ms ease-out')
      ]),
      transition('* => void', [
        animate('500ms ease-in', style({ transform: 'translateX(100%' }))
      ])
    ])
  ]
})
export class QuizGameCardComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  @Input()
  cards: FlashCardInfo[]

  @Input()
  currentCard: number

  @Output()
  currentCardChange = new EventEmitter<number>()

  get card() {
    return this.cards[this.currentCard]
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

}

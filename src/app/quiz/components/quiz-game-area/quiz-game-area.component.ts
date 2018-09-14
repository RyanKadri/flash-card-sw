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

  termSide = true;
  _animationSide = "term";

  turnCard() {
    this._animationSide = this.termSide ? 'definition' : 'term';
    this.termSide = !this.termSide;
  }

  next() {
    this.currentCardChange.emit(this.currentCard + 1);
  }

  previous() {
    this.currentCardChange.emit(this.currentCard - 1);
  }

}

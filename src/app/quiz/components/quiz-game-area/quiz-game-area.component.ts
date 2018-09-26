import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { QuizInfo, FlashCardInfo } from '../../types/flash-card.types';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'quiz-game-area',
  templateUrl: './quiz-game-area.component.html',
  styleUrls: ['./quiz-game-area.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default,
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

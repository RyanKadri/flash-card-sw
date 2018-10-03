import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { QuizState } from '../../services/quiz-state';
import { QuizInfo } from '../../types/flash-card.types';

@Component({
  selector: 'play-quiz-view',
  templateUrl: './play-quiz.view.html',
  styleUrls: ['./play-quiz.view.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlayQuizView implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private quizState: QuizState
  ) { }

  quiz: QuizInfo;
  currentCard = 0;

  get percentComplete() {
    return ((this.currentCard + 1) / this.quiz.cards.length);
  }

  ngOnInit() {
    this.quizState.where({
      id: this.route.snapshot.params.quizId
    }).join({
      cards: {
        term: { image: true },
        definition: { image: true} 
      }
    }).select({ unique: true })
    .subscribe(quiz => {
      this.quiz = quiz;
    })
  }
}

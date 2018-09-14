import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { QuizState } from '../../services/quiz-state';
import { Subscription } from 'rxjs';
import { QuizInfo } from '../../types/flash-card.types';
import { Router } from '@angular/router';

@Component({
  selector: 'browse-quizzes-view',
  templateUrl: './browse-quizzes.view.html',
  styleUrls: ['./browse-quizzes.view.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseQuizzesView implements OnInit, OnDestroy {

  constructor(
    private quizState: QuizState,
    private router: Router
  ) { }

  quizzes: QuizInfo[] = [];

  private subs: Subscription[];

  ngOnInit() {
    this.subs = [
      this.quizState.select().subscribe(quizzes => {
        this.quizzes = quizzes;
      })
    ];
  }

  ngOnDestroy() {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  playQuiz(quiz: QuizInfo) {
    this.router.navigate(["/play", quiz.id])
  }

}

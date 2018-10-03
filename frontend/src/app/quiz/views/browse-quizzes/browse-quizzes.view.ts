import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { QuizState } from '../../services/quiz-state';
import { Subscription } from 'rxjs';
import { QuizInfo } from '../../types/flash-card.types';
import { Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { AlertService } from '../../../core/services/alert.service';

@Component({
  selector: 'browse-quizzes-view',
  templateUrl: './browse-quizzes.view.html',
  styleUrls: ['./browse-quizzes.view.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.Default
})
export class BrowseQuizzesView implements OnInit, OnDestroy {

  constructor(
    private quizState: QuizState,
    private router: Router,
    private quizService: QuizService,
    private alertService: AlertService
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

  edit(quiz: QuizInfo) {
    this.router.navigate(["/edit", quiz.id])
  }

  delete(quiz: QuizInfo) {
    this.alertService.showConfirmationAlert({ title: 'Are you sure you want to delete this quiz?'}, () => {
      this.quizService.deleteQuiz(quiz);
    });
  }

  createQuiz() {
    this.router.navigate(['/create'])
  }

}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { QuizPersistenceService } from './quiz-persistence.service';
import { QuizState } from './quiz-state';

@Injectable({
  providedIn: 'root'
})
export class QuizResolver implements Resolve<void> {

  constructor(
    private persistenceService: QuizPersistenceService,
    private quizState: QuizState
  ) { }

  resolve() {
    this.persistenceService.fetchQuizzes().then(quizzes => {
      this.quizState.upsert(...quizzes)
    });
  }
}

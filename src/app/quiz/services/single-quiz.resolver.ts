import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { QuizService } from './quiz.service';

@Injectable({
  providedIn: 'root'
})
export class SingleQuizResolver implements Resolve<void> {

  constructor(
    private quizService: QuizService
  ) { }

  async resolve(route: ActivatedRouteSnapshot) {
    await this.quizService.fetchQuiz(route.params.quizId);
  }
}

import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { QuizService } from './quiz.service';
import { QuizInfo } from '../types/flash-card.types';

@Injectable({
  providedIn: 'root'
})
export class QuizResolver implements Resolve<QuizInfo[]> {

  constructor(
    private quizService: QuizService
  ) { }

  async resolve() {
    return await this.quizService.fetchQuizzes();
  }
}

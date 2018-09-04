import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy } from '@angular/core';
import { QuizState } from '../../../core/services/quiz-state';
import { Observable } from 'rxjs';
import { QuizInfo } from '../../../core/services/quiz-persistence.service';

@Component({
  selector: 'browse-quizzes-view',
  templateUrl: './browse-quizzes.view.html',
  styleUrls: ['./browse-quizzes.view.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrowseQuizzesView implements OnInit {

  constructor(
    private quizState: QuizState
  ) { }

  $quizzes: Observable<QuizInfo[]>;

  ngOnInit() {
    this.$quizzes = this.quizState.select();
  }

}

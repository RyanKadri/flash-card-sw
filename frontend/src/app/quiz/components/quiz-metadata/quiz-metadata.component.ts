import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizInfo } from '../../types/flash-card.types';

@Component({
  selector: 'quiz-metadata',
  templateUrl: './quiz-metadata.component.html',
  styleUrls: ['./quiz-metadata.component.scss']
})
export class QuizMetadataComponent {

  @Input()
  quizMetaData: QuizInfo;

  @Output()
  edit = new EventEmitter<void>();

  @Output()
  save = new EventEmitter<void>();

  @Output()
  play = new EventEmitter<void>();
}

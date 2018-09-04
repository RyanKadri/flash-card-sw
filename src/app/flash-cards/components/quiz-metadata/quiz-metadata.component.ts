import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuizMetadata } from '../../types/flash-card.types';

@Component({
  selector: 'quiz-metadata',
  templateUrl: './quiz-metadata.component.html',
  styleUrls: ['./quiz-metadata.component.scss']
})
export class QuizMetadataComponent {

  @Input()
  quizMetaData: QuizMetadata;

  @Output()
  quizMetaDataChange = new EventEmitter<QuizMetadata>();

}

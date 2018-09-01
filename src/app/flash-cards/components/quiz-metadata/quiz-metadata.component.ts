import { Component, OnInit, Input } from '@angular/core';
import { QuizMetadata } from '../../types/flash-card.types';

@Component({
  selector: 'quiz-metadata',
  templateUrl: './quiz-metadata.component.html',
  styleUrls: ['./quiz-metadata.component.css']
})
export class QuizMetadataComponent implements OnInit {

  @Input()
  quizMetaData: QuizMetadata

  ngOnInit() {
  }

}

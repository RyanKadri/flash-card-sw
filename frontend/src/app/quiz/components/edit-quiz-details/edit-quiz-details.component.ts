import { Component, OnInit, ViewEncapsulation, ChangeDetectionStrategy, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { QuizInfo } from '../../types/flash-card.types';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';

@Component({
  selector: 'edit-quiz-details',
  templateUrl: './edit-quiz-details.component.html',
  styleUrls: ['./edit-quiz-details.component.scss'],
  encapsulation: ViewEncapsulation.Emulated,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditQuizDetailsComponent implements OnChanges {

  constructor() { }

  readonly separatorKeyCodes = [ ENTER, COMMA ]

  leftover = "";

  @Input()
  private details: QuizInfo
  _details: QuizInfo // Mutable Copy

  @Output()
  save = new EventEmitter<QuizInfo>()

  ngOnChanges() {
    this._details = { ...this.details }
  }

  addTag(e: MatChipInputEvent | string) {
    let val: string;
    if(typeof e === 'string') {
      val = e;
    } else {
      val = e.value;
    }
    if(val) {
      this._details.tags = this._details.tags.concat(val);
    }
    this.leftover = "";
  }

  removeTag(tag: string) {
    this._details = { ...this._details, tags: this._details.tags.filter(cat => cat !== tag) };
  }

  _save() {
    if(this.leftover) {
      this.addTag(this.leftover)
    }
    this.save.emit(this._details)
  }

}

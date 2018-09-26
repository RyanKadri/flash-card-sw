import { Component, Output, EventEmitter, OnInit, HostBinding } from "@angular/core";
import { FlashCardInfo } from "../../types/flash-card.types";

@Component({
    selector: 'create-card-panel',
    templateUrl: './create-card-panel.component.html',
    styleUrls: ['./create-card-panel.component.css']
})
export class CreateCardPanel implements OnInit {
    questionSide: boolean;
    question: string;
    answer: string;
    formVal: string;

    @Output()
    create = new EventEmitter<FlashCardInfo>()
    
    ngOnInit(): void {
        this.clearCard();
    }

    attemptSubmit() {
        if(this.questionSide) {
            this.questionSide = false;
            this.question = this.formVal;
            this.formVal = "";
        } else {
            this.answer = this.formVal;
            if(this.question) {
                this.create.emit({ term: this.question, definition: this.answer });
            }
            this.clearCard();
        }
    }

    flipCard() {
        this.questionSide = !this.questionSide;
        this.formVal = this.questionSide ? this.question : this.answer;
    }

    clearCard() {
        this.question = "";
        this.answer = "";
        this.formVal = this.question;
        this.questionSide = true;
    }
}

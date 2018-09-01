import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizMetadata } from "../../types/flash-card.types";
import { PrimaryActionService, RegisteredAction } from "../../../core/services/primary-action.service";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.css']
})
export class CreateQuizView implements OnInit {

    constructor(
        private primaryActionService: PrimaryActionService
    ) { }

    cards: FlashCardInfo[] = [
        {question: "Short Question", answer: "Short Answer"},
        {question: "Long and detailed question", answer: "Well thought-out and researched answer that will definitely not fit on one line" }
    ];

    quizMetaData: QuizMetadata = {
        name: "",
        categories: []
    }

    private readonly saveAction: RegisteredAction = {
        icon: 'check',
        description: 'Save the current test'
    }

    ngOnInit() {
        this.primaryActionService.registerNewAction(this.saveAction);

        this.primaryActionService.watchForAction().subscribe(() => {
            console.log('Save');
            this.primaryActionService.registerNewAction({
                ...this.saveAction,
                disabled: true
            })
        })
    }

    createCard(created: FlashCardInfo) {
        this.cards.unshift(created);
    }

    trackByCard(card) {
        return card.question;
    }
}
import { Component } from "@angular/core";
import { FlashCardInfo, QuizMetadata } from "../types/flash-card.types";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.css']
})
export class CreateQuizView {

    cards: FlashCardInfo[] = [
        {question: "Short Question", answer: "Short Answer"},
        {question: "Long and detailed question", answer: "Well thought-out and researched answer that will definitely not fit on one line" }
    ];

    quizMetaData: QuizMetadata = {
        name: "Untitled Quiz",
        categories: []
    }

    createCard(created: FlashCardInfo) {
        this.cards.unshift(created);
    }

    trackByCard(card) {
        return card.question;
    }
}
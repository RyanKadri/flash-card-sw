import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizMetadata } from "../../types/flash-card.types";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { QuizService } from "../../services/quiz.service";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.scss']
})
export class CreateQuizView implements OnInit {

    constructor(
        private quizService: QuizService,
        private title: Title,
        private router: Router
    ) { }

    cards: FlashCardInfo[] = [];

    quizMetaData: QuizMetadata = {
        name: "",
        categories: []
    }

    selectedCards = new Set<FlashCardInfo>();

    ngOnInit() {
        this.title.setTitle('Create Quiz')
    }

    createQuiz() {
        this.quizService.createQuiz(
            { cards: this.cards, name: this.quizMetaData.name, tags: [], id: undefined }
        );
        this.router.navigate(['/browse'])
    }

    isHighlighted(card: FlashCardInfo) {
        return this.selectedCards.has(card);
    }

    createCard(created: FlashCardInfo) {
        this.cards.unshift({ ...created, id: this.cards.length });
    }

    highlight(card: FlashCardInfo) {
        if(this.selectedCards.has(card)) {
            this.selectedCards.delete(card);
        } else {
            this.selectedCards.add(card);
        }

        navigator.vibrate(80);
    }

    trackByCard(card: FlashCardInfo) {
        return card.id;
    }
}
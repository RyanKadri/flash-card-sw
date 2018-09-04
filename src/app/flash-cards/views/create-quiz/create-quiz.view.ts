import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizMetadata } from "../../types/flash-card.types";
import { PrimaryActionService, RegisteredAction } from "../../../core/services/primary-action.service";
import { QuizPersistenceService } from "../../../core/services/quiz-persistence.service";
import { Title } from "@angular/platform-browser";
import { Router } from "@angular/router";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.scss']
})
export class CreateQuizView implements OnInit {

    constructor(
        private primaryActionService: PrimaryActionService,
        private quizPersistenceService: QuizPersistenceService,
        private title: Title,
        private router: Router
    ) { }

    cards: FlashCardInfo[] = [];

    quizMetaData: QuizMetadata = {
        name: "",
        categories: []
    }

    selectedCards = new Set<FlashCardInfo>()

    private readonly saveAction: RegisteredAction = {
        icon: 'check',
        description: 'Save the current test',
        callback: this.saveCallback.bind(this)
    }

    ngOnInit() {
        this.primaryActionService.registerNewAction(this.saveAction);
        this.title.setTitle('Create Quiz')
    }

    private saveCallback() {
        this.quizPersistenceService.saveQuiz(
            { cards: this.cards, name: this.quizMetaData.name, tags: [], id: Date.now() }
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

        if(this.selectedCards.size === 0) {
            this.primaryActionService.registerNewAction(this.saveAction);
        } else {
            this.primaryActionService.registerNewAction({
                icon: 'delete',
                description: 'Delete Selected Cards',
                callback: () => {
                    this.cards = this.cards.filter(card => !this.selectedCards.has(card));
                    this.primaryActionService.registerNewAction(this.saveAction);
                }
            })
        }
        navigator.vibrate(80);
    }

    trackByCard(card: FlashCardInfo) {
        return card.id;
    }
}
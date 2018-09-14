import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizMetadata } from "../../types/flash-card.types";
import { Router } from "@angular/router";
import { QuizService } from "../../services/quiz.service";
import { MatChipInputEvent } from "@angular/material";
import { ENTER, COMMA } from '@angular/cdk/keycodes'

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.scss']
})
export class CreateQuizView implements OnInit {

    constructor(
        private quizService: QuizService,
        private router: Router
    ) { }

    editing = true;

    cards: FlashCardInfo[] = [];

    metadata: QuizMetadata = { 
        name: "",
        description: "",
        categories: []
    }

    selectedCards = new Set<FlashCardInfo>();

    largeScreen: boolean = false;

    readonly separatorKeyCodes = [ ENTER, COMMA ]

    ngOnInit() {
        const media = matchMedia('(min-width: 700px)');
        this.largeScreen = media.matches;
        media.addListener((evt) => {
            this.largeScreen = evt.matches;
        });
    }

    edit() {
        this.editing = true;
    }

    createQuiz() {
        this.quizService.createQuiz(
            {  name: this.metadata.name, description: this.metadata.description,
                cards: this.cards, tags: this.metadata.categories }
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

    addTag(e: MatChipInputEvent) {
        const input = e.input;
        const val = e.value;
        if(val) {
            this.metadata.categories = this.metadata.categories.concat(val);
        }
        if(input) {
            input.value = '';
        }
    }

    removeTag(tag: string) {
        this.metadata.categories = this.metadata.categories.filter(cat => cat === tag);
    }
}
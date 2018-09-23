import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizMetadata, QuizInfo } from "../../types/flash-card.types";
import { Router, ActivatedRoute } from "@angular/router";
import { QuizService } from "../../services/quiz.service";
import { MatChipInputEvent } from "@angular/material";
import { ENTER, COMMA } from '@angular/cdk/keycodes'
import { QuizState } from "../../services/quiz-state";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.scss']
})
export class CreateQuizView implements OnInit {

    constructor(
        private quizService: QuizService,
        private quizState: QuizState,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    editMetadata = true;
    editMode = false;

    quiz: Partial<QuizInfo> = {
        name: "",
        description: "",
        tags: [],
        cards: []
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
        if(this.route.snapshot.params.quizId) {
            this.quizState.select().subscribe(quizzes => {
                this.quiz = quizzes.find(quiz => quiz.id === this.route.snapshot.params.quizId);
                this.editMetadata = false;
                this.editMode = true;
            })
        }
    }

    edit() {
        this.editMetadata = true;
    }

    save() {
        this.quizService.saveQuiz(this.quiz);
        this.router.navigate(['/browse'])
    }

    isHighlighted(card: FlashCardInfo) {
        return this.selectedCards.has(card);
    }

    createCard(created: FlashCardInfo) {
        this.quiz.cards.unshift({ ...created, id: this.quiz.cards.length });
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
            this.quiz.tags = this.quiz.tags.concat(val);
        }
        if(input) {
            input.value = '';
        }
    }

    removeTag(tag: string) {
        this.quiz = { ...this.quiz, tags: this.quiz.tags.filter(cat => cat !== tag) };
    }
}
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

    largeScreen: boolean = false;
    supportsHover = false;

    ngOnInit() {
        const sizeMedia = matchMedia('(min-width: 700px)');
        this.largeScreen = sizeMedia.matches;
        sizeMedia.addListener((evt) => {
            this.largeScreen = evt.matches;
        });

        const touchMedia = matchMedia('(pointer: fine)');
        this.supportsHover = touchMedia.matches;
        sizeMedia.addListener((evt) => {
            this.supportsHover = evt.matches;
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

    createCard(created: FlashCardInfo) {
        this.quiz.cards.unshift({ ...created, id: this.quiz.cards.length });
        this.quickSave();
    }

    trackByCard(card: FlashCardInfo) {
        return card.id;
    }

    updateDetails(details: QuizInfo) {
        this.editMetadata = false;
        this.quiz = { ...this.quiz, ...details };
        this.quickSave()
        
    }

    updateCard(updated: FlashCardInfo, ind: number) {
        const newCards = [...this.quiz.cards];
        newCards[ind] = updated;
        this.quiz = { ...this.quiz, cards: newCards };
        delete updated['temp'];
        this.quickSave();
    }

    deleteCard(ind: number) {
        const newCards = this.quiz.cards.filter((card, i) => i !== ind);
        this.quiz = { ...this.quiz, cards: newCards };
        this.quickSave();
    }

    insertCard(ind: number) {
        const toInsert = { term: {value: ""}, definition: {value: ""}, temp: true };
        const newCards = [...this.quiz.cards.slice(0, ind), toInsert, ...this.quiz.cards.slice(ind)]
        this.quiz = { ...this.quiz, cards: newCards };
    }

    private quickSave() {
        if(this.editMode) {
            this.quizService.saveQuiz(this.quiz);
        }
    }
}
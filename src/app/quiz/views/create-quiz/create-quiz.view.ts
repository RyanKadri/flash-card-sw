import { Component, OnInit } from "@angular/core";
import { FlashCardInfo, QuizInfo } from "../../types/flash-card.types";
import { Router, ActivatedRoute } from "@angular/router";
import { QuizService } from "../../services/quiz.service";
import { MatChipInputEvent } from "@angular/material";
import { ENTER, COMMA } from '@angular/cdk/keycodes'
import { QuizState } from "../../services/quiz-state";
import { ImageState } from "../../services/image-state";
import { map } from "rxjs/operators";

@Component({
    selector: 'create-quiz-view',
    templateUrl: './create-quiz.view.html',
    styleUrls: ['./create-quiz.view.scss']
})
export class CreateQuizView implements OnInit {

    constructor(
        private quizService: QuizService,
        private quizState: QuizState,
        private imageState: ImageState,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    editMetadata = true;
    editMode = false;

    quiz: Partial<QuizInfo> = {
        name: "",
        description: "",
        tags: [],
        cards: [{ term: { value: "" }, definition: { value: "" }, temp: true} as FlashCardInfo]
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
            this.quizState
                .where({
                    id: this.route.snapshot.params.quizId
                })
                .join({ 
                    cards: {
                        term: { image: true },
                        definition: { image: true }
                    }
                })
                .select({ unique: true })
                .subscribe(quiz => {
                    this.quiz = quiz;
                    this.editMetadata = false;
                    this.editMode = true;
                })
        }
    }

    edit() {
        this.editMetadata = true;
    }

    play() {
        this.quickSave();
        this.router.navigate(['/play', this.quiz.id])
    }

    save() {
        this.quizService.saveQuiz(this.quiz);
        this.router.navigate(['/browse'])
    }

    createCard(created: FlashCardInfo) {
        this.quiz.cards.unshift({ ...created });
        this.quickSave();
    }

    trackByCard(card: FlashCardInfo) {
        return card;
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
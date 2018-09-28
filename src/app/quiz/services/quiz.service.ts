import { Injectable } from "@angular/core";
import { PersistenceService } from "../../core/services/persistence-service";
import { QuizInfo } from "../types/flash-card.types";
import { QuizState } from "./quiz-state";
import { PersistenceSchema, FetchSource } from "../../core/services/persistence-types";
import { PersistenceSchemaService } from "../../core/services/persistence-schema.service";
import { ImageService } from "./image-service";

@Injectable({ providedIn: 'root' })
export class QuizService {

    private readonly quizSchema: PersistenceSchema<QuizInfo>;
    constructor(
        private persistenceService: PersistenceService,
        private imageService: ImageService,
        schemaService: PersistenceSchemaService
    ) {
        this.quizSchema = schemaService.quizSchema;
    }

    fetchQuizzes() : Promise<QuizInfo[]>{
        return this.persistenceService.fetch(this.quizSchema, {}, { source: FetchSource.LOCAL_FIRST });
    }

    fetchQuiz(id: number) {
        return this.persistenceService.fetch(this.quizSchema, { id }, { source: FetchSource.LOCAL_FIRST });
    }

    saveQuiz(quiz: Partial<QuizInfo>) {
        const toPersist = { ...quiz };
        if(!quiz.createdOn) {
            toPersist.createdOn = Date.now();
        }
        return Promise.all(
            [
                this.persistenceService.persist([quiz], this.quizSchema, { shouldPublish: false }),
                quiz.cards.map(card => Promise.all([
                    card.term.image ? this.imageService.persistImage(card.term.image) : Promise.resolve(),
                    card.definition.image ? this.imageService.persistImage(card.definition.image) : Promise.resolve(),
                ]))
            ]
        )
    }

    deleteQuiz(quiz: QuizInfo) {
        this.persistenceService.delete([quiz], this.quizSchema, { shouldPublish: false })
    }
}
import { Injectable } from "@angular/core";
import { PersistenceService } from "../../core/services/persistence-service";
import { QuizInfo } from "../types/flash-card.types";
import { QuizState } from "./quiz-state";
import { PersistenceSchema, FetchSource } from "../../core/services/persistence-types";
import { PersistenceSchemaService } from "../../core/services/persistence-schema.service";

@Injectable({ providedIn: 'root' })
export class QuizService {

    private readonly quizSchema: PersistenceSchema<QuizInfo>;
    constructor(
        private persistenceService: PersistenceService,
        schemaService: PersistenceSchemaService
    ) {
        this.quizSchema = schemaService.quizSchema;
    }

    fetchQuizzes() {
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
        return this.persistenceService.persist([quiz], this.quizSchema, { shouldPublish: false })
    }

    deleteQuiz(quiz: QuizInfo) {
        this.persistenceService.delete([quiz], this.quizSchema, { shouldPublish: false })
    }
}
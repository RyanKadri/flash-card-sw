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

    createQuiz(quiz: QuizInfo) {
        return this.persistenceService.persist([quiz], this.quizSchema, { shouldPublish: false });
    }
}
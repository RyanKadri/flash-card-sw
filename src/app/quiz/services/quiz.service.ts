import { Injectable } from "@angular/core";
import { PersistenceService } from "../../core/services/persistence/persistence-service";
import { QuizInfo } from "../types/flash-card.types";
import { QuizState } from "./quiz-state";
import { PersistenceMetadata, FetchSource, FetchGraph, TopLevelSchema, PersistenceSchema } from "../../core/services/persistence/persistence-types";
import { PersistenceMetadataService } from "../../core/services/persistence/persistence-metadata.service";
import { ImageService } from "./image-service";
import { PersistenceSchemaService } from "../../core/services/persistence/persistence-schema.service";

@Injectable({ providedIn: 'root' })
export class QuizService {

    private readonly quizSchema: TopLevelSchema<QuizInfo>;
    constructor(
        private persistenceService: PersistenceService,
        private schemaService: PersistenceSchemaService
    ) {
        this.quizSchema = this.schemaService.quizSchema;
    }

    async fetchQuizzes() : Promise<void>{
        await this.persistenceService.fetch(this.quizSchema, { search: {} }, { source: FetchSource.LOCAL_FIRST });
    }

    fetchQuiz(id: string) {
        const fetch: FetchGraph<TopLevelSchema<QuizInfo>> = {
            cards: {
                term: { image: true },
                definition: { image: true },
            }
        }
        return this.persistenceService.fetch(this.quizSchema, { search: {id}, fetch }, { source: FetchSource.LOCAL_FIRST });
    }

    saveQuiz(quiz: Partial<QuizInfo>) {
        const toPersist = { ...quiz };
        if(!quiz.createdOn) {
            toPersist.createdOn = Date.now();
        }
        return this.persistenceService.persist([quiz], this.quizSchema, { shouldPublish: false });
    }

    deleteQuiz(quiz: QuizInfo) {
        this.persistenceService.delete([quiz], this.quizSchema, { shouldPublish: false })
    }
}
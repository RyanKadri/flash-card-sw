import { Injectable } from "@angular/core";
import { PersistenceService } from "../../core/services/persistence/persistence-service";
import { QuizInfo } from "../types/flash-card.types";
import { FetchSource, FetchGraph, TopLevelSchema } from "../../core/services/persistence/persistence-types";
import { QUIZ } from "../../core/services/persistence/schemaTypeToken";

@Injectable({ providedIn: 'root' })
export class QuizService {

    constructor(
        private persistenceService: PersistenceService,
    ) {}

    async fetchQuizzes() : Promise<void>{
        await this.persistenceService.fetch(QUIZ, { search: {} }, { source: FetchSource.LOCAL_FIRST });
    }

    fetchQuiz(id: string) {
        const fetch: FetchGraph<QuizInfo> = {
            cards: {
                term: { image: true },
                definition: { image: true },
            }
        }
        return this.persistenceService.fetch(QUIZ, { search: {id}, fetch }, { source: FetchSource.LOCAL_FIRST });
    }

    saveQuiz(quiz: Partial<QuizInfo>) {
        const toPersist = { ...quiz };
        if(!quiz.createdOn) {
            toPersist.createdOn = Date.now();
        }
        return this.persistenceService.persist([quiz], QUIZ, { shouldPublish: false });
    }

    deleteQuiz(quiz: QuizInfo) {
        this.persistenceService.delete([quiz], QUIZ, { shouldPublish: false })
    }
}
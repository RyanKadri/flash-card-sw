import { Injectable } from "@angular/core";
import { QuizState } from "../../quiz/services/quiz-state";
import { PersistenceSchema } from "./persistence-types";
import { QuizInfo } from "../../quiz/types/flash-card.types";
import { HasId, State } from "./state";

@Injectable({ providedIn: 'root'})
export class PersistenceSchemaService {

    quizSchema: PersistenceSchema<QuizInfo>;
    something: PersistenceSchema<any>;

    constructor(
        quizState: QuizState
    ) {

        this.quizSchema = {
            idbDatabase: 'quizzes',
            idbObjectStore: 'quiz-info',
    
            localState: quizState,
            remoteResource: (quiz) => `/api/quizzes/${quiz.id}`,
            remoteResourceBulk: '/api/quizzes'
        }

        this.something = {
            idbDatabase: 'quizzes',
            idbObjectStore: 'blargh',

            localState: quizState,
            remoteResource: () => "test",
            remoteResourceBulk: "test"
        }
    }


}
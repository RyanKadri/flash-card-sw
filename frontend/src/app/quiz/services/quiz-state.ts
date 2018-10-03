import { Injectable } from "@angular/core";
import { StateBase } from "../../core/services/state";
import { QuizInfo } from "../types/flash-card.types";
import { QUIZ } from "../../core/services/persistence/schemaTypeToken";

@Injectable({ providedIn: 'root' })
export class QuizState extends StateBase<QuizInfo> {
    static type = QUIZ
}

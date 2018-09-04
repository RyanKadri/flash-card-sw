import { Injectable } from "@angular/core";
import { State } from "./state";
import { QuizInfo } from "./quiz-persistence.service";

@Injectable({ providedIn: 'root' })
export class QuizState extends State<QuizInfo> { }
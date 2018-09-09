import { Injectable } from "@angular/core";
import { State } from "../../core/services/state";
import { QuizInfo } from "../types/flash-card.types";

@Injectable({ providedIn: 'root' })
export class QuizState extends State<QuizInfo> { }

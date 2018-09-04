import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuizView } from "../flash-cards/views/create-quiz/create-quiz.view";
import { BrowseQuizzesView } from "../flash-cards/views/browse-quizzes/browse-quizzes.view";
import { QuizResolver } from "./services/quiz-resolver.service";

const routes : Routes = [
    { path: 'create', component: CreateQuizView },
    { path: 'browse', component: BrowseQuizzesView, resolve: [ QuizResolver ]},
    { path: '**', redirectTo: 'create' }
]

@NgModule({
    imports: [ 
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {

}
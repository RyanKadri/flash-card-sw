import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuizView } from "../quiz/views/create-quiz/create-quiz.view";
import { BrowseQuizzesView } from "../quiz/views/browse-quizzes/browse-quizzes.view";
import { QuizResolver } from "../quiz/services/quiz-resolver.service";
import { InitResolver } from "./services/init-resolver";

const routes : Routes = [
    { path: '', resolve: [ InitResolver ], children: [
        { path: 'create', component: CreateQuizView },
        { path: 'browse', component: BrowseQuizzesView, resolve: [ QuizResolver ]},
        { path: '**', redirectTo: 'browse' }
    ]},
]

@NgModule({
    imports: [ 
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {

}
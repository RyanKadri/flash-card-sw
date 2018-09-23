import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuizView } from "../quiz/views/create-quiz/create-quiz.view";
import { BrowseQuizzesView } from "../quiz/views/browse-quizzes/browse-quizzes.view";
import { QuizResolver } from "../quiz/services/quiz-resolver.service";
import { InitResolver } from "./services/init-resolver";
import { PageNotFoundView } from "./views/page-not-found/page-not-found.component";
import { PlayQuizView } from "../quiz/views/play-quiz-view/play-quiz.view";
import { SingleQuizResolver } from "../quiz/services/single-quiz.resolver";

const routes : Routes = [
    { path: '', resolve: [ InitResolver ], children: [
        { path: 'create', component: CreateQuizView },
        { path: 'browse', component: BrowseQuizzesView, resolve: [ QuizResolver ]},
        { path: 'play/:quizId', component: PlayQuizView, resolve: [ SingleQuizResolver ]},
        { path: 'edit/:quizId', component: CreateQuizView, resolve: [ SingleQuizResolver ]},
        { path: '', pathMatch: 'full', redirectTo: '/browse' },
        { path: '**', component: PageNotFoundView }
    ]},
]

@NgModule({
    imports: [ 
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {

}
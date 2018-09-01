import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { CreateQuizView } from "../flash-cards/views/create-quiz.view";

const routes : Routes = [
    { path: 'create', component: CreateQuizView },
    { path: '**', redirectTo: 'create' }
]

@NgModule({
    imports: [ 
        RouterModule.forRoot(routes)
    ]
})
export class AppRoutingModule {

}
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './core/app-component/app.component';
import { CommonMaterialModule } from './core/common-material.module';
import { AppRoutingModule } from './core/app.routing.module';
import { CreateQuizView } from './flash-cards/views/create-quiz/create-quiz.view';
import { CreateCardPanel } from './flash-cards/components/create-card-panel/create-card-panel.component';
import { FlashCardPanel } from './flash-cards/components/flash-card-panel/flash-card-panel.component';
import { FormsModule } from '@angular/forms';
import { QuizMetadataComponent } from './flash-cards/components/quiz-metadata/quiz-metadata.component';
import { BrowseQuizzesView } from './flash-cards/views/browse-quizzes/browse-quizzes.view';
import { SideNavComponent } from './core/side-nav/side-nav/side-nav.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

@NgModule({
  imports: [
    BrowserModule,
    CommonMaterialModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production })
  ],
  declarations: [
    AppComponent,
    CreateQuizView,
    CreateCardPanel,
    FlashCardPanel,
    QuizMetadataComponent,
    BrowseQuizzesView,
    SideNavComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

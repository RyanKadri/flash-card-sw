import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'

import { AppComponent } from './core/app-component/app.component';
import { CommonMaterialModule } from './core/common-material.module';
import { AppRoutingModule } from './core/app.routing.module';
import { CreateQuizView } from './quiz/views/create-quiz/create-quiz.view';
import { CreateCardPanel } from './quiz/components/create-card-panel/create-card-panel.component';
import { FlashCardPanel } from './quiz/components/flash-card-panel/flash-card-panel.component';
import { FormsModule } from '@angular/forms';
import { QuizMetadataComponent } from './quiz/components/quiz-metadata/quiz-metadata.component';
import { BrowseQuizzesView } from './quiz/views/browse-quizzes/browse-quizzes.view';
import { SideNavComponent } from './core/side-nav/side-nav/side-nav.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { PlayQuizView } from './quiz/views/play-quiz-view/play-quiz.view';
import { PageNotFoundView } from './core/views/page-not-found/page-not-found.component';
import { QuizGameCardComponent } from './quiz/components/quiz-game-area/quiz-game-area.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonMaterialModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    HttpClientModule,
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
    PlayQuizView,
    PageNotFoundView,
    QuizGameCardComponent
  ],
  entryComponents: [
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

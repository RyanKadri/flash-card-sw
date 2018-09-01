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

@NgModule({
  imports: [
    BrowserModule,
    CommonMaterialModule,
    AppRoutingModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule
  ],
  declarations: [
    AppComponent,
    CreateQuizView,
    CreateCardPanel,
    FlashCardPanel,
    QuizMetadataComponent,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

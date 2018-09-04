import { Injectable } from '@angular/core';
import { FlashCardInfo } from '../../flash-cards/types/flash-card.types';
import idb, { UpgradeDB } from 'idb';
import { QuizState } from './quiz-state';

const nav: Navigator & {storage: { persist: any }} = window.navigator as any
@Injectable({
  providedIn: 'root'
})
export class QuizPersistenceService {

  constructor(
    private quizState: QuizState
  ) { }

  async saveQuiz(quiz: QuizInfo) {
    if(nav.storage && nav.storage.persist) {
      const persisted = await nav.storage.persist();
      if(!persisted) {
        alert("Persistence Permission Denied for IDB");
      }
    }

    const db = await idb.open('quizzes', 2, this.upgradeDb);
    const tx = db.transaction('quiz-defs', 'readwrite');
    const store = tx.objectStore('quiz-defs');
    await store.put(quiz);
    await tx.complete;
    db.close();
    this.quizState.upsert(quiz);
  }

  async fetchQuizzes() {
    const db = await idb.open('quizzes', 2, this.upgradeDb);
    const tx = db.transaction('quiz-defs', 'readonly');
    const store = tx.objectStore('quiz-defs');
    const quizzes = await store.getAll();
    db.close();
    return quizzes as QuizInfo[];
  }

  private upgradeDb(upgrade: UpgradeDB) {
    upgrade.createObjectStore('quiz-defs', { autoIncrement: true })
  }
}

export interface QuizInfo {
  id: number;
  name: string;
  tags: string[];
  cards: FlashCardInfo[];
}

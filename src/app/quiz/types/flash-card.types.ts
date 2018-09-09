export interface FlashCardInfo {
    question: string;
    answer: string;
    id?: number;
}

export interface QuizMetadata {
    name: string;
    categories: string[] //TODO - For now
}

export interface QuizInfo {
    id: number;
    name: string;
    tags: string[];
    cards: FlashCardInfo[];
}
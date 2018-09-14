export interface FlashCardInfo {
    question: string;
    answer: string;
    id?: number;
}

export interface QuizMetadata {
    name: string;
    description: string;
    categories: string[] //TODO - For now
}

export interface QuizInfo {
    id: string;
    name: string;
    description: string;
    createdOn: number;
    tags: string[];
    cards: FlashCardInfo[];
}
export interface FlashCardInfo {
    term: FlashCardSide;
    definition: FlashCardSide; 
    id?: number;
}

export interface FlashCardSide {
    value: string;
    image?: string;
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
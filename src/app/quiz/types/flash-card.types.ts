export interface FlashCardInfo {
    term: FlashCardSide;
    definition: FlashCardSide; 
}

export interface FlashCardSide {
    value: string;
    image?: ImageInfo;
}

export interface ImageInfo {
    id?: string;
    data?: Blob;
    type: string;
    url: string;
}

export interface QuizInfo {
    id: string;
    name: string;
    description: string;
    createdOn: number;
    tags: string[];
    cards: FlashCardInfo[];
}
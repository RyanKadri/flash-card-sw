import { QuizInfo, ImageInfo, FlashCardSide, FlashCardInfo } from "../../../quiz/types/flash-card.types";

export class SchemaTypeToken<T> {
    constructor(
        public descriptor
    ){ }
}

export const QUIZ = new SchemaTypeToken<QuizInfo>('quiz');
export const IMAGE = new SchemaTypeToken<ImageInfo>('image');
export const CARD_SIDE = new SchemaTypeToken<FlashCardSide>('card_side');
export const CARD = new SchemaTypeToken<FlashCardInfo>('card');
import { Injectable } from "@angular/core";
import { PersistenceMetadataService } from "./persistence-metadata.service";
import { TopLevelSchema, NestedSchema } from "./persistence-types";
import { QuizInfo, FlashCardInfo, FlashCardSide, ImageInfo } from "../../../quiz/types/flash-card.types";

@Injectable({
    providedIn: 'root'
})
export class PersistenceSchemaService {

    public readonly quizSchema: TopLevelSchema<QuizInfo>;
    public readonly cardSchema: NestedSchema<FlashCardInfo>;
    public readonly cardSideSchema: NestedSchema<FlashCardSide>;
    public readonly imageSchema: TopLevelSchema<ImageInfo>

    constructor(
        private metadataService: PersistenceMetadataService
    ) {
        this.imageSchema = new TopLevelSchema<ImageInfo>(this.metadataService.imageSchema, {

        })
        this.cardSideSchema = new NestedSchema<FlashCardSide>({
            image: this.imageSchema
        })
        this.cardSchema = new NestedSchema<FlashCardInfo>({
            term: this.cardSideSchema,
            definition: this.cardSideSchema
        })
        this.quizSchema = new TopLevelSchema<QuizInfo>(this.metadataService.quizSchema, {
            cards: this.cardSchema
        })
    }
}
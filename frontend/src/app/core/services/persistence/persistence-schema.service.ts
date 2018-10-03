import { Injectable } from "@angular/core";
import { PersistenceMetadataService } from "./persistence-metadata.service";
import { TopLevelSchema, NestedSchema, FieldLink } from "./persistence-types";
import { QuizInfo, FlashCardInfo, FlashCardSide, ImageInfo } from "../../../quiz/types/flash-card.types";
import { SchemaRegistryService } from "./schema-registry.service";
import { IMAGE, QUIZ, CARD_SIDE, CARD } from "./schemaTypeToken";

@Injectable({
    providedIn: 'root'
})
export class PersistenceSchemaService {

    constructor(
        private metadataService: PersistenceMetadataService,
        private schemaRegistry: SchemaRegistryService
    ) { }
    
    initialize() {
        const imageSchema = new TopLevelSchema<ImageInfo>(this.metadataService.imageSchema, {
            
        })
        const cardSideSchema = new NestedSchema<FlashCardSide>({
            image: { references: "_image", type: IMAGE }
        })
        const cardSchema = new NestedSchema<FlashCardInfo>({
            term: CARD_SIDE,
            definition: CARD_SIDE
        })
        const quizSchema = new TopLevelSchema<QuizInfo>(this.metadataService.quizSchema, {
            cards: CARD
        })
    
        this.schemaRegistry.registerSchema(IMAGE, imageSchema)
        this.schemaRegistry.registerSchema(CARD_SIDE, cardSideSchema)
        this.schemaRegistry.registerSchema(CARD, cardSchema)
        this.schemaRegistry.registerSchema(QUIZ, quizSchema)
    }
}
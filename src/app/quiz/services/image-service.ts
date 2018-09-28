import { Injectable } from "@angular/core";
import { ImageInfo, FlashCardInfo, FlashCardSide } from "../types/flash-card.types";
import { PersistenceService } from "../../core/services/persistence-service";
import { PersistenceSchemaService } from "../../core/services/persistence-schema.service";
import { FetchSource } from "../../core/services/persistence-types";

@Injectable({
    providedIn: 'root'
})
export class ImageService {

    constructor(
        private persistenceService: PersistenceService,
        private schemaService: PersistenceSchemaService
    ) {}

    attachImage(side: FlashCardSide, image: File) {
        const oldImage = side.image;
        const newImage = { 
            type: image.type, // TODO - Modify to check type more rigorously
            data: image,
            url: URL.createObjectURL(image)
        }
        if(oldImage) {
            URL.revokeObjectURL(oldImage.url);
        }
        return { ...side, image: newImage };
    }

    // TODO - Can this be safer? Require a close() somehow?
    removeImage(side: FlashCardSide) {
        if(side.image) {
            URL.revokeObjectURL(side.image.url) 
        }
        side.image = undefined;
    }

    persistImage(image: ImageInfo) {
        this.persistenceService.persist([image], this.schemaService.imageSchema, { shouldPublish: false })
    }

    fetchImage(id: string) {
        return this.persistenceService.fetch(this.schemaService.imageSchema, { id }, { source: FetchSource.LOCAL_FIRST })
            .then(images => images[0]);
    }
}

export interface IDBImageData {
    id?: string;
    data: Blob;
    createdDate?: number;
}

//Placeholder
export interface RemoteImageData {
    id: string;
    data: Blob;
}
import { Injectable } from "@angular/core";
import { FlashCardSide } from "../types/flash-card.types";

@Injectable({
    providedIn: 'root'
})
export class ImageService {

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
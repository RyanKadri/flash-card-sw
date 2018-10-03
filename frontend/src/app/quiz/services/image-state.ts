import { Injectable } from "@angular/core";
import { StateBase } from "../../core/services/state";
import { ImageInfo } from "../types/flash-card.types";
import { IMAGE } from "../../core/services/persistence/schemaTypeToken";

@Injectable({providedIn: 'root'})
export class ImageState extends StateBase<ImageInfo> { 
    static type = IMAGE;
}
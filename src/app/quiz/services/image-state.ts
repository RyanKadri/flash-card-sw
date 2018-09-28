import { Injectable } from "@angular/core";
import { State } from "../../core/services/state";
import { ImageInfo } from "../types/flash-card.types";

@Injectable({providedIn: 'root'})
export class ImageState extends State<ImageInfo> { }
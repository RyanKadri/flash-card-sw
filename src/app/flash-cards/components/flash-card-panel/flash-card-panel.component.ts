import { Component, Input } from "@angular/core";
import { FlashCardInfo } from "../../types/flash-card.types";

@Component({
    selector: 'flash-card-panel',
    templateUrl: './flash-card-panel.component.html',
    styleUrls: ['./flash-card-panel.component.css']
})
export class FlashCardPanel {

    @Input()
    cardInfo: FlashCardInfo

}
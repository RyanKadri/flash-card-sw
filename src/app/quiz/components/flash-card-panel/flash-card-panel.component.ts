import { Component, Input, HostListener, Output, EventEmitter, OnChanges } from "@angular/core";
import { FlashCardInfo } from "../../types/flash-card.types";
import { trigger, state, style, transition, animate } from "@angular/animations";
import { DomSanitizer, SafeStyle } from "@angular/platform-browser";

@Component({
    selector: 'flash-card-panel',
    templateUrl: './flash-card-panel.component.html',
    styleUrls: ['./flash-card-panel.component.scss'],
    animations: [
        trigger('side', [
          state('term', style({
            transform: 'rotateY(0)'
          })),
          state('definition', style({
            transform: 'rotateY(179.9deg)'
          })),
          transition('term => definition', animate('300ms ease-out')),
          transition('definition => term', animate('300ms ease-in'))
        ])
      ]
})
export class FlashCardPanel implements OnChanges {

    constructor(
        private domSanitizer: DomSanitizer
    ) {}

    @Input()
    card: FlashCardInfo
    _card: FlashCardInfo

    @Input()
    editable = false;

    @Output()
    save = new EventEmitter<FlashCardInfo>();

    @Output()
    delete = new EventEmitter<void>();
    
    editing = false;
    termSide = true;
    termImage: SafeStyle;
    definitionImage: SafeStyle;

    get _animationSide() {
        return this.termSide ? "term" : "definition";
    }
    
    ngOnChanges() {
        this._card = { ...this.card };
    }

    edit() {
        this.editing = true;
    }

    _save() {
        this.save.emit(this._card);
        this.editing = false;
    }

    //TODO - Is this a bad idea?
    flip(e: MouseEvent) {
        if(e.target === e.currentTarget) {
            this.termSide = !this.termSide;
        }
    }

    //TODO - Look at magic numbers for file types maybe?
    attachImage(e: Event) {
        const input = e.target as HTMLInputElement;
        if(input.files && input.files.length === 1) {
            const file = input.files[0];
            this.updateImage(file);
        }
    }

    private updateImage(blob: Blob) {
        let oldImage: SafeStyle;
        if(this.termSide) {
            oldImage = this.termImage;
            this.termImage = this.domSanitizer.bypassSecurityTrustStyle(`url(${URL.createObjectURL(blob)})`)
        } else {
            oldImage = this.definitionImage;
            this.definitionImage = URL.createObjectURL(blob);
        }
        if(oldImage) {
            URL.revokeObjectURL(oldImage + "");
        }
    }
}
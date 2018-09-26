import { Component, Input, HostListener, Output, EventEmitter, OnChanges, OnInit } from "@angular/core";
import { FlashCardInfo, FlashCardSide } from "../../types/flash-card.types";
import { trigger, state, style, transition, animate, sequence } from "@angular/animations";
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
            transform: 'rotateY(0)'
          })),
          state('side', style({})),
          transition('term => side', sequence([
            animate('150ms ease-in', style({ transform: 'rotateY(90deg)'})),
          ])),
          transition('definition => side', sequence([
              animate('150ms ease-in', style({ transform: 'rotateY(-90deg)'})),
          ])),
          transition('side => *', animate('150ms ease-out', style({ transform: 'rotateY(0deg)' })))
        ])
      ]
})
export class FlashCardPanel implements OnInit, OnChanges {

    @Input()
    card: FlashCardInfo
    _card: FlashCardInfo

    @Input()
    editable = false;

    @Input()
    openWithEdit = false;

    @Output()
    save = new EventEmitter<FlashCardInfo>();

    @Output()
    delete = new EventEmitter<void>();
    
    editing = false;
    termSide = true;
    animating = false;
   
    get _animationSide() {
        if(this.animating) {
            return 'side';
        } else {
            return this.termSide ? "term" : "definition";
        }
    }

    get currentSide() {
        return this.termSide ? this._card.term : this._card.definition;
    }

    ngOnInit() {
    }
    
    ngOnChanges() {
        this._card = { ...this.card };
        if(this.openWithEdit) {
            this.editing = true;
        }
    }

    edit() {
        this.editing = true;
    }

    _save() {
        this.save.emit(this._card);
        this.editing = false;
    }

    //TODO - Is this a bad idea?
    flip(e?: MouseEvent) {
        if(!e || e.target === e.currentTarget) {
            this.animating = true;
        }
    }

    pressEnter() {
        if((this.termSide && !this.card.definition.value) || (!this.termSide && !this.card.term.value)) {
            this.flip();
        } else {
            this._save();
        }
    }

    continueFlip() {
        if(this.animating) {
            this.animating = false;
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
        const oldImage = this.currentSide.image;
        this.currentSide.image = URL.createObjectURL(blob);
        if(oldImage) {
            URL.revokeObjectURL(oldImage);
        }
    }

    removeImage() {
        this.currentSide.image = undefined;
    }
}
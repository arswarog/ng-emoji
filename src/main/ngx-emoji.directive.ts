import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
    selector: '[ngxEmoji]'
})
export class NgxEmojiDirective {
    private contenteditable: boolean = false;

    public constructor(protected elRef: ElementRef) {
    }

    @Input('attr.contenteditable') set attrContenteditable(editable: boolean) {
        this.setContentEditable(editable);
    }

    @Input('contenteditable') set inputContenteditable(editable: boolean) {
        this.setContentEditable(editable);
    }

    public setContentEditable(editable: boolean): void {
        this.contenteditable = editable;
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
    }

    public isContentEditable(): boolean {
        return this.contenteditable;
    }

}

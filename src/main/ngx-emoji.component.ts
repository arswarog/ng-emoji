import { Component, OnDestroy, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { NgxHtmlConverter } from "./ngx-html.converter";
import { Subscription } from "rxjs/Subscription";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";

export interface EnterOn {
    shift?: boolean;
    ctrl?: boolean;
}

export interface SelectionRange {
    start: number;
    stop: number;
}

@Component({
    selector: 'ngx-emoji',
    template: ''
})
export class NgxEmojiComponent implements OnDestroy {
    private contenteditable: boolean = false;
    private enterOn: EnterOn = {
        shift: false,
        ctrl: false
    };
    protected readonly htmlConverter = new NgxHtmlConverter();
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription = new Subscription();
    protected lastSelectionRange: SelectionRange = {
        start: 0,
        stop: 0
    };

    public constructor(
        protected elRef: ElementRef,
        globalEmojiService: NgxEmojiService
    ) {
        let component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        let subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji: string) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }

    public ngOnDestroy(): void {
        this.emojiServiceSubscription.unsubscribe();
    }

    public addEmojiService(service: NgxEmojiService): void {
        service.setActiveComponent(this);
        let component = this;
        let subscription = service.onEmojiPicked.subscribe(function (emoji: string) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }

    @Input('picker')
    protected set inputPicker(pickerComponent: NgxEmojiPickerComponent) {
        this.emojiServiceSubscription.unsubscribe();
        this.emojiServiceSubscription = new Subscription();
        this.emojiService = new NgxEmojiService();
        this.emojiService.setActiveComponent(this);
        pickerComponent.setEmojiService(this.emojiService);
        let component = this;
        let subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji: string) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }

    @Input('attr.contenteditable')
    protected set attrContenteditable(editable: boolean) {
        this.setContentEditable(editable);
    }

    @Input('contenteditable')
    protected set inputContenteditable(editable: boolean) {
        this.setContentEditable(editable);
    }

    @Input('enterOn')
    protected set inputEnterOn(enterOn: EnterOn) {
        this.enterOn = enterOn;
    }

    @Input('text')
    protected set inputText(text: string) {
        this.setText(text);
    }

    @Output('text')
    protected readonly onText: EventEmitter<string> = new EventEmitter<string>();

    @Output('enter')
    protected readonly onEnter: EventEmitter<void> = new EventEmitter<void>();

    @Output('entities')
    protected readonly onEntities: EventEmitter<void> = new EventEmitter<void>();

    @HostListener("keydown.enter", ['$event'])
    protected onKeydownEnter(event: KeyboardEvent): void {
        if (!this.isContentEditable()) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsEnter()) {
            this.emitEnter();
        } else {
            this.insertNewLine();
        }
    }

    @HostListener("keydown.control.enter", ['$event'])
    protected onKeydownControlEnter(event: KeyboardEvent): void {
        if (!this.isContentEditable()) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsCtrlEnter()) {
            this.emitEnter();
        }
    }

    @HostListener("keydown.shift.enter", ['$event'])
    protected onKeydownShiftEnter(event: KeyboardEvent): void {
        if (!this.isContentEditable()) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsShiftEnter()) {
            this.emitEnter();
        }
    }

    @HostListener("focus")
    protected onFocus(): void {
        this.emojiService.setActiveComponent(this);
    }

    @HostListener("focusout")
    protected onFocusout(): void {
        this.lastSelectionRange = this.getSelectionRange();
    }

    public setContentEditable(editable: boolean): void {
        /*if (this.contenteditable != editable && editable == true) {
            this.elRef.nativeElement.innerHTML = this.htmlConverter.fromHtml(this.elRef.nativeElement.innerHTML);
        }
        if (this.contenteditable != editable && editable == false) {
            this.elRef.nativeElement.innerHTML = this.htmlConverter.toHtml(this.elRef.nativeElement.innerHTML);
        }*/
        this.contenteditable = editable;
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
    }

    public isContentEditable(): boolean {
        return this.contenteditable;
    }

    public enterKeyIsEnter(): boolean {
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    }

    public enterKeyIsCtrlEnter(): boolean {
        return (this.enterOn.ctrl) ? true : false;
    }

    public enterKeyIsShiftEnter(): boolean {
        return (this.enterOn.shift) ? true : false;
    }

    public setText(text: string): void {
        this.elRef.nativeElement.innerHTML = this.htmlConverter.filterHtml(text);
    }

    public getText(): string {
        let text = this.elRef.nativeElement.innerHTML;
        // hotfix to insert new line
        if (text.substr(text.length - 2) == '\n\n') {
            text = text.substr(0, text.length - 1);
        }
        return text;
    }

    public getNativeElement(): HTMLElement {
        return this.elRef.nativeElement;
    }

    protected emitEnter(): void {
        this.onText.emit(this.getText());
        this.onEnter.emit();
        this.elRef.nativeElement.innerHTML = '';
    }

    protected insertNewLine(): void {
        this.insertText('\n');
    }

    protected insertEmoji(emoji: string): void {
        if (!this.isContentEditable()) {
            return;
        }
        if (!this.emojiService.isActiveComponent(this)) {
            return;
        }
        this.insertText(' ' + emoji + ' ');
    }

    protected insertText(text: string): void {
        let currentText = this.elRef.nativeElement.innerHTML;
        let selection: SelectionRange;
        if (document.activeElement === this.elRef.nativeElement) {
            selection = this.getSelectionRange();
        } else {
            selection = this.lastSelectionRange;
        }

        this.elRef.nativeElement.innerHTML =
            currentText.substr(0, selection.start)
            + text
            + currentText.substr(selection.stop);

        // hotfix to insert new line
        if (selection.stop == currentText.length && text == '\n') {
            this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerHTML + '\n';
        }

        this.setCaretPosition(selection.start + text.length);
    }

    protected getSelectionRange(): SelectionRange {
        let selection = window.getSelection();
        let start = 0;
        let stop = 0;

        if (selection.type == 'Caret') {
            start = selection.extentOffset;
            stop = selection.extentOffset;
        }
        if (selection.type == 'Range') {
            start = selection.extentOffset;
            stop = selection.anchorOffset;
            if (start > stop) {
                start = selection.anchorOffset;
                stop = selection.extentOffset;
            }
        }
        return {
            start: start,
            stop: stop
        }
    }

    protected setCaretPosition(pos: number): void {
        let selection = window.getSelection();
        selection.collapse(this.elRef.nativeElement.firstChild, pos);
    }

}

import { OnDestroy, ElementRef, EventEmitter } from '@angular/core';
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
export declare class NgxEmojiComponent implements OnDestroy {
    protected elRef: ElementRef;
    private contenteditable;
    private enterOn;
    protected readonly htmlConverter: NgxHtmlConverter;
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription;
    protected lastSelectionRange: SelectionRange;
    constructor(elRef: ElementRef, globalEmojiService: NgxEmojiService);
    ngOnDestroy(): void;
    addEmojiService(service: NgxEmojiService): void;
    protected inputPicker: NgxEmojiPickerComponent;
    protected attrContenteditable: boolean;
    protected inputContenteditable: boolean;
    protected inputEnterOn: EnterOn;
    protected inputText: string;
    protected readonly onText: EventEmitter<string>;
    protected readonly onEnter: EventEmitter<void>;
    protected readonly onEntities: EventEmitter<void>;
    protected onKeydownEnter(event: KeyboardEvent): void;
    protected onKeydownControlEnter(event: KeyboardEvent): void;
    protected onKeydownShiftEnter(event: KeyboardEvent): void;
    protected onFocus(): void;
    protected onFocusout(): void;
    setContentEditable(editable: boolean): void;
    isContentEditable(): boolean;
    enterKeyIsEnter(): boolean;
    enterKeyIsCtrlEnter(): boolean;
    enterKeyIsShiftEnter(): boolean;
    setText(text: string): void;
    getText(): string;
    getNativeElement(): HTMLElement;
    protected emitEnter(): void;
    protected insertNewLine(): void;
    protected insertEmoji(emoji: string): void;
    protected insertText(text: string): void;
    protected getSelectionRange(): SelectionRange;
    protected setCaretPosition(pos: number): void;
}

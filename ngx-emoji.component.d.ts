import { OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
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
export declare enum NgxEmojiEntityType {
    Bold = "bold",
    Italic = "italic",
    Underline = "underline",
}
export interface NgxEmojiEntity {
    type: NgxEmojiEntityType;
    offset: number;
    length: number;
}
export declare class NgxEmojiComponent implements OnDestroy {
    protected elRef: ElementRef;
    private _contenteditable;
    private _enterOn;
    private prevent;
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription;
    protected lastSelectionRange: Range;
    protected readonly allowedTags: string[];
    constructor(elRef: ElementRef, globalEmojiService: NgxEmojiService);
    getNativeElement(): HTMLElement;
    ngOnDestroy(): void;
    addEmojiService(service: NgxEmojiService): void;
    /**
     * Emoji picker
     */
    protected inputPicker: NgxEmojiPickerComponent;
    /**
     * Content editable
     */
    protected attrContenteditable: boolean;
    contenteditable: boolean;
    readonly onContenteditable: EventEmitter<boolean>;
    /**
     * Enter on
     */
    enterOn: EnterOn;
    readonly onEnterOn: EventEmitter<EnterOn>;
    enterKeyIsEnter(): boolean;
    enterKeyIsCtrlEnter(): boolean;
    enterKeyIsShiftEnter(): boolean;
    /**
     * HTML
     */
    fullHtml: string;
    readonly onFullHtml: EventEmitter<string>;
    /**
     * HTML wihout parahraphs
     */
    html: string;
    protected getHtml(rootElement: HTMLElement): string;
    readonly onHtml: EventEmitter<string>;
    /**
     * Text
     */
    text: string;
    readonly onText: EventEmitter<string>;
    /**
     * Entities
     */
    protected normalizeEntityType(type: any): NgxEmojiEntityType;
    entities: NgxEmojiEntity[];
    readonly onEntities: EventEmitter<NgxEmojiEntity[]>;
    /**
     * Enter events
     */
    readonly onEnter: EventEmitter<void>;
    protected onKeydownEnter(event: KeyboardEvent): void;
    protected onKeydownControlEnter(event: KeyboardEvent): void;
    protected onKeydownShiftEnter(event: KeyboardEvent): void;
    protected emitEnter(): void;
    /**
     * Keyboard events
     */
    protected onKeydown(event: KeyboardEvent): void;
    /**
     * Focus events
     */
    protected onFocus(): void;
    /**
     * Get selection before blur don't work in Firefox.
     * Use hotfix with onSelectionchange()
     * This is fallback
     */
    protected onFocusout(): void;
    protected onSelectionchange(): void;
    /**
     * Clipboard events
     */
    protected onPaste(event: ClipboardEvent): void;
    protected onCopy(event: ClipboardEvent): void;
    protected onCut(event: ClipboardEvent): void;
    /**
     * Internal
     */
    protected arrayOfNodeList<T extends Node>(list: NodeListOf<T>): T[];
    protected isBlockNode(node: Node): boolean;
    protected isEmojiNode(node: Node): boolean;
    protected emojiFromNode(node: Node): string;
    protected replaceSymbolsToEmojis(text: string): string;
    /**
     * String replace all implementation
     *
     * See: https://stackoverflow.com/a/1144788/1617101
     */
    protected replaceAll(str: string, find: string, replace: string): string;
    protected execCommand(command: string, value?: any): boolean;
    protected insertNewLine(): void;
    protected createEmojiImg(emoji: string): string;
    protected emojiToSymbol(emoji: string): string;
    protected emojiFromSymbol(symbol: string): string;
    protected insertEmoji(emoji: string): void;
    protected filterHtml(html: string, allowTags?: string[]): string;
    protected formatText(type: NgxEmojiEntityType): void;
    /**
     * See: https://stackoverflow.com/a/41164587/1617101
     */
    protected getEmojiRegex(): RegExp;
}

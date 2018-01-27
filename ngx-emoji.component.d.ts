import { OnDestroy, ElementRef, EventEmitter } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { Subscription } from "rxjs/Subscription";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";
import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiFormatter } from "./ngx-emoji.formatter";
import { NgxEmojiHandler } from "./ngx-emoji.handler";
export interface EnterOn {
    shift?: boolean;
    ctrl?: boolean;
}
export declare enum NgxEmojiEntityType {
    Bold = 0,
    Italic = 1,
    Underline = 2,
    Strike = 3,
    Code = 4,
    Pre = 5,
    Command = 6,
    Url = 7,
    TextLink = 8,
}
export interface NgxEmojiEntity {
    type: NgxEmojiEntityType | string;
    offset: number;
    length: number;
    url?: string;
}
export declare class NgxEmojiComponentPrevent {
    htmlCounter: number;
    htmlValue: string;
    fullHtmlCounter: number;
    fullHtmlValue: string;
    textCounter: number;
    textValue: string;
    entitiesCounter: number;
    entitiesValue: NgxEmojiEntity[];
    entitiesStringValue: string;
}
export declare class NgxEmojiComponent implements OnDestroy {
    private _contenteditable;
    private _enterOn;
    protected readonly element: NgxEmojiElement;
    protected readonly formatter: NgxEmojiFormatter;
    protected readonly handler: NgxEmojiHandler;
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription;
    protected lastSelectionRange: Range;
    protected preventCounter: number;
    protected preventSet: NgxEmojiComponentPrevent;
    protected preventGet: NgxEmojiComponentPrevent;
    placeholder: string;
    constructor(elRef: ElementRef, globalEmojiService: NgxEmojiService);
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
    readonly contenteditableChange: EventEmitter<boolean>;
    /**
     * Enter on
     */
    enterOn: EnterOn;
    readonly enterOnChange: EventEmitter<EnterOn>;
    enterKeyIsEnter(): boolean;
    enterKeyIsCtrlEnter(): boolean;
    enterKeyIsShiftEnter(): boolean;
    /**
     * HTML
     */
    fullHtml: string;
    readonly fullHtmlChange: EventEmitter<string>;
    /**
     * HTML wihout parahraphs
     */
    html: string;
    readonly htmlChange: EventEmitter<string>;
    /**
     * Text
     */
    text: string;
    readonly textChange: EventEmitter<string>;
    /**
     * Entities
     */
    entities: NgxEmojiEntity[];
    readonly entitiesChange: EventEmitter<NgxEmojiEntity[]>;
    /**
     * Enter events
     */
    readonly onEnter: EventEmitter<void>;
    protected onKeydownEnter(event: KeyboardEvent): void;
    protected onKeydownControlEnter(event: KeyboardEvent): void;
    protected onKeydownShiftEnter(event: KeyboardEvent): void;
    protected emitEnter(): void;
    /**
     * Event command
     */
    readonly onCommand: EventEmitter<string>;
    /**
     * Event link
     */
    readonly onLink: EventEmitter<string>;
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
    protected onSelectionChange(): void;
    /**
     * Clipboard events
     */
    protected onPaste(event: ClipboardEvent): void;
    protected onCopy(event: ClipboardEvent): void;
    protected onCut(event: ClipboardEvent): void;
    /**
     * Click events
     */
    protected onClick(event: MouseEvent): void;
    /**
     * Internal
     */
    protected onElementModified(): void;
    protected insertEmoji(emoji: string): void;
}

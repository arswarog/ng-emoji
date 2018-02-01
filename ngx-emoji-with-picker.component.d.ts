import { EventEmitter, ElementRef } from "@angular/core";
import { EnterOn, NgxEmojiComponent, NgxEmojiEntity } from "./ngx-emoji.component";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";
export declare class NgxEmojiWithPickerComponent {
    protected elRef: ElementRef;
    protected emojiComponent: NgxEmojiComponent;
    showPicker: boolean;
    constructor(elRef: ElementRef);
    togglePicker(): void;
    protected pickerComponent: NgxEmojiPickerComponent;
    placeholder: string;
    protected attrContenteditable: boolean;
    contenteditable: boolean;
    readonly contenteditableChange: EventEmitter<boolean>;
    enterOn: EnterOn;
    readonly enterOnChange: EventEmitter<EnterOn>;
    fullHtml: string;
    readonly fullHtmlChange: EventEmitter<string>;
    html: string;
    readonly htmlChange: EventEmitter<string>;
    text: string;
    readonly textChange: EventEmitter<string>;
    entities: NgxEmojiEntity[];
    readonly entitiesChange: EventEmitter<NgxEmojiEntity[]>;
    readonly onEnter: EventEmitter<void>;
    readonly onCommand: EventEmitter<string>;
    readonly onLink: EventEmitter<string>;
}

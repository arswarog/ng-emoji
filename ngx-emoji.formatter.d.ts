import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiEntityType } from "./ngx-emoji.component";
export declare class NgxEmojiFormatter {
    protected readonly element: NgxEmojiElement;
    constructor(element: NgxEmojiElement);
    formatText(type: NgxEmojiEntityType, value?: string): void;
    insertNewLine(): void;
    insertEmoji(emoji: string): void;
}

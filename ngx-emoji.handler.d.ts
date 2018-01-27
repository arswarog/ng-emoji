import { NgxEmojiEntity, NgxEmojiEntityType } from "./ngx-emoji.component";
import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiFormatter } from "./ngx-emoji.formatter";
export declare class NgxEmojiHandler {
    protected readonly element: NgxEmojiElement;
    protected readonly formatter: NgxEmojiFormatter;
    readonly allowedTags: string[];
    constructor(element: NgxEmojiElement, formatter: NgxEmojiFormatter);
    format(text: string, entities: NgxEmojiEntity[]): void;
    getEntities(): NgxEmojiEntity[];
    getText(): string;
    getFullHtml(): string;
    getMarkupHtml(rootElement?: HTMLElement, withCommands?: boolean): string;
    setFullHtml(html: string): void;
    setMarkupHtml(html: string): void;
    protected normalizeEntityType(type: any): NgxEmojiEntityType;
    findCommands(): void;
    findLinks(): void;
}

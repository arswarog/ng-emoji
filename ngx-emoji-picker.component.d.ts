import { ElementRef } from '@angular/core';
import { NgxEmoji, NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export interface NgxEmojiPickerCategories {
    [key: string]: NgxEmoji[];
}
export declare class NgxEmojiPickerComponent {
    protected emojiService: NgxEmojiService;
    protected categories: NgxEmojiPickerCategories;
    protected currentCategory: string;
    readonly nativeElement: HTMLElement;
    constructor(elRef: ElementRef, emojiService: NgxEmojiService);
    setEmojiService(service: NgxEmojiService): void;
    protected inputFor: NgxEmojiComponent;
    protected emojiPicked(emoji: string): void;
    selectCategory(category: string): void;
    protected loadCategory(category: string): void;
    protected getEmojis(): NgxEmoji[];
    protected getCategories(): {
        name: string;
        class: string;
    }[];
}

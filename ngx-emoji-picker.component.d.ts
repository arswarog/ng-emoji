import { OnInit } from '@angular/core';
import { NgxEmoji, NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export interface NgxEmojiPickerCategories {
    [key: string]: NgxEmoji[];
}
export declare class NgxEmojiPickerComponent implements OnInit {
    protected emojiService: NgxEmojiService;
    private Object;
    protected categories: NgxEmojiPickerCategories;
    protected currentCategory: string;
    constructor(emojiService: NgxEmojiService);
    ngOnInit(): void;
    setEmojiService(service: NgxEmojiService): void;
    protected inputFor: NgxEmojiComponent;
    protected emojiPicked(emoji: string): void;
    selectCategory(category: string): void;
    protected loadCategory(category: string): void;
    protected getEmojis(): NgxEmoji[];
}

import { OnInit } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export interface NgxEmojiPickerEmoji {
    unified: string;
}
export declare class NgxEmojiPickerComponent implements OnInit {
    protected emojiService: NgxEmojiService;
    protected emojis: NgxEmojiPickerEmoji[];
    constructor(emojiService: NgxEmojiService);
    ngOnInit(): void;
    setEmojiService(service: NgxEmojiService): void;
    protected inputFor: NgxEmojiComponent;
    protected emojiPicked(emoji: string): void;
}

import { Component, OnInit, Input } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";

export interface NgxEmojiPickerEmoji {
    unified: string;
}

@Component({
    selector: 'ngx-emoji-picker',
    templateUrl: './ngx-emoji-picker.component.html'
})
export class NgxEmojiPickerComponent implements OnInit {

    protected emojis: NgxEmojiPickerEmoji[] = [];

    public constructor(
        protected emojiService: NgxEmojiService
    ) {
    }

    public ngOnInit(): void {
        this.emojis = require('ngx-emoji/emojis.json');
    }

    public setEmojiService(service: NgxEmojiService): void {
        this.emojiService = service;
    }

    @Input('for')
    protected set inputFor(emojiComponent: NgxEmojiComponent) {
        this.emojiService = new NgxEmojiService();
        emojiComponent.addEmojiService(this.emojiService);
    }

    protected emojiPicked(emoji: string): void {
        this.emojiService.onEmojiPicked.next(emoji);
    }

}

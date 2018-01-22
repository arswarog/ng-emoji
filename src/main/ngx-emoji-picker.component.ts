import { Component, OnInit, Input } from '@angular/core';
import { NgxEmoji, NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";

export interface NgxEmojiPickerCategories {
    [key: string]: NgxEmoji[];
}

@Component({
    selector: 'ngx-emoji-picker',
    templateUrl: './ngx-emoji-picker.component.html'
})
export class NgxEmojiPickerComponent implements OnInit {
    private Object: Object = Object;
    protected categories: NgxEmojiPickerCategories = {Recent: []};
    protected currentCategory: string = 'Recent';

    public constructor(
        protected emojiService: NgxEmojiService
    ) {
    }

    public ngOnInit(): void {
        for (let emoji of NgxEmojiService.getEmojis()) {
            if (this.categories[emoji.category] == undefined) {
                this.categories[emoji.category] = null;
            }
        }
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

    public selectCategory(category: string): void {
        this.currentCategory = category;
    }

    protected loadCategory(category: string): void {
        let emojis = NgxEmojiService.getEmojis().filter(function (emoji) {
            return emoji.category == category;
        });
        for (let emoji of emojis) {
            this.emojiService.loadEmoji(emoji.unified);
        }
        this.categories[category] = emojis;
    }

    protected getEmojis(): NgxEmoji[] {
        let category = this.currentCategory;
        if (category == 'Recent') {
            let recent: NgxEmoji[] = [];
            for (let emoji of this.emojiService.getRecent()) {
                for (let e of NgxEmojiService.getEmojis()) {
                    if (e.unified == emoji) {
                        recent.push(e);
                        this.emojiService.loadEmoji(e.unified);
                        break;
                    }
                }
            }
            return recent;
        } else {
            if (this.categories[category] == null) {
                this.loadCategory(category);
            }
            return this.categories[category];
        }
    }

}

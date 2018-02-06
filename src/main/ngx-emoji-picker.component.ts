import { Component, ElementRef, Input } from '@angular/core';
import { NgxEmoji, NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";

export interface NgxEmojiPickerCategories {
    [key: string]: NgxEmoji[];
}

@Component({
    selector: 'ngx-emoji-picker',
    templateUrl: './ngx-emoji-picker.component.html'
})
export class NgxEmojiPickerComponent {
    protected categories: NgxEmojiPickerCategories = {
        Recent: [],
        "Smileys & People": null,
        "Animals & Nature": null,
        "Food & Drink": null,
        Objects: null,
        "Travel & Places": null,
        Activities: null,
        Symbols: null,
        Flags: null
    };
    protected currentCategory: string = 'Recent';
    public readonly nativeElement: HTMLElement;

    public constructor(
        elRef: ElementRef,
        protected emojiService: NgxEmojiService
    ) {
        this.nativeElement = elRef.nativeElement;
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
            NgxEmojiService.loadEmoji(emoji.unified);
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
                        NgxEmojiService.loadEmoji(e.unified);
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

    protected getCategories(): { name: string, class: string }[] {
        return Object.keys(this.categories).map(function (value) {
            return {
                name: value,
                class: 'ngx-emoji-cat-' + value
                    .replace('&', '')
                    .replace('  ', ' ')
                    .replace(' ', '-')
                    .toLowerCase()
            };
        });
    }

}

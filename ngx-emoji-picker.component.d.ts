import { NgxEmojiService } from "./ngx-emoji.service";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export declare class NgxEmojiPickerComponent {
    protected emojiService: NgxEmojiService;
    constructor(emojiService: NgxEmojiService);
    setEmojiService(service: NgxEmojiService): void;
    protected inputFor: NgxEmojiComponent;
    protected emojiPicked(emoji: string): void;
}

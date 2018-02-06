import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiEntityType } from "./ngx-emoji.component";
import { NgxEmojiHelper } from "./ngx-emoji.helper";

export class NgxEmojiFormatter {

    public constructor(
        protected readonly element: NgxEmojiElement
    ) {
    }

    public formatText(type: NgxEmojiEntityType, value?: string): void {
        switch (type) {
            case NgxEmojiEntityType.Bold:
                this.element.execCommand('bold');
                break;
            case NgxEmojiEntityType.Italic:
                this.element.execCommand('italic');
                break;
            case NgxEmojiEntityType.Underline:
                this.element.execCommand('underline');
                break;
            case NgxEmojiEntityType.Pre:
                this.element.execCommand('pre');
                break;
            case NgxEmojiEntityType.Code:
                this.element.execCommand('code');
                break;
            case NgxEmojiEntityType.Strike:
                this.element.execCommand('strikeThrough');
                break;
            case NgxEmojiEntityType.Command:
                this.element.execCommand('command');
                break;
            case NgxEmojiEntityType.TextLink:
            case NgxEmojiEntityType.Url:
                this.element.execCommand('createLink', value);
                break;
        }
    }

    public insertNewLine(): void {
        this.element.execCommand('insertParagraph');
    }

    public insertEmoji(emoji: string): void {
        this.element.execCommand(
            'insertHTML',
            NgxEmojiHelper.createEmojiImg(emoji)
        );
    }

}

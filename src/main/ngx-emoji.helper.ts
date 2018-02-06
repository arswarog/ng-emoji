import { NgxEmojiUtils } from "./utils";
import { NgxEmojiService } from "./ngx-emoji.service";

export class NgxEmojiHelper {

    public static createEmojiImg(emoji: string): string {
        NgxEmojiService.loadEmoji(emoji);
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    }

    public static emojiToSymbol(emoji: string): string {
        emoji = emoji.trim();
        if (emoji.length == 0) {
            return '�';
        }
        let emojiCodes = emoji.split('-').map(function (value) {
            return parseInt('0x' + value, 16);
        });
        try {
            emoji = String.fromCodePoint.apply(String, emojiCodes);
        } catch (error) {
            console.warn('Convert emoji ' + emoji + ' error: ' + error.message);
            emoji = '�';
        }
        return emoji;
    }

    /**
     * For debug...
     */
    public static dumpEmoji(emoji: string): void {
        let s: string[] = [];
        let s2: string[] = [];
        for (let i = 0; i < emoji.length; i++) {
            s.push(emoji.codePointAt(i).toString(16).toUpperCase());
            s2.push(emoji.charCodeAt(i).toString(16).toUpperCase());
        }
        console.log(emoji, s, s2);
    }

    public static emojiFromSymbol(symbol: string): string {
        let codes: string[] = [];
        for (let i = 0; i < symbol.length; i++) {
            codes.push(symbol.codePointAt(i).toString(16));
        }
        codes = codes
            .filter(function (code: string) {
                let p = parseInt(code, 16);
                return !(p >= 0xD800 && p <= 0xDFFF);
            })
            .map(function (code: string) {
                let pad = '0000';
                return pad.substring(0, pad.length - code.length) + code;
            });
        return codes.join('-').toUpperCase();
    }

    public static replaceSymbolsToEmojis(text: string): string {
        text = text.replace(this.getEmojiRegex(), function (match) {
            return NgxEmojiHelper.createEmojiImg(NgxEmojiHelper.emojiFromSymbol(match));
        });
        text = NgxEmojiUtils.replaceAll(text, '\uFE0F', ''); // remove variation selector
        return text;
    }

    public static isEmojiNode(node: Node): boolean {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    }

    public static emojiFromNode(node: Node): string {
        if (!this.isEmojiNode(node)) {
            return null;
        }
        let classList = (node as HTMLElement).classList;
        let emoji = null;
        for (let i = 0; i < classList.length; i++) {
            if (classList.item(i).substr(0, 10) == 'ngx-emoji-') {
                emoji = classList.item(i).substr(10);
                break;
            }
        }
        return emoji;
    }

    /**
     * See: https://habrahabr.ru/company/badoo/blog/282113/
     */
    protected static getEmojiRegex(): RegExp {
        let emojiRanges = [
            '(?:\uD83C[\uDDE6-\uDDFF]){2}', // флаги
            '[\u0023-\u0039]\u20E3', // числа
            '(?:[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]|[\u270A-\u270D\u261D\u26F9])\uD83C[\uDFFB-\uDFFF]', // цвет кожи

            // семья и профессии
            '[\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC67]([\u200D][\uD83D][\uDC66-\uDC67])?',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC8B][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC00-\uDFFF]',
            '[\uD83C-\uD83E][\uDC00-\uDFFF][\uFE0F]?[\u200D][\u2640-\u2696][\uFE0F]?',
            '[\uD83D][\uDD75][\uFE0F][\u200D][\u2640][\uFE0F]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2708]',
            '[\uD83C-\uD83E][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC66][\u200D][\uD83C-\uD83E][\uDC66]',
            '[\u26F9][\uFE0F][\u200D][\u2640-\u2696][\uFE0F]',

            '[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]', // суррогатная пара
            '[\u3297\u3299\u303D\u2B50\u2B55\u2B1B\u27BF\u27A1\u24C2\u25B6\u25C0\u2600\u2705\u21AA\u21A9]', // обычные
            '[\u203C\u2049\u2122\u2328\u2601\u260E\u261d\u2620\u2626\u262A\u2638\u2639\u263a\u267B\u267F\u2702\u2708]',
            '[\u2194-\u2199]',
            '[\u2B05-\u2B07]',
            '[\u2934-\u2935]',
            '[\u2795-\u2797]',
            '[\u2709-\u2764]',
            '[\u2622-\u2623]',
            '[\u262E-\u262F]',
            '[\u231A-\u231B]',
            '[\u23E9-\u23EF]',
            '[\u23F0-\u23F4]',
            '[\u23F8-\u23FA]',
            '[\u25AA-\u25AB]',
            '[\u25FB-\u25FE]',
            '[\u2602-\u2618]',
            '[\u2648-\u2653]',
            '[\u2660-\u2668]',
            '[\u26A0-\u26FA]',
            '[\u2692-\u269C]'
        ];
        return new RegExp(emojiRanges.join('|'), 'g');
    }

}

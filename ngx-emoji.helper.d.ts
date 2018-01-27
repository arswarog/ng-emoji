export declare class NgxEmojiHelper {
    static createEmojiImg(emoji: string): string;
    static emojiToSymbol(emoji: string): string;
    /**
     * For debug...
     */
    static dumpEmoji(emoji: string): void;
    static emojiFromSymbol(symbol: string): string;
    static replaceSymbolsToEmojis(text: string): string;
    static isEmojiNode(node: Node): boolean;
    static emojiFromNode(node: Node): string;
    /**
     * See: https://habrahabr.ru/company/badoo/blog/282113/
     */
    protected static getEmojiRegex(): RegExp;
}

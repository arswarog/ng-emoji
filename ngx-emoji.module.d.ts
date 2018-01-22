import 'ngx-emoji/ngx-emoji.min.css';
export declare class NgxEmojiModule {
    protected static emojiBundlesPath: string;
    protected static recentMax: number;
    static setEmojiBundlesPath(path: string): void;
    static getEmojiBundlesPath(): string;
    static setRecentMax(max: number): void;
    static getRecentMax(): number;
}

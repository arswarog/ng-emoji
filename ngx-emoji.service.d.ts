import { Subject } from "rxjs/Subject";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export interface NgxEmoji {
    unified: string;
    category: string;
    bundle: number;
}
export declare class NgxEmojiService {
    protected static emojis: NgxEmoji[];
    readonly onEmojiPicked: Subject<string>;
    protected activeComponent: NgxEmojiComponent;
    static getEmojis(): NgxEmoji[];
    setActiveComponent(component: NgxEmojiComponent): void;
    isActiveComponent(component: NgxEmojiComponent): boolean;
    static loadEmoji(emoji: string): void;
    protected static getEmojiBundle(emoji: string): number;
    static loadCssBundle(bundleId: number): void;
    static isCssBundleLoaded(bundleId: number): boolean;
    recentPush(emoji: string): void;
    getRecent(): string[];
}

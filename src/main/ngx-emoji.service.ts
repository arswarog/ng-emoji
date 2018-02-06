import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { NgxEmojiComponent } from "./ngx-emoji.component";
import { NgxEmojiModule } from "./ngx-emoji.module";

export interface NgxEmoji {
    unified: string;
    category: string;
    bundle: number;
}

@Injectable()
export class NgxEmojiService {
    protected static emojis: NgxEmoji[] = null;
    public readonly onEmojiPicked: Subject<string> = new Subject<string>();
    protected activeComponent: NgxEmojiComponent;

    public static getEmojis(): NgxEmoji[] {
        if (this.emojis === null) {
            this.emojis = require('ngx-emoji/emojis.json');
        }
        return this.emojis;
    }

    public setActiveComponent(component: NgxEmojiComponent): void {
        this.activeComponent = component;
    }

    public isActiveComponent(component: NgxEmojiComponent): boolean {
        return component === this.activeComponent;
    }

    public static loadEmoji(emoji: string): void {
        let bundleId = this.getEmojiBundle(emoji);
        if (bundleId !== null && !this.isCssBundleLoaded(bundleId)) {
            this.loadCssBundle(bundleId);
        }
    }

    protected static getEmojiBundle(emoji: string): number {
        for (let e of NgxEmojiService.getEmojis()) {
            if (e.unified == emoji) {
                return e.bundle;
            }
        }
        return null;
    }

    public static loadCssBundle(bundleId: number): void {
        if (!this.isCssBundleLoaded(bundleId)) {
            let id = 'ngx-emoji-bundle-' + bundleId;
            let head = document.getElementsByTagName('head')[0];
            let link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = NgxEmojiModule.getEmojiBundlesPath() + 'ngx-emoji-b' + bundleId + '.min.css';
            link.media = 'all';
            head.appendChild(link);
        }
    }

    public static isCssBundleLoaded(bundleId: number): boolean {
        return (document.getElementById('ngx-emoji-bundle-' + bundleId)) ? true : false;
    }

    public recentPush(emoji: string): void {
        let recent = this.getRecent();
        if (recent.indexOf(emoji) > -1) {
            return;
        }
        recent = [emoji].concat(recent)
            .slice(0, NgxEmojiModule.getRecentMax());
        window.localStorage.setItem('ngx-emoji-recent', recent.join(':'));
    }

    public getRecent(): string[] {
        let recent = window.localStorage.getItem('ngx-emoji-recent');
        if (!recent) {
            return [];
        }
        return recent.split(':');
    }

}

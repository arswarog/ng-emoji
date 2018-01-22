import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEmojiPickerComponent } from './ngx-emoji-picker.component';
import { NgxEmojiComponent } from './ngx-emoji.component';
import { NgxEmojiService } from './ngx-emoji.service';
import 'ngx-emoji/ngx-emoji.min.css';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        NgxEmojiPickerComponent, NgxEmojiComponent
    ],
    providers: [
        NgxEmojiService
    ],
    exports: [
        NgxEmojiPickerComponent, NgxEmojiComponent
    ]
})
export class NgxEmojiModule {
    protected static emojiBundlesPath: string = 'https://cdn.rawgit.com/arswarog/ngx-emoji/build/ngx-emoji-assets/';
    protected static recentMax: number = 20;

    public static setEmojiBundlesPath(path: string): void {
        NgxEmojiModule.emojiBundlesPath = path;
    }

    public static getEmojiBundlesPath(): string {
        return NgxEmojiModule.emojiBundlesPath;
    }

    public static setRecentMax(max: number): void {
        NgxEmojiModule.recentMax = max;
    }

    public static getRecentMax(): number {
        return NgxEmojiModule.recentMax;
    }

}

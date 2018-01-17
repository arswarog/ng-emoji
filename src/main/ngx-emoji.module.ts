import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxEmojiPickerComponent } from './ngx-emoji-picker.component';
import { NgxEmojiComponent } from './ngx-emoji.component';
import { NgxEmojiService } from './ngx-emoji.service';
import 'ngx-emoji/ngx-emoji.min.css';
import 'ngx-emoji/emojis.min.css';

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
}

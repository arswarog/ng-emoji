import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { NgxEmojiPickerComponent } from './ngx-emoji-picker.component';
import { NgxEmojiComponent } from './ngx-emoji.component';
import { NgxEmojiService } from './ngx-emoji.service';

import 'main/ngx-emoji.less';

@NgModule({
    imports: [
        //CommonModule
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

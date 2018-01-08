import { NgModule } from '@angular/core';
//import { CommonModule } from '@angular/common';
import { EmojiPickerComponent } from './emoji-picker.component'
import { NgxEmojiDirective } from './ngx-emoji.directive'

@NgModule({
    imports: [
        //CommonModule
    ],
    declarations: [
        EmojiPickerComponent, NgxEmojiDirective
    ],
    exports: [
        EmojiPickerComponent, NgxEmojiDirective
    ]
})
export class NgxEmojiModule {
}

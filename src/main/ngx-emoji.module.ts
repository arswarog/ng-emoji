import { NgModule } from '@angular/core';
import { PrettyInputComponent } from './pretty-input.component';
import { PrettyTextComponent } from './pretty-text.component'

@NgModule({
    exports: [
        PrettyInputComponent, PrettyTextComponent
    ]
})
export class NgxEmojiModule {

}

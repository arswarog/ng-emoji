import { Component } from '@angular/core';
import { NgxEmojiComponent } from "../main";
import { isArray } from "util";

@Component({
    selector: 'body',
    templateUrl: './app.html'
})
export class AppComponent {

    // Global
    protected window = window;

    // View / edit
    protected editText: string;

    // View and edit
    protected editable: boolean = false;

    // Chat
    protected messages: string[] = [];

    /**
     * String replace all implementation
     *
     * See: https://stackoverflow.com/a/1144788/1617101
     */
    protected replaceAll(str: string, find: string, replace: string): string {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }

    protected printBreakLines(text: string): string {
        return this.replaceAll(text, '\n', '↵\n');
    }

    protected printFormattingMarks(text: string): string {
        text = this.printBreakLines(text);
        text = this.replaceAll(text, ' ', '°');
        return text;
    }

    protected setEntities(component: NgxEmojiComponent, entities: string): void {
        let en = [];
        if (entities.trim().length > 0) {
            try {
                let e = eval('(' + entities + ')');
                if (isArray(e)) {
                    en = e;
                }
            } catch (ex) {
            }
        }
        component.entities = en;
    }

}

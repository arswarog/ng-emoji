import { Component } from '@angular/core';
import { NgxEmojiComponent, NgxEmojiEntity } from "../main";
import { isArray } from "util";

class ChatMessage {
    text: string = '';
    entities: NgxEmojiEntity[] = [];

    constructor(text: string = '', entities: NgxEmojiEntity[] = []) {
        this.text = text;
        this.entities = entities;
    }
}

@Component({
    selector: 'body',
    templateUrl: './app.html'
})
export class AppComponent {

    // ChatDemo
    public sendByShift = false;
    public chatMessages: ChatMessage[] = [
        new ChatMessage('Now messages is perfect!', [ {
            type   : 'bold',
            offset : 16,
            length : 7,
        } ]),
    ];
    public newMessage: ChatMessage = new ChatMessage('Your message');

    // Global
    protected window = window;

    // View / edit
    protected editText: string;

    // View and edit
    protected editable: boolean = false;

    // Chat
    protected messages: {
        text: string,
        emtities: NgxEmojiEntity
    }[] = [];

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

    // ChatDemo functions
    public sendMessage() {
        this.chatMessages.unshift(this.newMessage);
        this.newMessage = this.newMessage;
        if (this.chatMessages.length > 5)
            this.chatMessages.length = 5;
    }
}

import { Component } from '@angular/core';
import { NgxEmojiComponent, NgxEmojiEntity } from "../main";
import { isArray } from "util";
import { NgxEmojiUtils } from "../main/utils";

class ChatMessage {
    text: string               = '';
    entities: NgxEmojiEntity[] = [];

    constructor(text: string = '', entities: NgxEmojiEntity[] = []) {
        this.text     = text;
        this.entities = entities;
    }
}

@Component({
    selector   : 'body',
    templateUrl: './app.html'
})
export class AppComponent {

    // ChatDemo
    public sendByShift                 = false;
    public chatMessages: ChatMessage[] = [
        new ChatMessage('Now messages is perfect!', [{
            type  : 'bold',
            offset: 16,
            length: 7
        }])
    ];

    public alert = alert;

    public newMessage: ChatMessage     = new ChatMessage();

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

    protected printBreakLines(text: string): string {
        return NgxEmojiUtils.replaceAll(text, '\n', '↵\n');
    }

    protected printFormattingMarks(text: string): string {
        text = this.printBreakLines(text);
        text = NgxEmojiUtils.replaceAll(text, ' ', '°');
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
        this.chatMessages.push(this.newMessage);
        this.newMessage = new ChatMessage();
        if (this.chatMessages.length > 5)
            this.chatMessages = this.chatMessages.slice(0, 5);
    }

    // Long post demo functions
    public longPostText: string = '';

    public longPost(text: string) {
        alert(text);
        this.longPostText = ''
    }
}

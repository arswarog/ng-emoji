import { Injectable } from '@angular/core';
import { Subject } from "rxjs/Subject";
import { NgxEmojiComponent } from "./ngx-emoji.component";

@Injectable()
export class NgxEmojiService {
    public readonly onEmojiPicked: Subject<string> = new Subject<string>();
    protected activeComponent: NgxEmojiComponent;

    public setActiveComponent(component: NgxEmojiComponent): void {
        this.activeComponent = component;
    }

    public isActiveComponent(component: NgxEmojiComponent): boolean {
        return component === this.activeComponent;
    }

}

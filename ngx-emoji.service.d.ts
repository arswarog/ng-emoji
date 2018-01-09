import { Subject } from "rxjs/Subject";
import { NgxEmojiComponent } from "./ngx-emoji.component";
export declare class NgxEmojiService {
    readonly onEmojiPicked: Subject<string>;
    protected activeComponent: NgxEmojiComponent;
    setActiveComponent(component: NgxEmojiComponent): void;
    isActiveComponent(component: NgxEmojiComponent): boolean;
}

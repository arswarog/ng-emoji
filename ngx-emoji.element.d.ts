import { EventEmitter } from "@angular/core";
export declare class NgxEmojiElement {
    readonly nativeElement: HTMLElement;
    readonly onModified: EventEmitter<MutationEvent>;
    constructor(nativeElement: HTMLElement);
    contentEditable: boolean;
    execCommand(command: string, value?: any): boolean;
    protected execCommandTag(tag: string, attributes?: {
        name: string;
        value: string;
    }[]): boolean;
}

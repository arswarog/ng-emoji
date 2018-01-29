import { Component, ViewChild, Input, Output, EventEmitter, HostListener, ElementRef } from "@angular/core";
import { EnterOn, NgxEmojiComponent, NgxEmojiEntity } from "./ngx-emoji.component";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";

@Component({
    selector: 'ngx-emoji-with-picker',
    templateUrl: './ngx-emoji-with-picker.component.html'
})
export class NgxEmojiWithPickerComponent {

    @ViewChild('emoji')
    protected emojiComponent: NgxEmojiComponent;

    public showPicker: boolean = false;

    public constructor(
        protected elRef: ElementRef
    ) {
    }

    public togglePicker(): void {
        this.showPicker = !this.showPicker;
    }

    @ViewChild('picker')
    protected set pickerComponent(picker: NgxEmojiPickerComponent) {
        if (!picker) {
            return;
        }
        let component = this;
        let timeout: number;
        picker.nativeElement.addEventListener('mouseleave', function () {
            timeout = window.setTimeout(function () {
                component.showPicker = false;
            }, 1000);
        });
        picker.nativeElement.addEventListener('mouseover', function () {
            window.clearTimeout(timeout);
        });
    }

    /*@HostListener('document:click', ['$event'])
    protected onClick(event: MouseEvent): void {
        if (!this.elRef.nativeElement.contains(event.target)) {
            this.showPicker = false;
        }
    }*/

    @Input('placeholder')
    public set placeholder(value: string) {
        this.emojiComponent.placeholder = value;
    }

    @Input('attr.contenteditable')
    protected set attrContenteditable(editable: boolean) {
        this.emojiComponent.contenteditable = editable;
    }

    @Input('contenteditable')
    public set contenteditable(editable: boolean) {
        this.emojiComponent.contenteditable = editable;
    }

    public get contenteditable(): boolean {
        return this.emojiComponent.contenteditable;
    }

    @Output('contenteditableChange')
    public get contenteditableChange(): EventEmitter<boolean> {
        return this.emojiComponent.contenteditableChange;
    }

    @Input('enterOn')
    public set enterOn(enterOn: EnterOn) {
        this.emojiComponent.enterOn = enterOn;
    }

    public get enterOn(): EnterOn {
        return this.emojiComponent.enterOn;
    }

    @Output('enterOnChange')
    public get enterOnChange(): EventEmitter<EnterOn> {
        return this.emojiComponent.enterOnChange;
    }

    @Input('fullHtml')
    public set fullHtml(html: string) {
        this.emojiComponent.fullHtml = html;
    }

    public get fullHtml(): string {
        return this.emojiComponent.fullHtml;
    }

    @Output('fullHtmlChange')
    public get fullHtmlChange(): EventEmitter<string> {
        return this.emojiComponent.fullHtmlChange;
    }

    @Input('html')
    public set html(html: string) {
        this.emojiComponent.html = html;
    }

    public get html(): string {
        return this.emojiComponent.html;
    }

    @Output('htmlChange')
    public get htmlChange(): EventEmitter<string> {
        return this.emojiComponent.htmlChange;
    }

    @Input('text')
    public set text(text: string) {
        this.emojiComponent.text = text;
    }

    public get text(): string {
        return this.emojiComponent.text;
    }

    @Output('textChange')
    public get textChange(): EventEmitter<string> {
        return this.emojiComponent.textChange;
    }

    @Input('entities')
    public set entities(entities: NgxEmojiEntity[]) {
        this.emojiComponent.entities = entities;
    }

    public get entities(): NgxEmojiEntity[] {
        return this.emojiComponent.entities;
    }

    @Output('entitiesChange')
    public get entitiesChange(): EventEmitter<NgxEmojiEntity[]> {
        return this.emojiComponent.entitiesChange;
    }

    @Output('enter')
    public get onEnter(): EventEmitter<void> {
        return this.emojiComponent.onEnter;
    }

    @Output('command')
    public get onCommand(): EventEmitter<string> {
        return this.emojiComponent.onCommand;
    }

    @Output('link')
    public get onLink(): EventEmitter<string> {
        return this.emojiComponent.onLink;
    }

}

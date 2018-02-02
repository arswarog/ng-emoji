import { Component, ViewChild, Input, Output, EventEmitter, ElementRef, OnInit } from "@angular/core";
import { EnterOn, NgxEmojiComponent, NgxEmojiEntity } from "./ngx-emoji.component";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";

@Component({
    selector: 'ngx-emoji-with-picker',
    templateUrl: './ngx-emoji-with-picker.component.html'
})
export class NgxEmojiWithPickerComponent implements OnInit {

    @ViewChild('emoji')
    protected emojiComponent: NgxEmojiComponent;

    public showPicker: boolean = false;

    public constructor(
        protected elRef: ElementRef
    ) {
    }

    public ngOnInit(): void {
        this.emojiComponent.contenteditableChange.subscribe((value: boolean) => this.contenteditableChange.emit(value));
        this.emojiComponent.enterOnChange.subscribe((value: EnterOn) => this.enterOnChange.emit(value));
        this.emojiComponent.fullHtmlChange.subscribe((value: string) => this.fullHtmlChange.emit(value));
        this.emojiComponent.htmlChange.subscribe((value: string) => this.htmlChange.emit(value));
        this.emojiComponent.textChange.subscribe((value: string) => this.textChange.emit(value));
        this.emojiComponent.entitiesChange.subscribe((value: NgxEmojiEntity[]) => this.entitiesChange.emit(value));
        this.emojiComponent.onEnter.subscribe(() => this.onEnter.emit());
        this.emojiComponent.onCommand.subscribe((value: string) => this.onCommand.emit(value));
        this.emojiComponent.onLink.subscribe((value: string) => this.onLink.emit(value));
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
        picker.nativeElement.addEventListener('mouseleave', function () {
            let timeout = window.setTimeout(function () {
                component.showPicker = false;
            }, 1000);
            picker.nativeElement.addEventListener('mouseenter', function () {
                window.clearTimeout(timeout);
            }, {once: true});
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
    public readonly contenteditableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    @Input('enterOn')
    public set enterOn(enterOn: EnterOn) {
        this.emojiComponent.enterOn = enterOn;
    }

    public get enterOn(): EnterOn {
        return this.emojiComponent.enterOn;
    }

    @Output('enterOnChange')
    public readonly enterOnChange: EventEmitter<EnterOn> = new EventEmitter<EnterOn>();

    @Input('fullHtml')
    public set fullHtml(html: string) {
        this.emojiComponent.fullHtml = html;
    }

    public get fullHtml(): string {
        return this.emojiComponent.fullHtml;
    }

    @Output('fullHtmlChange')
    public readonly fullHtmlChange: EventEmitter<string> = new EventEmitter<string>();

    @Input('html')
    public set html(html: string) {
        this.emojiComponent.html = html;
    }

    public get html(): string {
        return this.emojiComponent.html;
    }

    @Output('htmlChange')
    public readonly htmlChange: EventEmitter<string> = new EventEmitter<string>();

    @Input('text')
    public set text(text: string) {
        this.emojiComponent.text = text;
    }

    public get text(): string {
        return this.emojiComponent.text;
    }

    @Output('textChange')
    public readonly textChange: EventEmitter<string> = new EventEmitter<string>();

    @Input('entities')
    public set entities(entities: NgxEmojiEntity[]) {
        this.emojiComponent.entities = entities;
    }

    public get entities(): NgxEmojiEntity[] {
        return this.emojiComponent.entities;
    }

    @Output('entitiesChange')
    public readonly entitiesChange: EventEmitter<NgxEmojiEntity[]> = new EventEmitter<NgxEmojiEntity[]>();

    @Output('enter')
    public readonly onEnter: EventEmitter<void> = new EventEmitter<void>();

    @Output('command')
    public readonly onCommand: EventEmitter<string> = new EventEmitter<string>();

    @Output('link')
    public readonly onLink: EventEmitter<string> = new EventEmitter<string>();

}

import { Component, OnDestroy, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { Subscription } from "rxjs/Subscription";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";
import { NgxEmojiUtils } from "./utils";
import { NgxEmojiHelper } from "./ngx-emoji.helper";
import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiFormatter } from "./ngx-emoji.formatter";
import { NgxEmojiHandler } from "./ngx-emoji.handler";

export interface EnterOn {
    shift?: boolean;
    ctrl?: boolean;
}

export enum NgxEmojiEntityType {
    Bold,
    Italic,
    Underline,
    Strike,
    Code,
    Pre,
    Command,
    Url,
    TextLink
}

export interface NgxEmojiEntity {
    type: NgxEmojiEntityType | string;
    offset: number;
    length: number;
    url?: string;
}

export class NgxEmojiComponentPrevent {
    public htmlCounter: number = 0;
    public htmlValue: string = '';

    public fullHtmlCounter: number = 0;
    public fullHtmlValue: string = '';

    public textCounter: number = 0;
    public textValue: string = '';

    public entitiesCounter: number = 0;
    public entitiesValue: NgxEmojiEntity[] = [];
    public entitiesStringValue: string = '';
}

@Component({
    selector: 'ngx-emoji',
    template: ''
})
export class NgxEmojiComponent implements OnDestroy {
    private _contenteditable: boolean = false;
    private _enterOn: EnterOn = {
        shift: false,
        ctrl: false
    };

    protected readonly element: NgxEmojiElement;
    protected readonly formatter: NgxEmojiFormatter;
    protected readonly handler: NgxEmojiHandler;
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription = new Subscription();
    protected lastSelectionRange: Range;

    protected preventCounter: number = 0;
    protected preventSet: NgxEmojiComponentPrevent = new NgxEmojiComponentPrevent();
    protected preventGet: NgxEmojiComponentPrevent = new NgxEmojiComponentPrevent();

    @Input('placeholder')
    public set placeholder(value: string) {
        this.element.nativeElement.setAttribute('placeholder', value);
    }

    public constructor(
        elRef: ElementRef,
        globalEmojiService: NgxEmojiService
    ) {
        let component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        let subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji: string) {
            if (globalEmojiService.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);

        this.element = new NgxEmojiElement(elRef.nativeElement);
        this.element.nativeElement.appendChild(document.createTextNode(''));
        this.formatter = new NgxEmojiFormatter(this.element);
        this.handler = new NgxEmojiHandler(this.element, this.formatter);

        let range = document.createRange();
        range.setStart(this.element.nativeElement.firstChild, 0);
        this.lastSelectionRange = range;
        this.element.onModified.subscribe(function () {
            component.preventCounter++;
            component.onElementModified();
        });

        /**
         * see: onFocusout()
         */
        if (document.onselectionchange !== undefined) {
            /*document.addEventListener('selectionchange', function () {
                component.onSelectionChange();
            });*/
        }
    }

    public ngOnDestroy(): void {
        this.emojiServiceSubscription.unsubscribe();
    }

    public addEmojiService(service: NgxEmojiService): void {
        service.setActiveComponent(this);
        let component = this;
        let subscription = service.onEmojiPicked.subscribe(function (emoji: string) {
            if (service.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
    }

    /**
     * Emoji picker
     */

    @Input('picker')
    protected set inputPicker(pickerComponent: NgxEmojiPickerComponent) {
        this.emojiServiceSubscription.unsubscribe();
        this.emojiServiceSubscription = new Subscription();
        let service = new NgxEmojiService();
        service.setActiveComponent(this);
        this.emojiService = service;
        pickerComponent.setEmojiService(service);
        let component = this;
        let subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji: string) {
            if (service.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
    }

    /**
     * Content editable
     */

    @Input('attr.contenteditable')
    protected set attrContenteditable(editable: boolean) {
        this.contenteditable = editable;
    }

    @Input('contenteditable')
    public set contenteditable(editable: boolean) {
        this._contenteditable = editable;
        this.element.contentEditable = editable;
        this.contenteditableChange.emit(editable);
    }

    public get contenteditable(): boolean {
        return this._contenteditable;
    }

    @Output('contenteditableChange')
    public readonly contenteditableChange: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Enter on
     */

    @Input('enterOn')
    public set enterOn(enterOn: EnterOn) {
        this._enterOn = enterOn;
        this.enterOnChange.emit(enterOn);
    }

    public get enterOn(): EnterOn {
        return this._enterOn;
    }

    @Output('enterOnChange')
    public readonly enterOnChange: EventEmitter<EnterOn> = new EventEmitter<EnterOn>();

    public enterKeyIsEnter(): boolean {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    }

    public enterKeyIsCtrlEnter(): boolean {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.ctrl) ? true : false;
    }

    public enterKeyIsShiftEnter(): boolean {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.shift) ? true : false;
    }

    /**
     * HTML
     */

    @Input('fullHtml')
    public set fullHtml(html: string) {
        if ((this.preventSet.htmlValue != html || this.preventSet.htmlCounter != this.preventCounter)
            && html != this.html) {
            this.handler.setFullHtml(html);
            this.preventSet.fullHtmlValue = html;
            this.preventSet.fullHtmlCounter = this.preventCounter;
        }
    }

    public get fullHtml(): string {
        if (this.preventGet.fullHtmlCounter != this.preventCounter) {
            this.preventGet.fullHtmlValue = this.handler.getFullHtml();
            this.preventGet.fullHtmlCounter = this.preventCounter;
        }
        return this.preventGet.fullHtmlValue;
    }

    @Output('fullHtmlChange')
    public readonly fullHtmlChange: EventEmitter<string> = new EventEmitter<string>();

    /**
     * HTML wihout parahraphs
     */

    @Input('html')
    public set html(html: string) {
        if ((this.preventSet.htmlCounter != this.preventCounter || this.preventSet.htmlValue != html)
            && html != this.html) {
            this.handler.setMarkupHtml(html);
            this.preventSet.htmlValue = html;
            this.preventSet.htmlCounter = this.preventCounter;
        }
    }

    public get html(): string {
        if (this.preventGet.htmlCounter != this.preventCounter) {
            this.preventGet.htmlValue = this.handler.getMarkupHtml();
            this.preventGet.htmlCounter = this.preventCounter;
        }
        return this.preventGet.htmlValue;
    }

    @Output('htmlChange')
    public readonly htmlChange: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Text
     */

    @Input('text')
    public set text(text: string) {
        if ((this.preventSet.textCounter != this.preventCounter || this.preventSet.textValue != text)
            && text != this.text) {
            this.handler.format(text, this.entities);
            let range = document.createRange();
            let lastChild = this.element.nativeElement.lastChild;
            while (lastChild.hasChildNodes()) {
                lastChild = lastChild.lastChild;
            }
            range.setStart(lastChild, lastChild.textContent.length);
            this.lastSelectionRange = range;
            this.preventSet.textValue = text;
            this.preventSet.textCounter = this.preventCounter;
        }
    }

    public get text(): string {
        if (this.preventGet.textCounter != this.preventCounter) {
            this.preventGet.textValue = this.handler.getText();
            this.preventGet.textCounter = this.preventCounter;
        }
        return this.preventGet.textValue;
    }

    @Output('textChange')
    public readonly textChange: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Entities
     */

    @Input('entities')
    public set entities(entities: NgxEmojiEntity[]) {
        let entitiesJson = JSON.stringify(entities);
        if ((this.preventSet.entitiesCounter != this.preventCounter || this.preventSet.entitiesStringValue != entitiesJson)
            && entitiesJson != JSON.stringify(this.entities)) {
            this.handler.format(this.text, entities);
            this.preventSet.entitiesStringValue = JSON.stringify(entities);
            this.preventSet.entitiesCounter = this.preventCounter;
        }
    }

    public get entities(): NgxEmojiEntity[] {
        if (this.preventGet.entitiesCounter != this.preventCounter) {
            this.preventGet.entitiesValue = this.handler.getEntities();
            this.preventGet.entitiesCounter = this.preventCounter;
        }
        return this.preventGet.entitiesValue;
    }

    @Output('entitiesChange')
    public readonly entitiesChange: EventEmitter<NgxEmojiEntity[]> = new EventEmitter<NgxEmojiEntity[]>();

    /**
     * Enter events
     */

    @Output('enter')
    public readonly onEnter: EventEmitter<void> = new EventEmitter<void>();

    @HostListener("keydown.enter", ['$event'])
    protected onKeydownEnter(event: KeyboardEvent): void {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsEnter()) {
            this.emitEnter();
        } else {
            this.formatter.insertNewLine();
        }
    }

    @HostListener("keydown.control.enter", ['$event'])
    protected onKeydownControlEnter(event: KeyboardEvent): void {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsCtrlEnter()) {
            this.emitEnter();
        } else {
            this.formatter.insertNewLine();
        }
    }

    @HostListener("keydown.shift.enter", ['$event'])
    protected onKeydownShiftEnter(event: KeyboardEvent): void {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsShiftEnter()) {
            this.emitEnter();
        } else {
            this.formatter.insertNewLine();
        }
    }

    protected emitEnter(): void {
        this.textChange.emit(this.text);
        this.entitiesChange.emit(this.entities);
        this.fullHtmlChange.emit(this.fullHtml);
        this.htmlChange.emit(this.html);
        this.onEnter.emit();
    }

    /**
     * Event command
     */

    @Output('command')
    public readonly onCommand: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Event link
     */

    @Output('link')
    public readonly onLink: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Keyboard events
     */

    @HostListener("keydown", ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.keyCode == 66) {
            event.preventDefault();
            this.formatter.formatText(NgxEmojiEntityType.Bold);
        }
        if (event.ctrlKey && event.keyCode == 73) {
            event.preventDefault();
            this.formatter.formatText(NgxEmojiEntityType.Italic);
        }
        if (event.ctrlKey && event.keyCode == 85) {
            event.preventDefault();
            this.formatter.formatText(NgxEmojiEntityType.Underline);
        }
    }

    /**
     * Focus events
     */

    @HostListener("focus")
    protected onFocus(): void {
        this.emojiService.setActiveComponent(this);
    }

    /**
     * Get selection before blur don't work in Firefox.
     * Use hotfix with onSelectionchange()
     * This is fallback
     */
    @HostListener("focusout")
    protected onFocusout(): void {
        //if (document.onselectionchange === undefined) {
        //}
        console.log(window.getSelection());
        let range = window.getSelection().getRangeAt(0);
        if (this.element.nativeElement.contains(range.startContainer)
            && this.element.nativeElement.contains(range.endContainer)) {
            this.lastSelectionRange = range;
        }
    }

    protected onSelectionChange(): void {
        let selection = window.getSelection();
        if (selection.containsNode(this.element.nativeElement, true)) {
            this.lastSelectionRange = selection.getRangeAt(0);
        }
    }

    /**
     * Clipboard events
     */

    @HostListener("paste", ['$event'])
    protected onPaste(event: ClipboardEvent): void {
        event.preventDefault();
        let html = '';
        if (event.clipboardData.types.indexOf('text/html') > -1) {
            html = event.clipboardData.getData('text/html');
        } else if (event.clipboardData.types.indexOf('text/plain') > -1) {
            html = event.clipboardData.getData('text/plain');
        }
        html = html.split('\n').map(function (line, index) {
            return (index > 0) ? '<div>' + line + '</div>' : line;
        }).join('');
        html = NgxEmojiUtils.filterHtml(html, this.handler.allowedTags.concat(['div']));
        html = NgxEmojiHelper.replaceSymbolsToEmojis(html);
        this.element.execCommand('insertHTML', html);
    }

    @HostListener("copy", ['$event'])
    protected onCopy(event: ClipboardEvent): void {
        let previousRange = window.getSelection().getRangeAt(0);
        if (previousRange.collapsed) {
            return;
        }
        event.preventDefault();
        let content: DocumentFragment = window.getSelection().getRangeAt(0).cloneContents();
        let div = document.createElement('div');
        div.appendChild(content);
        div.innerHTML = this.handler.getMarkupHtml(div)
            .split('\n')
            .map(function (value) {
                return '<div>' + value + '</div>';
            })
            .join('\n');
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        let range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.element.execCommand('copy');
        div.remove();
        selection.removeAllRanges();
        selection.addRange(previousRange);
    }

    @HostListener("cut", ['$event'])
    protected onCut(event: ClipboardEvent): void {
        this.onCopy(event);
        this.element.execCommand('delete');
    }

    /**
     * Click events
     */

    @HostListener("click", ['$event'])
    protected onClick(event: MouseEvent): void {
        if (this.contenteditable && NgxEmojiHelper.isEmojiNode(event.toElement)) {
            let range = document.createRange();
            range.setStartBefore(event.toElement);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        if (event.toElement.classList.contains('command')) {
            this.onCommand.emit(event.toElement.textContent);
        }
        if (event.toElement instanceof HTMLAnchorElement) {
            event.preventDefault();
            this.onLink.emit(event.toElement.getAttribute('href'));
        }
    }

    /**
     * Internal
     */

    protected onElementModified(): void {
        //this.handler.findCommands();
        //this.handler.findLinks();

        if (this.textChange.observers.length > 0) {
            this.textChange.emit(this.text);
        }
        if (this.entitiesChange.observers.length > 0) {
            this.entitiesChange.emit(this.entities);
        }
        if (this.fullHtmlChange.observers.length > 0) {
            this.fullHtmlChange.emit(this.fullHtml);
        }
        if (this.htmlChange.observers.length > 0) {
            this.htmlChange.emit(this.html);
        }
    }

    protected insertEmoji(emoji: string): void {
        if (!this.contenteditable) {
            return;
        }
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.lastSelectionRange);
        this.formatter.insertEmoji(emoji);
        this.emojiService.recentPush(emoji);
    }

}

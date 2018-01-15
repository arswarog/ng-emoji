import { Component, OnDestroy, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { NgxHtmlConverter } from "./ngx-html.converter";
import { Subscription } from "rxjs/Subscription";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";
import { isString } from "util";

export interface EnterOn {
    shift?: boolean;
    ctrl?: boolean;
}

export interface SelectionRange {
    start: number;
    stop: number;
}

export enum NgxEmojiEntityType {
    Bold = 'bold',
    Italic = 'italic',
    Underline = 'underline'
}

export interface NgxEmojiEntity {
    type: NgxEmojiEntityType;
    offset: number;
    length: number;
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

    protected readonly htmlConverter = new NgxHtmlConverter();
    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription = new Subscription();
    protected lastSelectionRange: Range;

    public constructor(
        protected elRef: ElementRef,
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
        this.getNativeElement().appendChild(document.createTextNode(''));
        let range = document.createRange();
        range.setStart(this.getNativeElement().firstChild, 0);
        this.lastSelectionRange = range;

        /**
         * see: onFocusout()
         */
        if (document.onselectionchange !== undefined) {
            document.addEventListener('selectionchange', function () {
                component.onSelectionchange();
            });
        }
    }

    public getNativeElement(): HTMLElement {
        return this.elRef.nativeElement;
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
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
        this.onContenteditable.emit(editable);
    }

    public get contenteditable(): boolean {
        return this._contenteditable;
    }

    @Output('contenteditable')
    public readonly onContenteditable: EventEmitter<boolean> = new EventEmitter<boolean>();

    /**
     * Enter on
     */

    @Input('enterOn')
    public set enterOn(enterOn: EnterOn) {
        this._enterOn = enterOn;
        this.onEnterOn.emit(enterOn);
    }

    public get enterOn(): EnterOn {
        return this._enterOn;
    }

    @Output('enterOn')
    public readonly onEnterOn: EventEmitter<EnterOn> = new EventEmitter<EnterOn>();

    public enterKeyIsEnter(): boolean {
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    }

    public enterKeyIsCtrlEnter(): boolean {
        return (this.enterOn.ctrl) ? true : false;
    }

    public enterKeyIsShiftEnter(): boolean {
        return (this.enterOn.shift) ? true : false;
    }

    /**
     * Text
     */

    @Input('text')
    public set text(text: string) {
        text = this.htmlConverter.filterHtml(text);
        text = this.replaceAll(text, '  ', '&nbsp;&nbsp;');
        for(let i = 0; i < text.length; i++) {
            let code = text.codePointAt(i);
            //console.log(code);
        }
        let paragraphs = text.split('\n');
        text = '';
        for (let paragraph of paragraphs) {
            if (paragraph.trim().length == 0) {
                paragraph = '<br>';
            }
            text += '<div>' + paragraph + '</div>';
        }
        this.getNativeElement().innerHTML = text;
        if (this.getNativeElement().childNodes.length == 0) {
            this.getNativeElement().appendChild(document.createTextNode(''));
        }
        let range = document.createRange();
        let lastChild = this.getNativeElement().lastChild;
        while (lastChild.hasChildNodes()) {
            lastChild = lastChild.lastChild;
        }
        range.setStart(lastChild, lastChild.textContent.length);
        this.lastSelectionRange = range;
    }

    public get text(): string {
        let html = document.createElement('div');
        html.innerHTML = this.getNativeElement().innerHTML;

        for (let img of this.arrayOfNodeList(html.getElementsByTagName('img'))) {
            if (!img.classList.contains('ngx-emoji')) {
                continue;
            }
            let emoji = '';
            for (let i = 0; i < img.classList.length; i++) {
                if (img.classList.item(i).substr(0, 10) == 'ngx-emoji-') {
                    emoji = img.classList.item(i).substr(10);
                }
            }
            emoji = this.createEmojiUtf(emoji);
            img.parentElement.insertBefore(document.createTextNode(emoji), img);
            img.remove();
        }

        html.innerHTML = this.getHtmlWithoutParagraphs(html).innerHTML;
        let text = this.htmlConverter.filterHtml(html.innerHTML);
        text = this.replaceAll(text, '\u00A0', ' ');
        return text;
    }

    @Output('text')
    public readonly onText: EventEmitter<string> = new EventEmitter<string>();

    /**
     * HTML
     */

    @Input('html')
    public set html(html: string) {
        //
    }

    public get html(): string {
        let html = document.createElement('div');
        html.innerHTML = this.getNativeElement().innerHTML;

        for (let img of this.arrayOfNodeList(html.getElementsByTagName('img'))) {
            if (!img.classList.contains('ngx-emoji')) {
                continue;
            }
            let emoji = document.createElement('i');
            emoji.className = img.className;
            emoji.setAttribute('aria-hidden', 'true');
            img.parentElement.insertBefore(emoji, img);
            img.remove();
        }

        return html.innerHTML;
    }

    @Output('html')
    public readonly onHtml: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Entities
     */

    protected normalizeEntityType(type: any): NgxEmojiEntityType {
        if (!type || !isString(type) || type.trim().length == 0) {
            return null;
        }
        for (let value in NgxEmojiEntityType) {
            if ((value as string).toUpperCase() == (type as string).toUpperCase()) {
                return NgxEmojiEntityType[value] as NgxEmojiEntityType;
            }
        }
        return null;
    }

    protected isSameEntities(a: NgxEmojiEntity[], b: NgxEmojiEntity[]): boolean {
        for (let _a of a) {
            let found = false;
            for (let _b of b) {
                if (_a.type == _b.type && _a.length == _b.length && _a.offset == _b.offset) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                return false;
            }
        }
        return true;
    }

    @Input('entities')
    public set entities(entities: NgxEmojiEntity[]) {
        if (this.isSameEntities(entities, this.entities)) {
            return;
        }
        let component = this;
        entities = entities.filter(function (entity) {
            entity.type = component.normalizeEntityType(entity.type);
            return (entity.type) ? true : false;
        });

        let html = document.createElement('div');
        html.contentEditable = 'true';
        document.getElementsByTagName('body')[0].appendChild(html);
        this.text = this.text;
        html.innerHTML = this.getNativeElement().innerHTML;
        let selection = window.getSelection();
        let endFounded = false;
        for (let entity of entities) {
            let range = document.createRange();
            let offset = 0;
            let rf = function (nodes: NodeList) {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes.item(i);
                    rf(node.childNodes); // recursion...
                    if (!node.hasChildNodes()) {
                        let textLength = node.textContent.length;
                        if (offset <= entity.offset && offset + textLength >= entity.offset) {
                            range.setStart(node, entity.offset - offset);
                        }
                        if (offset <= entity.offset + entity.length && offset + textLength >= entity.offset + entity.length) {
                            range.setEnd(node, entity.offset + entity.length - offset);
                            endFounded = true;
                        }
                        offset += textLength;
                    }
                    if (component.isBlockNode(node)) {
                        offset++;
                        if (entity.offset + entity.length == offset) {
                            range.setEndAfter(node.lastChild);
                            endFounded = true;
                        }
                    }
                }
            };
            rf(html.childNodes);
            if (!endFounded) {
                range.setEndAfter(html.lastChild);
            }
            selection.removeAllRanges();
            selection.addRange(range);
            this.formatText(entity.type);
        }
        html.remove();
        this.getNativeElement().innerHTML = html.innerHTML;
    }

    public get entities(): NgxEmojiEntity[] {
        let component = this;
        let entities: NgxEmojiEntity[] = [];
        let rf = function (nodes: NodeList, offset: number): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                if (node.textContent.trim().length > 0) {
                    let nodeName = node.nodeName.toUpperCase();
                    if (nodeName == 'B' || nodeName == 'STRONG') {
                        entities.push({
                            type: NgxEmojiEntityType.Bold,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'I' || nodeName == 'EM') {
                        entities.push({
                            type: NgxEmojiEntityType.Italic,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'U') {
                        entities.push({
                            type: NgxEmojiEntityType.Underline,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                }
                rf(node.childNodes, offset);
                offset += node.textContent.length;
            }
        };
        rf(this.getHtmlWithoutParagraphs(this.getNativeElement()).childNodes, 0);
        return entities;
    }

    @Output('entities')
    public readonly onEntities: EventEmitter<NgxEmojiEntity[]> = new EventEmitter<NgxEmojiEntity[]>();

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
            this.insertNewLine();
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
            this.insertNewLine();
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
        }
    }

    protected emitEnter(): void {
        this.onText.emit(this.text);
        this.onEntities.emit(this.entities);
        this.onHtml.emit(this.html);
        this.onEnter.emit();
    }

    /**
     * Keyboard events
     */

    @HostListener("keydown", ['$event'])
    protected onKeydown(event: KeyboardEvent): void {
        if (event.ctrlKey && event.keyCode == 66) {
            event.preventDefault();
            this.formatText(NgxEmojiEntityType.Bold);
        }
        if (event.ctrlKey && event.keyCode == 73) {
            event.preventDefault();
            this.formatText(NgxEmojiEntityType.Italic);
        }
        if (event.ctrlKey && event.keyCode == 85) {
            event.preventDefault();
            this.formatText(NgxEmojiEntityType.Underline);
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
        if (document.onselectionchange === undefined) {
            this.lastSelectionRange = window.getSelection().getRangeAt(0);
        }
    }

    protected onSelectionchange() {
        let selection = window.getSelection();
        if (selection.containsNode(this.getNativeElement(), true)) {
            this.lastSelectionRange = selection.getRangeAt(0);
        }
    }

    /**
     * Internal
     */

    protected arrayOfNodeList<T extends Node>(list: NodeListOf<T>): T[] {
        let result: T[] = [];
        for (let i = 0; i < list.length; i++) {
            result.push(list.item(i))
        }
        return result;
    }

    protected isBlockNode(node: Node): boolean {
        return node instanceof HTMLElement
            && window.getComputedStyle(node, '').display == 'block';
    }

    protected getHtmlWithoutParagraphs(element: HTMLElement): HTMLElement {
        let html = '';
        let component = this;
        let rf = function (nodes: NodeList): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                if (node.hasChildNodes()) {
                    html += '<' + node.nodeName + '>';
                    rf(node.childNodes); // recursion...
                    html += '</' + node.nodeName + '>';
                    if (component.isBlockNode(node) && !element.lastChild.isSameNode(node)) {
                        html += '\n';
                    }
                } else {
                    if (node.nodeName == 'BR') {
                        if (node.parentNode.isSameNode(element)
                            || !component.isBlockNode(node.parentNode)
                            || !node.parentNode.lastChild.isSameNode(node)) {
                            html += '\n';
                        }
                    } else {
                        html += node.textContent;
                    }
                }
            }
        };
        rf(element.childNodes);

        let result = document.createElement('div');
        result.innerHTML = html;
        return result;
    }

    /**
     * String replace all implementation
     *
     * See: https://stackoverflow.com/a/1144788/1617101
     */
    protected replaceAll(str: string, find: string, replace: string): string {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }

    protected execCommand(command: string, value?: any): boolean {
        return document.execCommand(command, false, value);
    }

    protected insertNewLine(): void {
        this.execCommand('insertParagraph');
    }

    protected createEmojiImg(emoji: string): string {
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.createEmojiUtf(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    }

    protected createEmojiUtf(emoji: string): string {
        emoji = emoji.trim();
        if (emoji.length == 0) {
            return '�';
        }
        let emojiCodes = emoji.split('-').map(function (value) {
            return parseInt('0x' + value, 16);
        });
        try {
            emoji = String.fromCodePoint.apply(String, emojiCodes);
        } catch (error) {
            console.warn('Convert emoji ' + emoji + ' error: ' + error.message);
            emoji = '�';
        }
        return emoji;
    }

    protected insertEmoji(emoji: string): void {
        if (!this.contenteditable) {
            return;
        }
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.lastSelectionRange);
        this.execCommand(
            'insertHTML',
            this.createEmojiImg(emoji)
        );
    }

    protected formatText(type: NgxEmojiEntityType): void {
        switch (type) {
            case NgxEmojiEntityType.Bold:
                this.execCommand('bold');
                break;
            case NgxEmojiEntityType.Italic:
                this.execCommand('italic');
                break;
            case NgxEmojiEntityType.Underline:
                this.execCommand('underline');
                break;
        }
    }

}

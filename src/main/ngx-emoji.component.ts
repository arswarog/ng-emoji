import { Component, OnDestroy, ElementRef, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { NgxEmojiService } from "./ngx-emoji.service";
import { Subscription } from "rxjs/Subscription";
import { NgxEmojiPickerComponent } from "./ngx-emoji-picker.component";

export interface EnterOn {
    shift?: boolean;
    ctrl?: boolean;
}

export interface SelectionRange {
    start: number;
    stop: number;
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
    private prevent: {
        text: string, entities: NgxEmojiEntity[]
    } = {
        text: null, entities: null
    };

    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription = new Subscription();
    protected lastSelectionRange: Range;
    protected readonly allowedTags = [
        'b', 'i', 'u', 'strong', 'em',
        'strike', 'code', 'pre', 'a'
    ];

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
        this.getNativeElement().addEventListener('DOMSubtreeModified', function () {
            component.onChanges();
        });

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
        this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags)
    }

    public get fullHtml(): string {
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

    @Output('fullHtml')
    public readonly onFullHtml: EventEmitter<string> = new EventEmitter<string>();

    /**
     * HTML wihout parahraphs
     */

    @Input('html')
    public set html(html: string) {
        this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags)
    }

    public get html(): string {
        return this.getHtml(this.getNativeElement());
    }

    protected getHtml(rootElement: HTMLElement, withCommands: boolean = false): string {
        let component = this;
        let html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                let blockNode = component.isBlockNode(node);
                if (node.nodeName == 'PRE') {
                    blockNode = false;
                }
                if (component.isEmojiNode(node)) {
                    html += component.emojiToSymbol(component.emojiFromNode(node));
                } else if (node.hasChildNodes()) {
                    if (!blockNode) {
                        if (node instanceof HTMLAnchorElement) {
                            html += '<' + node.nodeName.toLowerCase() + ' href="' + node.getAttribute('href') + '">';
                        } else if ((node as HTMLElement).classList.contains('command')) {
                            html += '<' + node.nodeName.toLowerCase() + ' class="command">';
                        } else {
                            html += '<' + node.nodeName.toLowerCase() + '>';
                        }
                    }
                    rf(node.childNodes); // recursion...
                    if (!blockNode) {
                        html += '</' + node.nodeName.toLowerCase() + '>';
                    }
                } else {
                    html += component.replaceAll(node.textContent, '\n', '');
                }
                if (blockNode && !rootElement.lastChild.isSameNode(node)) {
                    html += '\n';
                }
                if (node.nodeName == 'BR'
                    && node.parentNode.firstChild.nodeName != 'BR'
                    && node.parentNode.childNodes.length != 1
                    && rootElement.lastChild.lastChild
                    && !rootElement.lastChild.lastChild.isSameNode(node)) {
                    html += '\n';
                }
                // hotfix: insert new line after non-block node
                if (!blockNode
                    && node.previousSibling
                    && node.previousSibling.textContent.length > 0
                    && node.nextSibling
                    && component.isBlockNode(node.nextSibling)
                    && node.parentNode.isSameNode(rootElement)) {
                    html += '\n';
                }
                // hotfix: insert new line after last emoji
                if (component.isEmojiNode(node)
                    && (node as HTMLElement).nextElementSibling
                    && component.isBlockNode((node as HTMLElement).nextElementSibling)
                    && node.nextSibling.textContent.length == 0) {
                    html += '\n';
                }
            }
        };
        rf(rootElement.childNodes);
        html = this.replaceAll(html, '\u00A0', ' ');
        html = this.replaceAll(html, '&nbsp;', ' ');
        return this.filterHtml(html, this.allowedTags, withCommands);
    }

    @Output('html')
    public readonly onHtml: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Text
     */

    @Input('text')
    public set text(text: string) {
        if (!this.contenteditable && text == this.prevent.text) {
            return;
        }
        this.prevent.text = text;

        text = this.filterHtml(text);
        text = this.replaceAll(text, '\u00A0', ' ');
        text = this.replaceAll(text, '  ', '&nbsp;&nbsp;');
        text = this.replaceSymbolsToEmojis(text);

        let paragraphs = text.split('\n');
        text = '';
        for (let paragraph of paragraphs) {
            if (paragraph.length == 0) {
                paragraph = '<br>';
            }
            if (paragraph == ' ') {
                paragraph = '&nbsp;';
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
        return this.filterHtml(this.html);
    }

    @Output('text')
    public readonly onText: EventEmitter<string> = new EventEmitter<string>();

    /**
     * Entities
     */

    protected normalizeEntityType(type: any): NgxEmojiEntityType {
        if (typeof type == 'string') {
            type = type.toLowerCase();
        }
        switch (type) {
            case 'bold':
            case NgxEmojiEntityType.Bold:
                return NgxEmojiEntityType.Bold;
            case 'italic':
            case NgxEmojiEntityType.Italic:
                return NgxEmojiEntityType.Italic;
            case 'underline':
            case NgxEmojiEntityType.Underline:
                return NgxEmojiEntityType.Underline;
            case 'strike':
            case NgxEmojiEntityType.Strike:
                return NgxEmojiEntityType.Strike;
            case 'code':
            case NgxEmojiEntityType.Code:
                return NgxEmojiEntityType.Code;
            case 'pre':
            case NgxEmojiEntityType.Pre:
                return NgxEmojiEntityType.Pre;
            case 'command':
            case NgxEmojiEntityType.Command:
                return NgxEmojiEntityType.Command;
            case 'url':
            case NgxEmojiEntityType.Url:
                return NgxEmojiEntityType.Url;
            case 'text_link':
            case NgxEmojiEntityType.TextLink:
                return NgxEmojiEntityType.TextLink;
            default:
                return null;
        }
    }

    @Input('entities')
    public set entities(entities: NgxEmojiEntity[]) {
        if (!this.contenteditable && JSON.stringify(entities) == JSON.stringify(this.prevent.entities)) {
            return;
        }
        this.prevent.entities = entities;

        let component = this;
        let nativeElement = this.getNativeElement();
        let selection = window.getSelection();
        let previousRange = (selection.rangeCount) ? selection.getRangeAt(0) : null;
        let previousContenteditableState = this.contenteditable;
        if (!Array.isArray(entities)) {
            entities = [];
        }
        entities = entities.map(function (entity) {
            return {
                offset: entity.offset,
                length: entity.length,
                type: component.normalizeEntityType(entity.type),
                url: entity.url
            };
        }).filter(function (entity) {
            return entity.type !== null;
        });

        // Clear html formatting
        let text = this.text;
        this.text = '';
        this.text = text;

        // Enable contenteditable for exec commands
        this.contenteditable = true;

        let endFounded = false;
        for (let entity of entities) {
            let range = document.createRange();
            let offset = 0;
            let rf = function (nodes: NodeList) {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes.item(i);
                    if (component.isEmojiNode(node)) {
                        let textLength = component.emojiToSymbol(component.emojiFromNode(node)).length;
                        if (offset <= entity.offset && offset + textLength >= entity.offset) {
                            range.setStartBefore(node);
                        }
                        if (offset <= entity.offset + entity.length && offset + textLength >= entity.offset + entity.length) {
                            range.setEndAfter(node);
                            endFounded = true;
                        }
                        offset += textLength;
                    } else {
                        if (node.hasChildNodes()) {
                            rf(node.childNodes); // recursion
                        } else if (node.nodeName != 'BR') {
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
                }
            };
            rf(nativeElement.childNodes);
            if (!endFounded) {
                range.setEndAfter(nativeElement.lastChild);
            }
            selection.removeAllRanges();
            selection.addRange(range);
            switch (entity.type) {
                case NgxEmojiEntityType.TextLink:
                    this.formatText(NgxEmojiEntityType.TextLink, entity.url);
                    break;
                case NgxEmojiEntityType.Url:
                    this.formatText(NgxEmojiEntityType.Url, range.cloneContents().textContent);
                    break;
                default:
                    this.formatText(entity.type as NgxEmojiEntityType);
                    break;
            }
        }

        // Restore previous state
        selection.removeAllRanges();
        if (previousRange) {
            selection.addRange(previousRange);
        }
        this.contenteditable = previousContenteditableState;
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
                    if (nodeName == 'STRIKE') {
                        entities.push({
                            type: NgxEmojiEntityType.Strike,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'CODE') {
                        entities.push({
                            type: NgxEmojiEntityType.Code,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'PRE') {
                        entities.push({
                            type: NgxEmojiEntityType.Pre,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'A' && node instanceof HTMLAnchorElement
                        && node.getAttribute('href') == node.textContent) {
                        entities.push({
                            type: NgxEmojiEntityType.Url,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'A' && node instanceof HTMLAnchorElement
                        && node.getAttribute('href') != node.textContent) {
                        entities.push({
                            type: NgxEmojiEntityType.TextLink,
                            offset: offset,
                            length: node.textContent.length,
                            url: node.textContent
                        });
                    }
                    if (node instanceof HTMLElement && node.classList.contains('command')) {
                        entities.push({
                            type: NgxEmojiEntityType.Command,
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                }
                rf(node.childNodes, offset);
                offset += node.textContent.length;
            }
        };
        let div = document.createElement('div');
        div.innerHTML = this.getHtml(this.getNativeElement(), true);
        rf(div.childNodes, 0);
        div.remove();
        entities = entities.map(function (entity) {
            if (entity.type == NgxEmojiEntityType.TextLink) {
                entity.type = 'text_link';
            } else {
                entity.type = NgxEmojiEntityType[entity.type as number].toLowerCase();
            }
            return entity;
        });
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
        } else {
            this.insertNewLine();
        }
    }

    protected emitEnter(): void {
        this.onText.emit(this.text);
        this.onEntities.emit(this.entities);
        this.onFullHtml.emit(this.fullHtml);
        this.onHtml.emit(this.html);
        this.onEnter.emit();
    }

    /**
     * Event command
     */

    @Output('command')
    public readonly onCommand: EventEmitter<void> = new EventEmitter<void>();

    /**
     * Event link
     */

    @Output('link')
    public readonly onLink: EventEmitter<void> = new EventEmitter<void>();

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
        html = this.filterHtml(html, this.allowedTags.concat(['div']));
        html = this.replaceSymbolsToEmojis(html);
        this.execCommand('insertHTML', html);
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
        div.innerHTML = this.getHtml(div);
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        let range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        let selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.execCommand('copy');
        div.remove();
        selection.removeAllRanges();
        selection.addRange(previousRange);
    }

    @HostListener("cut", ['$event'])
    protected onCut(event: ClipboardEvent): void {
        this.onCopy(event);
        this.execCommand('delete');
    }

    /**
     * Click events
     */

    @HostListener("click", ['$event'])
    protected onClick(event: MouseEvent): void {
        if (this.contenteditable && this.isEmojiNode(event.toElement)) {
            let range = document.createRange();
            range.setStartBefore(event.toElement);
            let selection = window.getSelection();
            selection.removeAllRanges();
            selection.addRange(range);
        }
        if (event.toElement.classList.contains('command')) {
            this.onCommand.emit();
        }
        if (event.toElement instanceof HTMLAnchorElement) {
            this.onLink.emit();
        }
    }

    /**
     * Internal
     */

    protected onChanges(): void {
        if (this.onText.observers.length > 0) {
            this.onText.emit(this.text);
        }
        if (this.onEntities.observers.length > 0) {
            this.onEntities.emit(this.entities);
        }
        if (this.onFullHtml.observers.length > 0) {
            this.onFullHtml.emit(this.fullHtml);
        }
        if (this.onHtml.observers.length > 0) {
            this.onHtml.emit(this.html);
        }
    }

    protected arrayOfNodeList<T extends Node>(list: NodeListOf<T>): T[] {
        let result: T[] = [];
        for (let i = 0; i < list.length; i++) {
            result.push(list.item(i))
        }
        return result;
    }

    protected isBlockNode(node: Node): boolean {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        if (node instanceof HTMLDivElement) {
            return true;
        }
        return window.getComputedStyle(node, '').display == 'block';
    }

    protected isEmojiNode(node: Node): boolean {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    }

    protected emojiFromNode(node: Node): string {
        if (!this.isEmojiNode(node)) {
            return null;
        }
        let classList = (node as HTMLElement).classList;
        let emoji = null;
        for (let i = 0; i < classList.length; i++) {
            if (classList.item(i).substr(0, 10) == 'ngx-emoji-') {
                emoji = classList.item(i).substr(10);
                break;
            }
        }
        return emoji;
    }

    protected replaceSymbolsToEmojis(text: string): string {
        let component = this;
        text = text.replace(this.getEmojiRegex(), function (match) {
            return component.createEmojiImg(component.emojiFromSymbol(match));
        });
        text = this.replaceAll(text, '\uFE0F', ''); // remove variation selector
        return text;
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
        switch (command) {
            case 'code':
                return this.execCommandTag('code');
            case 'pre':
                return this.execCommandTag('pre');
            case 'command':
                return this.execCommandTag('span', [{name: 'class', value: 'command'}]);
            default:
                return document.execCommand(command, false, value);
        }
    }

    protected execCommandTag(tag: string, attributes: { name: string, value: string }[] = []): boolean {
        let component = this;
        this.execCommand('superscript');
        let tmp = document.createElement("div");
        tmp.innerHTML = this.getNativeElement().innerHTML;
        let html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                if (node.nodeType == node.ELEMENT_NODE) {
                    let nodeName = node.nodeName.toLowerCase();
                    if (nodeName == 'sup') {
                        nodeName = tag;
                        html += '<' + tag;
                        for (let attr of attributes) {
                            html += ' ' + attr.name + '="' + attr.value + '"';
                        }
                        html += '>';
                    } else {
                        html += '<' + nodeName + '>';
                    }
                    rf(node.childNodes);
                    html += '</' + nodeName + '>';
                } else {
                    html += node.textContent;
                }
            }
        };
        rf(tmp.childNodes);
        tmp.remove();
        this.getNativeElement().innerHTML = html;
        return true;
    }

    protected insertNewLine(): void {
        this.execCommand('insertParagraph');
    }

    protected createEmojiImg(emoji: string): string {
        this.emojiService.loadEmoji(emoji);
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    }

    protected emojiToSymbol(emoji: string): string {
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

        // Debug. Remove it
        /*let s: string[] = [];
        let s2: string[] = [];
        for (let i = 0; i < emoji.length; i++) {
            s.push(emoji.codePointAt(i).toString(16).toUpperCase());
            s2.push(emoji.charCodeAt(i).toString(16).toUpperCase());
        }
        console.log(emoji, s, s2);*/

        return emoji;
    }

    protected emojiFromSymbol(symbol: string): string {
        let codes: string[] = [];
        for (let i = 0; i < symbol.length; i++) {
            codes.push(symbol.codePointAt(i).toString(16));
        }
        codes = codes
            .filter(function (code: string) {
                let p = parseInt(code, 16);
                return !(p >= 0xD800 && p <= 0xDFFF);
            })
            .map(function (code: string) {
                let pad = '0000';
                return pad.substring(0, pad.length - code.length) + code;
            });
        return codes.join('-').toUpperCase();
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
        this.emojiService.recentPush(emoji);
    }

    protected filterHtml(html: string, allowTags: string[] = [], withCommands: boolean = false): string {
        let component = this;
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        let tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                if (node.nodeType == node.ELEMENT_NODE) {
                    if (allowTags.indexOf(node.nodeName) > -1
                        || withCommands && (node as HTMLElement).classList.contains('command')) {
                        if (node instanceof HTMLAnchorElement) {
                            html += '<' + node.nodeName.toLowerCase() + ' href="' + node.getAttribute('href') + '">';
                        } else if (withCommands && (node as HTMLElement).classList.contains('command')) {
                            html += '<' + node.nodeName.toLowerCase() + ' class="command">';
                        } else {
                            html += '<' + node.nodeName.toLowerCase() + '>';
                        }
                        rf(node.childNodes);
                        html += '</' + node.nodeName.toLowerCase() + '>';
                    } else {
                        rf(node.childNodes);
                    }
                } else {
                    html += node.textContent;
                }
            }
        };
        rf(tmp.childNodes);
        tmp.remove();
        return html;
    }

    protected formatText(type: NgxEmojiEntityType, value?: string): void {
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
            case NgxEmojiEntityType.Pre:
                this.execCommand('pre');
                break;
            case NgxEmojiEntityType.Code:
                this.execCommand('code');
                break;
            case NgxEmojiEntityType.Strike:
                this.execCommand('strikeThrough');
                break;
            case NgxEmojiEntityType.Command:
                this.execCommand('command');
                break;
            case NgxEmojiEntityType.TextLink:
            case NgxEmojiEntityType.Url:
                this.execCommand('createLink', value);
                break;
        }
    }

    /**
     * See: https://habrahabr.ru/company/badoo/blog/282113/
     */
    protected getEmojiRegex(): RegExp {
        let emojiRanges = [
            '(?:\uD83C[\uDDE6-\uDDFF]){2}', // флаги
            '[\u0023-\u0039]\u20E3', // числа
            '(?:[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]|[\u270A-\u270D\u261D\u26F9])\uD83C[\uDFFB-\uDFFF]', // цвет кожи

            // семья и профессии
            '[\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC67]([\u200D][\uD83D][\uDC66-\uDC67])?',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC8B][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC00-\uDFFF]',
            '[\uD83C-\uD83E][\uDC00-\uDFFF][\uFE0F]?[\u200D][\u2640-\u2696][\uFE0F]?',
            '[\uD83D][\uDD75][\uFE0F][\u200D][\u2640][\uFE0F]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2708]',
            '[\uD83C-\uD83E][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC66][\u200D][\uD83C-\uD83E][\uDC66]',
            '[\u26F9][\uFE0F][\u200D][\u2640-\u2696][\uFE0F]',

            '[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]', // суррогатная пара
            '[\u3297\u3299\u303D\u2B50\u2B55\u2B1B\u27BF\u27A1\u24C2\u25B6\u25C0\u2600\u2705\u21AA\u21A9]', // обычные
            '[\u203C\u2049\u2122\u2328\u2601\u260E\u261d\u2620\u2626\u262A\u2638\u2639\u263a\u267B\u267F\u2702\u2708]',
            '[\u2194-\u2199]',
            '[\u2B05-\u2B07]',
            '[\u2934-\u2935]',
            '[\u2795-\u2797]',
            '[\u2709-\u2764]',
            '[\u2622-\u2623]',
            '[\u262E-\u262F]',
            '[\u231A-\u231B]',
            '[\u23E9-\u23EF]',
            '[\u23F0-\u23F4]',
            '[\u23F8-\u23FA]',
            '[\u25AA-\u25AB]',
            '[\u25FB-\u25FE]',
            '[\u2602-\u2618]',
            '[\u2648-\u2653]',
            '[\u2660-\u2668]',
            '[\u26A0-\u26FA]',
            '[\u2692-\u269C]'
        ];
        return new RegExp(emojiRanges.join('|'), 'g');
    }

}

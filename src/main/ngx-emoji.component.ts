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
    Underline
}

export interface NgxEmojiEntity {
    type: NgxEmojiEntityType | string;
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
    private prevent: {
        text: string, entities: NgxEmojiEntity[]
    } = {
        text: null, entities: null
    };

    protected emojiService: NgxEmojiService;
    protected emojiServiceSubscription: Subscription = new Subscription();
    protected lastSelectionRange: Range;
    protected readonly allowedTags = ['b', 'i', 'u', 'strong', 'em'];

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

    protected getHtml(rootElement: HTMLElement): string {
        let component = this;
        let html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of component.arrayOfNodeList(nodes)) {
                let blockNode = component.isBlockNode(node);
                if (component.isEmojiNode(node)) {
                    html += component.emojiToSymbol(component.emojiFromNode(node));
                } else if (node.hasChildNodes()) {
                    if (!blockNode) {
                        html += '<' + node.nodeName.toLowerCase() + '>';
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
        return html;
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

        let component = this;
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
                type: component.normalizeEntityType(entity.type)
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
            this.formatText(entity.type as NgxEmojiEntityType);
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
                            type: NgxEmojiEntityType[NgxEmojiEntityType.Bold].toLowerCase(),
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'I' || nodeName == 'EM') {
                        entities.push({
                            type: NgxEmojiEntityType[NgxEmojiEntityType.Italic].toLowerCase(),
                            offset: offset,
                            length: node.textContent.length
                        });
                    }
                    if (nodeName == 'U') {
                        entities.push({
                            type: NgxEmojiEntityType[NgxEmojiEntityType.Underline].toLowerCase(),
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
        div.innerHTML = this.html;
        rf(div.childNodes, 0);
        div.remove();
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
        this.onFullHtml.emit(this.fullHtml);
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
        html = this.filterHtml(html, this.allowedTags);
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
        return document.execCommand(command, false, value);
    }

    protected insertNewLine(): void {
        this.execCommand('insertParagraph');
    }

    protected createEmojiImg(emoji: string): string {
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
    }

    protected filterHtml(html: string, allowTags: string[] = []): string {
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
                    if (allowTags.indexOf(node.nodeName) > -1) {
                        html += '<' + node.nodeName.toLowerCase() + '>';
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

    /**
     * See: https://stackoverflow.com/a/41164587/1617101
     */
    protected getEmojiRegex(): RegExp {
        return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    }

}

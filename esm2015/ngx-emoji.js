import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Subscription as Subscription$1 } from 'rxjs/Subscription';
import { isArray, isString } from 'util';
import 'ngx-emoji/ngx-emoji.min.css';
import 'ngx-emoji/emojis.min.css';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiService {
    constructor() {
        this.onEmojiPicked = new Subject$1();
    }
    /**
     * @param {?} component
     * @return {?}
     */
    setActiveComponent(component) {
        this.activeComponent = component;
    }
    /**
     * @param {?} component
     * @return {?}
     */
    isActiveComponent(component) {
        return component === this.activeComponent;
    }
}
NgxEmojiService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgxEmojiService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/**
 * @record
 */

/** @enum {string} */
const NgxEmojiEntityType = {
    Bold: 'bold',
    Italic: 'italic',
    Underline: 'underline',
};
/**
 * @record
 */

class NgxEmojiComponent {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    constructor(elRef, globalEmojiService) {
        this.elRef = elRef;
        this._contenteditable = false;
        this._enterOn = {
            shift: false,
            ctrl: false
        };
        this.prevent = {
            text: null, entities: null
        };
        this.emojiServiceSubscription = new Subscription$1();
        this.allowedTags = ['b', 'i', 'u', 'strong', 'em'];
        this.onContenteditable = new EventEmitter();
        this.onEnterOn = new EventEmitter();
        this.onFullHtml = new EventEmitter();
        this.onHtml = new EventEmitter();
        this.onText = new EventEmitter();
        this.onEntities = new EventEmitter();
        /**
         * Enter events
         */
        this.onEnter = new EventEmitter();
        let /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        let /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            if (globalEmojiService.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
        this.getNativeElement().appendChild(document.createTextNode(''));
        let /** @type {?} */ range = document.createRange();
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
    /**
     * @return {?}
     */
    getNativeElement() {
        return this.elRef.nativeElement;
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        this.emojiServiceSubscription.unsubscribe();
    }
    /**
     * @param {?} service
     * @return {?}
     */
    addEmojiService(service) {
        service.setActiveComponent(this);
        let /** @type {?} */ component = this;
        let /** @type {?} */ subscription = service.onEmojiPicked.subscribe(function (emoji) {
            if (service.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
    }
    /**
     * Emoji picker
     * @param {?} pickerComponent
     * @return {?}
     */
    set inputPicker(pickerComponent) {
        this.emojiServiceSubscription.unsubscribe();
        this.emojiServiceSubscription = new Subscription$1();
        let /** @type {?} */ service = new NgxEmojiService();
        service.setActiveComponent(this);
        this.emojiService = service;
        pickerComponent.setEmojiService(service);
        let /** @type {?} */ component = this;
        let /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            if (service.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
    }
    /**
     * Content editable
     * @param {?} editable
     * @return {?}
     */
    set attrContenteditable(editable) {
        this.contenteditable = editable;
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set contenteditable(editable) {
        this._contenteditable = editable;
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
        this.onContenteditable.emit(editable);
    }
    /**
     * @return {?}
     */
    get contenteditable() {
        return this._contenteditable;
    }
    /**
     * Enter on
     * @param {?} enterOn
     * @return {?}
     */
    set enterOn(enterOn) {
        this._enterOn = enterOn;
        this.onEnterOn.emit(enterOn);
    }
    /**
     * @return {?}
     */
    get enterOn() {
        return this._enterOn;
    }
    /**
     * @return {?}
     */
    enterKeyIsEnter() {
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    }
    /**
     * @return {?}
     */
    enterKeyIsCtrlEnter() {
        return (this.enterOn.ctrl) ? true : false;
    }
    /**
     * @return {?}
     */
    enterKeyIsShiftEnter() {
        return (this.enterOn.shift) ? true : false;
    }
    /**
     * HTML
     * @param {?} html
     * @return {?}
     */
    set fullHtml(html) {
        this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags);
    }
    /**
     * @return {?}
     */
    get fullHtml() {
        let /** @type {?} */ html = document.createElement('div');
        html.innerHTML = this.getNativeElement().innerHTML;
        for (let /** @type {?} */ img of this.arrayOfNodeList(html.getElementsByTagName('img'))) {
            if (!img.classList.contains('ngx-emoji')) {
                continue;
            }
            let /** @type {?} */ emoji = document.createElement('i');
            emoji.className = img.className;
            emoji.setAttribute('aria-hidden', 'true');
            img.parentElement.insertBefore(emoji, img);
            img.remove();
        }
        return html.innerHTML;
    }
    /**
     * HTML wihout parahraphs
     * @param {?} html
     * @return {?}
     */
    set html(html) {
        this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags);
    }
    /**
     * @return {?}
     */
    get html() {
        return this.getHtml(this.getNativeElement());
    }
    /**
     * @param {?} rootElement
     * @return {?}
     */
    getHtml(rootElement) {
        let /** @type {?} */ component = this;
        let /** @type {?} */ html = '';
        let /** @type {?} */ rf = function (nodes) {
            for (let /** @type {?} */ node of component.arrayOfNodeList(nodes)) {
                let /** @type {?} */ blockNode = component.isBlockNode(node);
                if (component.isEmojiNode(node)) {
                    html += component.emojiToSymbol(component.emojiFromNode(node));
                }
                else if (node.hasChildNodes()) {
                    if (!blockNode) {
                        html += '<' + node.nodeName.toLowerCase() + '>';
                    }
                    rf(node.childNodes); // recursion...
                    if (!blockNode) {
                        html += '</' + node.nodeName.toLowerCase() + '>';
                    }
                }
                else {
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
                    && (/** @type {?} */ (node)).nextElementSibling
                    && component.isBlockNode((/** @type {?} */ (node)).nextElementSibling)
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
    /**
     * Text
     * @param {?} text
     * @return {?}
     */
    set text(text) {
        if (!this.contenteditable && text == this.prevent.text) {
            return;
        }
        this.prevent.text = text;
        text = this.filterHtml(text);
        text = this.replaceAll(text, '\u00A0', ' ');
        text = this.replaceAll(text, '  ', '&nbsp;&nbsp;');
        text = this.replaceSymbolsToEmojis(text);
        let /** @type {?} */ paragraphs = text.split('\n');
        text = '';
        for (let /** @type {?} */ paragraph of paragraphs) {
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
        let /** @type {?} */ range = document.createRange();
        let /** @type {?} */ lastChild = this.getNativeElement().lastChild;
        while (lastChild.hasChildNodes()) {
            lastChild = lastChild.lastChild;
        }
        range.setStart(lastChild, lastChild.textContent.length);
        this.lastSelectionRange = range;
    }
    /**
     * @return {?}
     */
    get text() {
        return this.filterHtml(this.html);
    }
    /**
     * Entities
     * @param {?} type
     * @return {?}
     */
    normalizeEntityType(type) {
        if (!type || !isString(type) || type.trim().length == 0) {
            return null;
        }
        for (let /** @type {?} */ value in NgxEmojiEntityType) {
            if ((/** @type {?} */ (value)).toUpperCase() == (/** @type {?} */ (type)).toUpperCase()) {
                return /** @type {?} */ (NgxEmojiEntityType[value]);
            }
        }
        return null;
    }
    /**
     * @param {?} entities
     * @return {?}
     */
    set entities(entities) {
        if (!this.contenteditable && JSON.stringify(entities) == JSON.stringify(this.prevent.entities)) {
            return;
        }
        this.prevent.entities = entities;
        let /** @type {?} */ component = this;
        let /** @type {?} */ nativeElement = this.getNativeElement();
        let /** @type {?} */ selection = window.getSelection();
        let /** @type {?} */ previousRange = (selection.rangeCount) ? selection.getRangeAt(0) : null;
        let /** @type {?} */ previousContenteditableState = this.contenteditable;
        if (!isArray(entities)) {
            entities = [];
        }
        entities = entities.filter(function (entity) {
            entity.type = component.normalizeEntityType(entity.type);
            return (entity.type) ? true : false;
        });
        // Clear html formatting
        let /** @type {?} */ text = this.text;
        this.text = '';
        this.text = text;
        // Enable contenteditable for exec commands
        this.contenteditable = true;
        let /** @type {?} */ endFounded = false;
        for (let /** @type {?} */ entity of entities) {
            let /** @type {?} */ range = document.createRange();
            let /** @type {?} */ offset = 0;
            let /** @type {?} */ rf = function (nodes) {
                for (let /** @type {?} */ i = 0; i < nodes.length; i++) {
                    let /** @type {?} */ node = nodes.item(i);
                    if (component.isEmojiNode(node)) {
                        let /** @type {?} */ textLength = component.emojiToSymbol(component.emojiFromNode(node)).length;
                        if (offset <= entity.offset && offset + textLength >= entity.offset) {
                            range.setStartBefore(node);
                        }
                        if (offset <= entity.offset + entity.length && offset + textLength >= entity.offset + entity.length) {
                            range.setEndAfter(node);
                            endFounded = true;
                        }
                        offset += textLength;
                    }
                    else {
                        if (node.hasChildNodes()) {
                            rf(node.childNodes); // recursion
                        }
                        else if (node.nodeName != 'BR') {
                            let /** @type {?} */ textLength = node.textContent.length;
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
            this.formatText(entity.type);
        }
        // Restore previous state
        selection.removeAllRanges();
        if (previousRange) {
            selection.addRange(previousRange);
        }
        this.contenteditable = previousContenteditableState;
    }
    /**
     * @return {?}
     */
    get entities() {
        let /** @type {?} */ component = this;
        let /** @type {?} */ entities = [];
        let /** @type {?} */ rf = function (nodes, offset) {
            for (let /** @type {?} */ node of component.arrayOfNodeList(nodes)) {
                if (node.textContent.trim().length > 0) {
                    let /** @type {?} */ nodeName = node.nodeName.toUpperCase();
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
        let /** @type {?} */ div = document.createElement('div');
        div.innerHTML = this.html;
        rf(div.childNodes, 0);
        div.remove();
        return entities;
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownEnter(event) {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsEnter()) {
            this.emitEnter();
        }
        else {
            this.insertNewLine();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownControlEnter(event) {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsCtrlEnter()) {
            this.emitEnter();
        }
        else {
            this.insertNewLine();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownShiftEnter(event) {
        if (!this.contenteditable) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsShiftEnter()) {
            this.emitEnter();
        }
    }
    /**
     * @return {?}
     */
    emitEnter() {
        this.onText.emit(this.text);
        this.onEntities.emit(this.entities);
        this.onFullHtml.emit(this.fullHtml);
        this.onHtml.emit(this.html);
        this.onEnter.emit();
    }
    /**
     * Keyboard events
     * @param {?} event
     * @return {?}
     */
    onKeydown(event) {
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
     * @return {?}
     */
    onFocus() {
        this.emojiService.setActiveComponent(this);
    }
    /**
     * Get selection before blur don't work in Firefox.
     * Use hotfix with onSelectionchange()
     * This is fallback
     * @return {?}
     */
    onFocusout() {
        if (document.onselectionchange === undefined) {
            this.lastSelectionRange = window.getSelection().getRangeAt(0);
        }
    }
    /**
     * @return {?}
     */
    onSelectionchange() {
        let /** @type {?} */ selection = window.getSelection();
        if (selection.containsNode(this.getNativeElement(), true)) {
            this.lastSelectionRange = selection.getRangeAt(0);
        }
    }
    /**
     * Clipboard events
     * @param {?} event
     * @return {?}
     */
    onPaste(event) {
        event.preventDefault();
        let /** @type {?} */ html = '';
        if (event.clipboardData.types.indexOf('text/html') > -1) {
            html = event.clipboardData.getData('text/html');
        }
        else if (event.clipboardData.types.indexOf('text/plain') > -1) {
            html = event.clipboardData.getData('text/plain');
        }
        html = this.filterHtml(html, this.allowedTags);
        html = this.replaceSymbolsToEmojis(html);
        this.execCommand('insertHTML', html);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onCopy(event) {
        let /** @type {?} */ previousRange = window.getSelection().getRangeAt(0);
        if (previousRange.collapsed) {
            return;
        }
        event.preventDefault();
        let /** @type {?} */ content = window.getSelection().getRangeAt(0).cloneContents();
        let /** @type {?} */ div = document.createElement('div');
        div.appendChild(content);
        div.innerHTML = this.getHtml(div);
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        let /** @type {?} */ range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        let /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.execCommand('copy');
        div.remove();
        selection.removeAllRanges();
        selection.addRange(previousRange);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onCut(event) {
        this.onCopy(event);
        this.execCommand('delete');
    }
    /**
     * Internal
     * @template T
     * @param {?} list
     * @return {?}
     */
    arrayOfNodeList(list) {
        let /** @type {?} */ result = [];
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
            result.push(list.item(i));
        }
        return result;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isBlockNode(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        if (node instanceof HTMLDivElement) {
            return true;
        }
        return window.getComputedStyle(node, '').display == 'block';
    }
    /**
     * @param {?} node
     * @return {?}
     */
    isEmojiNode(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    }
    /**
     * @param {?} node
     * @return {?}
     */
    emojiFromNode(node) {
        if (!this.isEmojiNode(node)) {
            return null;
        }
        let /** @type {?} */ classList = (/** @type {?} */ (node)).classList;
        let /** @type {?} */ emoji = null;
        for (let /** @type {?} */ i = 0; i < classList.length; i++) {
            if (classList.item(i).substr(0, 10) == 'ngx-emoji-') {
                emoji = classList.item(i).substr(10);
                break;
            }
        }
        return emoji;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    replaceSymbolsToEmojis(text) {
        let /** @type {?} */ component = this;
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
     * @param {?} str
     * @param {?} find
     * @param {?} replace
     * @return {?}
     */
    replaceAll(str, find, replace) {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * @param {?} command
     * @param {?=} value
     * @return {?}
     */
    execCommand(command, value) {
        return document.execCommand(command, false, value);
    }
    /**
     * @return {?}
     */
    insertNewLine() {
        this.execCommand('insertParagraph');
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    createEmojiImg(emoji) {
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    emojiToSymbol(emoji) {
        emoji = emoji.trim();
        if (emoji.length == 0) {
            return '�';
        }
        let /** @type {?} */ emojiCodes = emoji.split('-').map(function (value) {
            return parseInt('0x' + value, 16);
        });
        try {
            emoji = String.fromCodePoint.apply(String, emojiCodes);
        }
        catch (/** @type {?} */ error) {
            console.warn('Convert emoji ' + emoji + ' error: ' + error.message);
            emoji = '�';
        }
        return emoji;
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    emojiFromSymbol(symbol) {
        let /** @type {?} */ codes = [];
        for (let /** @type {?} */ i = 0; i < symbol.length; i++) {
            codes.push(symbol.codePointAt(i).toString(16));
        }
        codes = codes
            .filter(function (code) {
            let /** @type {?} */ p = parseInt(code, 16);
            return !(p >= 0xD800 && p <= 0xDFFF);
        })
            .map(function (code) {
            let /** @type {?} */ pad = '0000';
            return pad.substring(0, pad.length - code.length) + code;
        });
        return codes.join('-').toUpperCase();
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    insertEmoji(emoji) {
        if (!this.contenteditable) {
            return;
        }
        let /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.lastSelectionRange);
        this.execCommand('insertHTML', this.createEmojiImg(emoji));
    }
    /**
     * @param {?} html
     * @param {?=} allowTags
     * @return {?}
     */
    filterHtml(html, allowTags = []) {
        let /** @type {?} */ component = this;
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        let /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        let /** @type {?} */ rf = function (nodes) {
            for (let /** @type {?} */ node of component.arrayOfNodeList(nodes)) {
                if (node.nodeType == node.ELEMENT_NODE) {
                    if (allowTags.indexOf(node.nodeName) > -1) {
                        html += '<' + node.nodeName.toLowerCase() + '>';
                        rf(node.childNodes);
                        html += '</' + node.nodeName.toLowerCase() + '>';
                    }
                    else {
                        rf(node.childNodes);
                    }
                }
                else {
                    html += node.textContent;
                }
            }
        };
        rf(tmp.childNodes);
        tmp.remove();
        return html;
    }
    /**
     * @param {?} type
     * @return {?}
     */
    formatText(type) {
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
     * @return {?}
     */
    getEmojiRegex() {
        return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    }
}
NgxEmojiComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji',
                template: ''
            },] },
];
/** @nocollapse */
NgxEmojiComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: NgxEmojiService, },
];
NgxEmojiComponent.propDecorators = {
    "inputPicker": [{ type: Input, args: ['picker',] },],
    "attrContenteditable": [{ type: Input, args: ['attr.contenteditable',] },],
    "contenteditable": [{ type: Input, args: ['contenteditable',] },],
    "onContenteditable": [{ type: Output, args: ['contenteditable',] },],
    "enterOn": [{ type: Input, args: ['enterOn',] },],
    "onEnterOn": [{ type: Output, args: ['enterOn',] },],
    "fullHtml": [{ type: Input, args: ['fullHtml',] },],
    "onFullHtml": [{ type: Output, args: ['fullHtml',] },],
    "html": [{ type: Input, args: ['html',] },],
    "onHtml": [{ type: Output, args: ['html',] },],
    "text": [{ type: Input, args: ['text',] },],
    "onText": [{ type: Output, args: ['text',] },],
    "entities": [{ type: Input, args: ['entities',] },],
    "onEntities": [{ type: Output, args: ['entities',] },],
    "onEnter": [{ type: Output, args: ['enter',] },],
    "onKeydownEnter": [{ type: HostListener, args: ["keydown.enter", ['$event'],] },],
    "onKeydownControlEnter": [{ type: HostListener, args: ["keydown.control.enter", ['$event'],] },],
    "onKeydownShiftEnter": [{ type: HostListener, args: ["keydown.shift.enter", ['$event'],] },],
    "onKeydown": [{ type: HostListener, args: ["keydown", ['$event'],] },],
    "onFocus": [{ type: HostListener, args: ["focus",] },],
    "onFocusout": [{ type: HostListener, args: ["focusout",] },],
    "onPaste": [{ type: HostListener, args: ["paste", ['$event'],] },],
    "onCopy": [{ type: HostListener, args: ["copy", ['$event'],] },],
    "onCut": [{ type: HostListener, args: ["cut", ['$event'],] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class NgxEmojiPickerComponent {
    /**
     * @param {?} emojiService
     */
    constructor(emojiService) {
        this.emojiService = emojiService;
        this.emojis = [];
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.emojis = require('ngx-emoji/emojis.json');
    }
    /**
     * @param {?} service
     * @return {?}
     */
    setEmojiService(service) {
        this.emojiService = service;
    }
    /**
     * @param {?} emojiComponent
     * @return {?}
     */
    set inputFor(emojiComponent) {
        this.emojiService = new NgxEmojiService();
        emojiComponent.addEmojiService(this.emojiService);
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    emojiPicked(emoji) {
        this.emojiService.onEmojiPicked.next(emoji);
    }
}
NgxEmojiPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji-picker',
                template: `<i *ngFor="let emoji of emojis"
   [class]="'ngx-emoji ngx-emoji-' + emoji.unified"
   aria-hidden="true"
   (click)="emojiPicked(emoji.unified)"
></i>
`
            },] },
];
/** @nocollapse */
NgxEmojiPickerComponent.ctorParameters = () => [
    { type: NgxEmojiService, },
];
NgxEmojiPickerComponent.propDecorators = {
    "inputFor": [{ type: Input, args: ['for',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiModule {
}
NgxEmojiModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    NgxEmojiPickerComponent, NgxEmojiComponent
                ],
                providers: [
                    NgxEmojiService
                ],
                exports: [
                    NgxEmojiPickerComponent, NgxEmojiComponent
                ]
            },] },
];
/** @nocollapse */
NgxEmojiModule.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * Generated bundle index. Do not edit.
 */

export { NgxEmojiModule, NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiEntityType, NgxEmojiService };
//# sourceMappingURL=ngx-emoji.js.map

import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Subscription as Subscription$1 } from 'rxjs/Subscription';
import 'ngx-emoji/ngx-emoji.min.css';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

class NgxEmojiService {
    constructor() {
        this.onEmojiPicked = new Subject$1();
    }
    /**
     * @return {?}
     */
    static getEmojis() {
        if (this.emojis === null) {
            this.emojis = require('ngx-emoji/emojis.json');
        }
        return this.emojis;
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
    /**
     * @param {?} emoji
     * @return {?}
     */
    static loadEmoji(emoji) {
        let /** @type {?} */ bundleId = this.getEmojiBundle(emoji);
        if (bundleId !== null && !this.isCssBundleLoaded(bundleId)) {
            this.loadCssBundle(bundleId);
        }
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    static getEmojiBundle(emoji) {
        for (let /** @type {?} */ e of NgxEmojiService.getEmojis()) {
            if (e.unified == emoji) {
                return e.bundle;
            }
        }
        return null;
    }
    /**
     * @param {?} bundleId
     * @return {?}
     */
    static loadCssBundle(bundleId) {
        if (!this.isCssBundleLoaded(bundleId)) {
            let /** @type {?} */ id = 'ngx-emoji-bundle-' + bundleId;
            let /** @type {?} */ head = document.getElementsByTagName('head')[0];
            let /** @type {?} */ link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = NgxEmojiModule.getEmojiBundlesPath() + 'ngx-emoji-b' + bundleId + '.min.css';
            link.media = 'all';
            head.appendChild(link);
        }
    }
    /**
     * @param {?} bundleId
     * @return {?}
     */
    static isCssBundleLoaded(bundleId) {
        return (document.getElementById('ngx-emoji-bundle-' + bundleId)) ? true : false;
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    recentPush(emoji) {
        let /** @type {?} */ recent = this.getRecent();
        if (recent.indexOf(emoji) > -1) {
            return;
        }
        recent = [emoji].concat(recent)
            .slice(0, NgxEmojiModule.getRecentMax());
        window.localStorage.setItem('ngx-emoji-recent', recent.join(':'));
    }
    /**
     * @return {?}
     */
    getRecent() {
        let /** @type {?} */ recent = window.localStorage.getItem('ngx-emoji-recent');
        if (!recent) {
            return [];
        }
        return recent.split(':');
    }
}
NgxEmojiService.emojis = null;
NgxEmojiService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgxEmojiService.ctorParameters = () => [];

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiUtils {
    /**
     * @template T
     * @param {?} list
     * @return {?}
     */
    static arrayOfNodeList(list) {
        let /** @type {?} */ result = [];
        for (let /** @type {?} */ i = 0; i < list.length; i++) {
            result.push(list.item(i));
        }
        return result;
    }
    ;
    /**
     * @param {?} node
     * @return {?}
     */
    static isBlockNode(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        if (node instanceof HTMLDivElement) {
            return true;
        }
        return window.getComputedStyle(node, '').display == 'block';
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
    static replaceAll(str, find, replace) {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }
    /**
     * @param {?} html
     * @param {?=} allowTags
     * @param {?=} withCommands
     * @return {?}
     */
    static filterHtml(html, allowTags = [], withCommands = false) {
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        let /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        let /** @type {?} */ rf = function (nodes) {
            for (let /** @type {?} */ node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
                if (node.nodeType == node.ELEMENT_NODE) {
                    if (allowTags.indexOf(node.nodeName) > -1
                        || withCommands && (/** @type {?} */ (node)).classList.contains('command')) {
                        if (node instanceof HTMLAnchorElement) {
                            html += '<' + node.nodeName.toLowerCase() + ' href="' + node.getAttribute('href') + '">';
                        }
                        else if (withCommands && (/** @type {?} */ (node)).classList.contains('command')) {
                            html += '<' + node.nodeName.toLowerCase() + ' class="command">';
                        }
                        else {
                            html += '<' + node.nodeName.toLowerCase() + '>';
                        }
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
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiHelper {
    /**
     * @param {?} emoji
     * @return {?}
     */
    static createEmojiImg(emoji) {
        NgxEmojiService.loadEmoji(emoji);
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    static emojiToSymbol(emoji) {
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
     * For debug...
     * @param {?} emoji
     * @return {?}
     */
    static dumpEmoji(emoji) {
        let /** @type {?} */ s = [];
        let /** @type {?} */ s2 = [];
        for (let /** @type {?} */ i = 0; i < emoji.length; i++) {
            s.push(emoji.codePointAt(i).toString(16).toUpperCase());
            s2.push(emoji.charCodeAt(i).toString(16).toUpperCase());
        }
        console.log(emoji, s, s2);
    }
    /**
     * @param {?} symbol
     * @return {?}
     */
    static emojiFromSymbol(symbol) {
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
     * @param {?} text
     * @return {?}
     */
    static replaceSymbolsToEmojis(text) {
        text = text.replace(this.getEmojiRegex(), function (match) {
            return NgxEmojiHelper.createEmojiImg(NgxEmojiHelper.emojiFromSymbol(match));
        });
        text = NgxEmojiUtils.replaceAll(text, '\uFE0F', ''); // remove variation selector
        return text;
    }
    /**
     * @param {?} node
     * @return {?}
     */
    static isEmojiNode(node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    }
    /**
     * @param {?} node
     * @return {?}
     */
    static emojiFromNode(node) {
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
     * See: https://habrahabr.ru/company/badoo/blog/282113/
     * @return {?}
     */
    static getEmojiRegex() {
        let /** @type {?} */ emojiRanges = [
            '(?:\uD83C[\uDDE6-\uDDFF]){2}',
            '[\u0023-\u0039]\u20E3',
            '(?:[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]|[\u270A-\u270D\u261D\u26F9])\uD83C[\uDFFB-\uDFFF]',
            '[\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC69][\u200D][\uD83D][\uDC66-\uDC67]([\u200D][\uD83D][\uDC66-\uDC67])?',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2764][\u200D][\uD83D][\uDC8B][\u200D][\uD83D][\uDC68-\uDC69]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC00-\uDFFF]',
            '[\uD83C-\uD83E][\uDC00-\uDFFF][\uFE0F]?[\u200D][\u2640-\u2696][\uFE0F]?',
            '[\uD83D][\uDD75][\uFE0F][\u200D][\u2640][\uFE0F]',
            '[\uD83D][\uDC68-\uDC69][\u200D][\u2708]',
            '[\uD83C-\uD83E][\uDC68-\uDC69][\u200D][\uD83C-\uD83E][\uDC66][\u200D][\uD83C-\uD83E][\uDC66]',
            '[\u26F9][\uFE0F][\u200D][\u2640-\u2696][\uFE0F]',
            '[\uD83D\uD83C\uD83E][\uDC00-\uDFFF]',
            '[\u3297\u3299\u303D\u2B50\u2B55\u2B1B\u27BF\u27A1\u24C2\u25B6\u25C0\u2600\u2705\u21AA\u21A9]',
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

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiElement {
    /**
     * @param {?} nativeElement
     */
    constructor(nativeElement) {
        this.nativeElement = nativeElement;
        this.onModified = new EventEmitter();
        let /** @type {?} */ onModified = this.onModified;
        nativeElement.addEventListener('DOMSubtreeModified', function (event) {
            onModified.emit(/** @type {?} */ (event));
        });
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set contentEditable(editable) {
        if (editable != this.contentEditable) {
            this.nativeElement.setAttribute('contenteditable', editable ? 'true' : 'false');
        }
    }
    /**
     * @return {?}
     */
    get contentEditable() {
        return this.nativeElement.getAttribute('contenteditable') == 'true';
    }
    /**
     * @param {?} command
     * @param {?=} value
     * @return {?}
     */
    execCommand(command, value) {
        let /** @type {?} */ editable = this.contentEditable;
        this.contentEditable = true;
        let /** @type {?} */ result = false;
        switch (command) {
            case 'code':
                result = this.execCommandTag('code');
                break;
            case 'pre':
                result = this.execCommandTag('pre');
                break;
            case 'command':
                result = this.execCommandTag('span', [{ name: 'class', value: 'command' }]);
                break;
            default:
                result = document.execCommand(command, false, value);
                break;
        }
        this.contentEditable = editable;
        return result;
    }
    /**
     * @param {?} tag
     * @param {?=} attributes
     * @return {?}
     */
    execCommandTag(tag, attributes = []) {
        this.execCommand('superscript');
        let /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = this.nativeElement.innerHTML;
        let /** @type {?} */ html = '';
        let /** @type {?} */ rf = function (nodes) {
            for (let /** @type {?} */ node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
                if (node.nodeType == node.ELEMENT_NODE) {
                    let /** @type {?} */ nodeName = node.nodeName.toLowerCase();
                    if (nodeName == 'sup') {
                        nodeName = tag;
                        html += '<' + tag;
                        for (let /** @type {?} */ attr of attributes) {
                            html += ' ' + attr.name + '="' + attr.value + '"';
                        }
                        html += '>';
                    }
                    else {
                        html += '<' + nodeName;
                        for (let /** @type {?} */ i = 0; i < node.attributes.length; i++) {
                            let /** @type {?} */ attr = node.attributes.item(i);
                            html += ' ' + attr.name + '="' + attr.value + '"';
                        }
                        html += '>';
                    }
                    rf(node.childNodes);
                    html += '</' + nodeName + '>';
                }
                else {
                    html += node.textContent;
                }
            }
        };
        rf(tmp.childNodes);
        tmp.remove();
        this.nativeElement.innerHTML = html;
        return true;
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiFormatter {
    /**
     * @param {?} element
     */
    constructor(element) {
        this.element = element;
    }
    /**
     * @param {?} type
     * @param {?=} value
     * @return {?}
     */
    formatText(type, value) {
        switch (type) {
            case NgxEmojiEntityType.Bold:
                this.element.execCommand('bold');
                break;
            case NgxEmojiEntityType.Italic:
                this.element.execCommand('italic');
                break;
            case NgxEmojiEntityType.Underline:
                this.element.execCommand('underline');
                break;
            case NgxEmojiEntityType.Pre:
                this.element.execCommand('pre');
                break;
            case NgxEmojiEntityType.Code:
                this.element.execCommand('code');
                break;
            case NgxEmojiEntityType.Strike:
                this.element.execCommand('strikeThrough');
                break;
            case NgxEmojiEntityType.Command:
                this.element.execCommand('command');
                break;
            case NgxEmojiEntityType.TextLink:
            case NgxEmojiEntityType.Url:
                this.element.execCommand('createLink', value);
                break;
        }
    }
    /**
     * @return {?}
     */
    insertNewLine() {
        this.element.execCommand('insertParagraph');
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    insertEmoji(emoji) {
        this.element.execCommand('insertHTML', NgxEmojiHelper.createEmojiImg(emoji));
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiHandler {
    /**
     * @param {?} element
     * @param {?} formatter
     */
    constructor(element, formatter) {
        this.element = element;
        this.formatter = formatter;
        this.allowedTags = [
            'b', 'i', 'u', 'strong', 'em',
            'strike', 'code', 'pre', 'a'
        ];
    }
    /**
     * @param {?} text
     * @param {?} entities
     * @return {?}
     */
    format(text, entities) {
        let /** @type {?} */ handler = this;
        let /** @type {?} */ nativeElement = this.element.nativeElement;
        let /** @type {?} */ selection = window.getSelection();
        let /** @type {?} */ previousRange = (selection.rangeCount) ? selection.getRangeAt(0) : null;
        if (!Array.isArray(entities)) {
            entities = [];
        }
        entities = entities.map(function (entity) {
            return {
                offset: entity.offset,
                length: entity.length,
                type: handler.normalizeEntityType(entity.type),
                url: entity.url
            };
        }).filter(function (entity) {
            return entity.type !== null;
        });
        /* set text */
        text = NgxEmojiUtils.filterHtml(text);
        text = NgxEmojiUtils.replaceAll(text, '\u00A0', ' ');
        text = NgxEmojiUtils.replaceAll(text, '  ', '&nbsp;&nbsp;');
        text = NgxEmojiHelper.replaceSymbolsToEmojis(text);
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
        this.element.nativeElement.innerHTML = text;
        if (this.element.nativeElement.childNodes.length == 0) {
            this.element.nativeElement.appendChild(document.createTextNode(''));
        }
        /* set entities */
        let /** @type {?} */ endFounded = false;
        for (let /** @type {?} */ entity of entities) {
            let /** @type {?} */ range = document.createRange();
            let /** @type {?} */ offset = 0;
            let /** @type {?} */ rf = function (nodes) {
                for (let /** @type {?} */ i = 0; i < nodes.length; i++) {
                    let /** @type {?} */ node = nodes.item(i);
                    if (NgxEmojiHelper.isEmojiNode(node)) {
                        let /** @type {?} */ textLength = NgxEmojiHelper.emojiToSymbol(NgxEmojiHelper.emojiFromNode(node)).length;
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
                        if (NgxEmojiUtils.isBlockNode(node)) {
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
                    this.formatter.formatText(NgxEmojiEntityType.TextLink, entity.url);
                    break;
                case NgxEmojiEntityType.Url:
                    this.formatter.formatText(NgxEmojiEntityType.Url, range.cloneContents().textContent);
                    break;
                default:
                    this.formatter.formatText(/** @type {?} */ (entity.type));
                    break;
            }
        }
        selection.removeAllRanges();
        if (previousRange) {
            selection.addRange(previousRange);
        }
    }
    /**
     * @return {?}
     */
    getEntities() {
        let /** @type {?} */ entities = [];
        let /** @type {?} */ rf = function (nodes, offset) {
            for (let /** @type {?} */ node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
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
        let /** @type {?} */ div = document.createElement('div');
        div.innerHTML = this.getMarkupHtml(this.element.nativeElement, true);
        rf(div.childNodes, 0);
        div.remove();
        entities = entities.map(function (entity) {
            if (entity.type == NgxEmojiEntityType.TextLink) {
                entity.type = 'text_link';
            }
            else {
                entity.type = NgxEmojiEntityType[/** @type {?} */ (entity.type)].toLowerCase();
            }
            return entity;
        });
        return entities;
    }
    /**
     * @return {?}
     */
    getText() {
        return NgxEmojiUtils.filterHtml(this.getMarkupHtml());
    }
    /**
     * @return {?}
     */
    getFullHtml() {
        let /** @type {?} */ html = document.createElement('div');
        html.innerHTML = this.element.nativeElement.innerHTML;
        for (let /** @type {?} */ img of NgxEmojiUtils.arrayOfNodeList(html.getElementsByTagName('img'))) {
            if (!img.classList.contains('ngx-emoji')) {
                continue;
            }
            let /** @type {?} */ emoji = document.createElement('i');
            emoji.className = img.className;
            emoji.setAttribute('aria-hidden', 'true');
            img.parentElement.insertBefore(emoji, img);
            img.remove();
        }
        let /** @type {?} */ result = html.innerHTML;
        html.remove();
        return result;
    }
    /**
     * @param {?=} rootElement
     * @param {?=} withCommands
     * @return {?}
     */
    getMarkupHtml(rootElement = null, withCommands = false) {
        if (!rootElement) {
            rootElement = this.element.nativeElement;
        }
        let /** @type {?} */ html = '';
        let /** @type {?} */ rf = function (nodes) {
            for (let /** @type {?} */ node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
                let /** @type {?} */ blockNode = NgxEmojiUtils.isBlockNode(node);
                if (node.nodeName == 'PRE') {
                    blockNode = false;
                }
                if (NgxEmojiHelper.isEmojiNode(node)) {
                    html += NgxEmojiHelper.emojiToSymbol(NgxEmojiHelper.emojiFromNode(node));
                }
                else if (node.hasChildNodes()) {
                    if (!blockNode) {
                        if (node instanceof HTMLAnchorElement) {
                            html += '<' + node.nodeName.toLowerCase() + ' href="' + node.getAttribute('href') + '">';
                        }
                        else if ((/** @type {?} */ (node)).classList.contains('command')) {
                            html += '<' + node.nodeName.toLowerCase() + ' class="command">';
                        }
                        else {
                            html += '<' + node.nodeName.toLowerCase() + '>';
                        }
                    }
                    rf(node.childNodes); // recursion...
                    if (!blockNode) {
                        html += '</' + node.nodeName.toLowerCase() + '>';
                    }
                }
                else {
                    html += NgxEmojiUtils.replaceAll(node.textContent, '\n', '');
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
                    && NgxEmojiUtils.isBlockNode(node.nextSibling)
                    && node.parentNode.isSameNode(rootElement)) {
                    html += '\n';
                }
                // hotfix: insert new line after last emoji
                if (NgxEmojiHelper.isEmojiNode(node)
                    && (/** @type {?} */ (node)).nextElementSibling
                    && NgxEmojiUtils.isBlockNode((/** @type {?} */ (node)).nextElementSibling)
                    && node.nextSibling.textContent.length == 0) {
                    html += '\n';
                }
            }
        };
        rf(rootElement.childNodes);
        html = NgxEmojiUtils.replaceAll(html, '\u00A0', ' ');
        html = NgxEmojiUtils.replaceAll(html, '&nbsp;', ' ');
        return NgxEmojiUtils.filterHtml(html, this.allowedTags, withCommands);
    }
    /**
     * @param {?} html
     * @return {?}
     */
    setFullHtml(html) {
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags);
    }
    /**
     * @param {?} html
     * @return {?}
     */
    setMarkupHtml(html) {
        html = html.split('\n').map(function (line, index) {
            return (index > 0) ? '<div>' + line + '</div>' : line;
        }).join('');
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags.concat('div'));
    }
    /**
     * @param {?} type
     * @return {?}
     */
    normalizeEntityType(type) {
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
    /**
     * @return {?}
     */
    findCommands() {
        let /** @type {?} */ selection = window.getSelection();
        if (selection.anchorNode) {
            let /** @type {?} */ node = selection.anchorNode;
            if (node.parentElement.classList.contains('command')) {
                if (node.textContent.trim().length != node.textContent.length) {
                    /*node.textContent = node.textContent.trim();
                                        let node2 = document.createTextNode(' ');
                                        node.parentElement.parentElement.appendChild(node2);
                                        let range = document.createRange();
                                        range.setStartAfter(node2);
                                        range.collapse(true);
                                        selection.removeAllRanges();
                                        selection.addRange(range);*/
                }
            }
            else {
                let /** @type {?} */ regex = /(^|\s)(\/[a-z0-9]+)($|\s)/ig;
                let /** @type {?} */ match;
                while ((match = regex.exec(node.textContent)) !== null) {
                    let /** @type {?} */ offset = match.index;
                    if (match[0].charAt(0) == ' ') {
                        offset++;
                    }
                    let /** @type {?} */ length = match[2].length;
                    if (match[2].charAt(length - 1) == ' ') {
                        length--;
                    }
                    regex.lastIndex = regex.lastIndex - (match[0].length - match[2].length);
                    let /** @type {?} */ node2 = document.createTextNode(node.textContent.substr(0, offset));
                    node.textContent = node.textContent.substr(offset + length);
                    node.parentNode.insertBefore(node2, node);
                    let /** @type {?} */ span = document.createElement('span');
                    span.classList.add('command');
                    span.textContent = match[2].trim();
                    node.parentNode.insertBefore(span, node);
                }
            }
        }
    }
    /**
     * @return {?}
     */
    findLinks() {
        //
    }
}

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */

/** @enum {number} */
const NgxEmojiEntityType = {
    Bold: 0,
    Italic: 1,
    Underline: 2,
    Strike: 3,
    Code: 4,
    Pre: 5,
    Command: 6,
    Url: 7,
    TextLink: 8,
};
NgxEmojiEntityType[NgxEmojiEntityType.Bold] = "Bold";
NgxEmojiEntityType[NgxEmojiEntityType.Italic] = "Italic";
NgxEmojiEntityType[NgxEmojiEntityType.Underline] = "Underline";
NgxEmojiEntityType[NgxEmojiEntityType.Strike] = "Strike";
NgxEmojiEntityType[NgxEmojiEntityType.Code] = "Code";
NgxEmojiEntityType[NgxEmojiEntityType.Pre] = "Pre";
NgxEmojiEntityType[NgxEmojiEntityType.Command] = "Command";
NgxEmojiEntityType[NgxEmojiEntityType.Url] = "Url";
NgxEmojiEntityType[NgxEmojiEntityType.TextLink] = "TextLink";
/**
 * @record
 */

class NgxEmojiComponentPrevent {
    constructor() {
        this.htmlCounter = 0;
        this.htmlValue = '';
        this.fullHtmlCounter = 0;
        this.fullHtmlValue = '';
        this.textCounter = 0;
        this.textValue = '';
        this.entitiesCounter = 0;
        this.entitiesValue = [];
        this.entitiesStringValue = '';
    }
}
class NgxEmojiComponent {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    constructor(elRef, globalEmojiService) {
        this._contenteditable = false;
        this._enterOn = {
            shift: false,
            ctrl: false
        };
        this.emojiServiceSubscription = new Subscription$1();
        this.preventCounter = 0;
        this.preventSet = new NgxEmojiComponentPrevent();
        this.preventGet = new NgxEmojiComponentPrevent();
        this.contenteditableChange = new EventEmitter();
        this.enterOnChange = new EventEmitter();
        this.fullHtmlChange = new EventEmitter();
        this.htmlChange = new EventEmitter();
        this.textChange = new EventEmitter();
        this.entitiesChange = new EventEmitter();
        /**
         * Enter events
         */
        this.onEnter = new EventEmitter();
        /**
         * Event command
         */
        this.onCommand = new EventEmitter();
        /**
         * Event link
         */
        this.onLink = new EventEmitter();
        let /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        let /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            if (globalEmojiService.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
        this.element = new NgxEmojiElement(elRef.nativeElement);
        this.element.nativeElement.appendChild(document.createTextNode(''));
        this.formatter = new NgxEmojiFormatter(this.element);
        this.handler = new NgxEmojiHandler(this.element, this.formatter);
        let /** @type {?} */ range = document.createRange();
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
    /**
     * @param {?} value
     * @return {?}
     */
    set placeholder(value) {
        this.element.nativeElement.setAttribute('placeholder', value);
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
        this.element.contentEditable = editable;
        this.contenteditableChange.emit(editable);
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
        this.enterOnChange.emit(enterOn);
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
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    }
    /**
     * @return {?}
     */
    enterKeyIsCtrlEnter() {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.ctrl) ? true : false;
    }
    /**
     * @return {?}
     */
    enterKeyIsShiftEnter() {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.shift) ? true : false;
    }
    /**
     * HTML
     * @param {?} html
     * @return {?}
     */
    set fullHtml(html) {
        if ((this.preventSet.htmlValue != html || this.preventSet.htmlCounter != this.preventCounter)
            && html != this.html) {
            this.handler.setFullHtml(html);
            this.preventSet.fullHtmlValue = html;
            this.preventSet.fullHtmlCounter = this.preventCounter;
        }
    }
    /**
     * @return {?}
     */
    get fullHtml() {
        if (this.preventGet.fullHtmlCounter != this.preventCounter) {
            this.preventGet.fullHtmlValue = this.handler.getFullHtml();
            this.preventGet.fullHtmlCounter = this.preventCounter;
        }
        return this.preventGet.fullHtmlValue;
    }
    /**
     * HTML wihout parahraphs
     * @param {?} html
     * @return {?}
     */
    set html(html) {
        if ((this.preventSet.htmlCounter != this.preventCounter || this.preventSet.htmlValue != html)
            && html != this.html) {
            this.handler.setMarkupHtml(html);
            this.preventSet.htmlValue = html;
            this.preventSet.htmlCounter = this.preventCounter;
        }
    }
    /**
     * @return {?}
     */
    get html() {
        if (this.preventGet.htmlCounter != this.preventCounter) {
            this.preventGet.htmlValue = this.handler.getMarkupHtml();
            this.preventGet.htmlCounter = this.preventCounter;
        }
        return this.preventGet.htmlValue;
    }
    /**
     * Text
     * @param {?} text
     * @return {?}
     */
    set text(text) {
        if ((this.preventSet.textCounter != this.preventCounter || this.preventSet.textValue != text)
            && text != this.text) {
            this.handler.format(text, this.entities);
            let /** @type {?} */ range = document.createRange();
            let /** @type {?} */ lastChild = this.element.nativeElement.lastChild;
            while (lastChild.hasChildNodes()) {
                lastChild = lastChild.lastChild;
            }
            range.setStart(lastChild, lastChild.textContent.length);
            this.lastSelectionRange = range;
            this.preventSet.textValue = text;
            this.preventSet.textCounter = this.preventCounter;
        }
    }
    /**
     * @return {?}
     */
    get text() {
        if (this.preventGet.textCounter != this.preventCounter) {
            this.preventGet.textValue = this.handler.getText();
            this.preventGet.textCounter = this.preventCounter;
        }
        return this.preventGet.textValue;
    }
    /**
     * Entities
     * @param {?} entities
     * @return {?}
     */
    set entities(entities) {
        let /** @type {?} */ entitiesJson = JSON.stringify(entities);
        if ((this.preventSet.entitiesCounter != this.preventCounter || this.preventSet.entitiesStringValue != entitiesJson)
            && entitiesJson != JSON.stringify(this.entities)) {
            this.handler.format(this.text, entities);
            this.preventSet.entitiesStringValue = JSON.stringify(entities);
            this.preventSet.entitiesCounter = this.preventCounter;
        }
    }
    /**
     * @return {?}
     */
    get entities() {
        if (this.preventGet.entitiesCounter != this.preventCounter) {
            this.preventGet.entitiesValue = this.handler.getEntities();
            this.preventGet.entitiesCounter = this.preventCounter;
        }
        return this.preventGet.entitiesValue;
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
            this.formatter.insertNewLine();
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
            this.formatter.insertNewLine();
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
        else {
            this.formatter.insertNewLine();
        }
    }
    /**
     * @return {?}
     */
    emitEnter() {
        this.textChange.emit(this.text);
        this.entitiesChange.emit(this.entities);
        this.fullHtmlChange.emit(this.fullHtml);
        this.htmlChange.emit(this.html);
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
        //if (document.onselectionchange === undefined) {
        //}
        let /** @type {?} */ range = window.getSelection().getRangeAt(0);
        if (this.element.nativeElement.contains(range.startContainer)
            && this.element.nativeElement.contains(range.endContainer)) {
            this.lastSelectionRange = range;
        }
    }
    /**
     * @return {?}
     */
    onSelectionChange() {
        let /** @type {?} */ selection = window.getSelection();
        if (selection.containsNode(this.element.nativeElement, true)) {
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
        html = html.split('\n').map(function (line, index) {
            return (index > 0) ? '<div>' + line + '</div>' : line;
        }).join('');
        html = NgxEmojiUtils.filterHtml(html, this.handler.allowedTags.concat(['div']));
        html = NgxEmojiHelper.replaceSymbolsToEmojis(html);
        this.element.execCommand('insertHTML', html);
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
        div.innerHTML = this.handler.getMarkupHtml(div)
            .split('\n')
            .map(function (value) {
            return '<div>' + value + '</div>';
        })
            .join('\n');
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        let /** @type {?} */ range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        let /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.element.execCommand('copy');
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
        this.element.execCommand('delete');
    }
    /**
     * Click events
     * @param {?} event
     * @return {?}
     */
    onClick(event) {
        if (this.contenteditable && NgxEmojiHelper.isEmojiNode(event.toElement)) {
            let /** @type {?} */ range = document.createRange();
            range.setStartBefore(event.toElement);
            let /** @type {?} */ selection = window.getSelection();
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
     * @return {?}
     */
    onElementModified() {
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
        this.formatter.insertEmoji(emoji);
        this.emojiService.recentPush(emoji);
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
    "placeholder": [{ type: Input, args: ['placeholder',] },],
    "inputPicker": [{ type: Input, args: ['picker',] },],
    "attrContenteditable": [{ type: Input, args: ['attr.contenteditable',] },],
    "contenteditable": [{ type: Input, args: ['contenteditable',] },],
    "contenteditableChange": [{ type: Output, args: ['contenteditableChange',] },],
    "enterOn": [{ type: Input, args: ['enterOn',] },],
    "enterOnChange": [{ type: Output, args: ['enterOnChange',] },],
    "fullHtml": [{ type: Input, args: ['fullHtml',] },],
    "fullHtmlChange": [{ type: Output, args: ['fullHtmlChange',] },],
    "html": [{ type: Input, args: ['html',] },],
    "htmlChange": [{ type: Output, args: ['htmlChange',] },],
    "text": [{ type: Input, args: ['text',] },],
    "textChange": [{ type: Output, args: ['textChange',] },],
    "entities": [{ type: Input, args: ['entities',] },],
    "entitiesChange": [{ type: Output, args: ['entitiesChange',] },],
    "onEnter": [{ type: Output, args: ['enter',] },],
    "onKeydownEnter": [{ type: HostListener, args: ["keydown.enter", ['$event'],] },],
    "onKeydownControlEnter": [{ type: HostListener, args: ["keydown.control.enter", ['$event'],] },],
    "onKeydownShiftEnter": [{ type: HostListener, args: ["keydown.shift.enter", ['$event'],] },],
    "onCommand": [{ type: Output, args: ['command',] },],
    "onLink": [{ type: Output, args: ['link',] },],
    "onKeydown": [{ type: HostListener, args: ["keydown", ['$event'],] },],
    "onFocus": [{ type: HostListener, args: ["focus",] },],
    "onFocusout": [{ type: HostListener, args: ["focusout",] },],
    "onPaste": [{ type: HostListener, args: ["paste", ['$event'],] },],
    "onCopy": [{ type: HostListener, args: ["copy", ['$event'],] },],
    "onCut": [{ type: HostListener, args: ["cut", ['$event'],] },],
    "onClick": [{ type: HostListener, args: ["click", ['$event'],] },],
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
     * @param {?} elRef
     * @param {?} emojiService
     */
    constructor(elRef, emojiService) {
        this.emojiService = emojiService;
        this.categories = {
            Recent: [],
            "Smileys & People": null,
            "Animals & Nature": null,
            "Food & Drink": null,
            Objects: null,
            "Travel & Places": null,
            Activities: null,
            Symbols: null,
            Flags: null
        };
        this.currentCategory = 'Recent';
        this.nativeElement = elRef.nativeElement;
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
    /**
     * @param {?} category
     * @return {?}
     */
    selectCategory(category) {
        this.currentCategory = category;
    }
    /**
     * @param {?} category
     * @return {?}
     */
    loadCategory(category) {
        let /** @type {?} */ emojis = NgxEmojiService.getEmojis().filter(function (emoji) {
            return emoji.category == category;
        });
        for (let /** @type {?} */ emoji of emojis) {
            NgxEmojiService.loadEmoji(emoji.unified);
        }
        this.categories[category] = emojis;
    }
    /**
     * @return {?}
     */
    getEmojis() {
        let /** @type {?} */ category = this.currentCategory;
        if (category == 'Recent') {
            let /** @type {?} */ recent = [];
            for (let /** @type {?} */ emoji of this.emojiService.getRecent()) {
                for (let /** @type {?} */ e of NgxEmojiService.getEmojis()) {
                    if (e.unified == emoji) {
                        recent.push(e);
                        NgxEmojiService.loadEmoji(e.unified);
                        break;
                    }
                }
            }
            return recent;
        }
        else {
            if (this.categories[category] == null) {
                this.loadCategory(category);
            }
            return this.categories[category];
        }
    }
    /**
     * @return {?}
     */
    getCategories() {
        return Object.keys(this.categories).map(function (value) {
            return {
                name: value,
                class: 'ngx-emoji-cat-' + value
                    .replace('&', '')
                    .replace('  ', ' ')
                    .replace(' ', '-')
                    .toLowerCase()
            };
        });
    }
}
NgxEmojiPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji-picker',
                template: `<div>
  <i *ngFor="let emoji of getEmojis()"
     [class]="'ngx-emoji ngx-emoji-' + emoji.unified"
     aria-hidden="true"
     (click)="emojiPicked(emoji.unified)"
  ></i>
</div>
<hr>
<i *ngFor="let category of getCategories()"
     [class]="'ngx-emoji-cat ' + category.class"
     aria-hidden="true"
     (click)="selectCategory(category.name)"
></i>
`
            },] },
];
/** @nocollapse */
NgxEmojiPickerComponent.ctorParameters = () => [
    { type: ElementRef, },
    { type: NgxEmojiService, },
];
NgxEmojiPickerComponent.propDecorators = {
    "inputFor": [{ type: Input, args: ['for',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiWithPickerComponent {
    /**
     * @param {?} elRef
     */
    constructor(elRef) {
        this.elRef = elRef;
        this.showPicker = false;
    }
    /**
     * @return {?}
     */
    togglePicker() {
        this.showPicker = !this.showPicker;
    }
    /**
     * @param {?} picker
     * @return {?}
     */
    set pickerComponent(picker) {
        if (!picker) {
            return;
        }
        let /** @type {?} */ component = this;
        picker.nativeElement.addEventListener('mouseleave', function () {
            let /** @type {?} */ timeout = window.setTimeout(function () {
                component.showPicker = false;
            }, 1000);
            picker.nativeElement.addEventListener('mouseenter', function () {
                window.clearTimeout(timeout);
            }, { once: true });
        });
    }
    /**
     * @param {?} value
     * @return {?}
     */
    set placeholder(value) {
        this.emojiComponent.placeholder = value;
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set attrContenteditable(editable) {
        this.emojiComponent.contenteditable = editable;
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set contenteditable(editable) {
        this.emojiComponent.contenteditable = editable;
    }
    /**
     * @return {?}
     */
    get contenteditable() {
        return this.emojiComponent.contenteditable;
    }
    /**
     * @return {?}
     */
    get contenteditableChange() {
        return this.emojiComponent.contenteditableChange;
    }
    /**
     * @param {?} enterOn
     * @return {?}
     */
    set enterOn(enterOn) {
        this.emojiComponent.enterOn = enterOn;
    }
    /**
     * @return {?}
     */
    get enterOn() {
        return this.emojiComponent.enterOn;
    }
    /**
     * @return {?}
     */
    get enterOnChange() {
        return this.emojiComponent.enterOnChange;
    }
    /**
     * @param {?} html
     * @return {?}
     */
    set fullHtml(html) {
        this.emojiComponent.fullHtml = html;
    }
    /**
     * @return {?}
     */
    get fullHtml() {
        return this.emojiComponent.fullHtml;
    }
    /**
     * @return {?}
     */
    get fullHtmlChange() {
        return this.emojiComponent.fullHtmlChange;
    }
    /**
     * @param {?} html
     * @return {?}
     */
    set html(html) {
        this.emojiComponent.html = html;
    }
    /**
     * @return {?}
     */
    get html() {
        return this.emojiComponent.html;
    }
    /**
     * @return {?}
     */
    get htmlChange() {
        return this.emojiComponent.htmlChange;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    set text(text) {
        this.emojiComponent.text = text;
    }
    /**
     * @return {?}
     */
    get text() {
        return this.emojiComponent.text;
    }
    /**
     * @return {?}
     */
    get textChange() {
        return this.emojiComponent.textChange;
    }
    /**
     * @param {?} entities
     * @return {?}
     */
    set entities(entities) {
        this.emojiComponent.entities = entities;
    }
    /**
     * @return {?}
     */
    get entities() {
        return this.emojiComponent.entities;
    }
    /**
     * @return {?}
     */
    get entitiesChange() {
        return this.emojiComponent.entitiesChange;
    }
    /**
     * @return {?}
     */
    get onEnter() {
        return this.emojiComponent.onEnter;
    }
    /**
     * @return {?}
     */
    get onCommand() {
        return this.emojiComponent.onCommand;
    }
    /**
     * @return {?}
     */
    get onLink() {
        return this.emojiComponent.onLink;
    }
}
NgxEmojiWithPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji-with-picker',
                template: `<ngx-emoji-picker *ngIf="showPicker" [for]="emoji" #picker></ngx-emoji-picker>
<ngx-emoji #emoji></ngx-emoji>
<img *ngIf="emoji.contenteditable"
     aria-hidden="true"
     src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
     alt="Emoji picker"
     [class]="showPicker ? 'ngx-emoji-cat-smileys-people' : 'ngx-emoji-cat-smileys-people-inactive'"
     (click)="togglePicker()">
`
            },] },
];
/** @nocollapse */
NgxEmojiWithPickerComponent.ctorParameters = () => [
    { type: ElementRef, },
];
NgxEmojiWithPickerComponent.propDecorators = {
    "emojiComponent": [{ type: ViewChild, args: ['emoji',] },],
    "pickerComponent": [{ type: ViewChild, args: ['picker',] },],
    "placeholder": [{ type: Input, args: ['placeholder',] },],
    "attrContenteditable": [{ type: Input, args: ['attr.contenteditable',] },],
    "contenteditable": [{ type: Input, args: ['contenteditable',] },],
    "contenteditableChange": [{ type: Output, args: ['contenteditableChange',] },],
    "enterOn": [{ type: Input, args: ['enterOn',] },],
    "enterOnChange": [{ type: Output, args: ['enterOnChange',] },],
    "fullHtml": [{ type: Input, args: ['fullHtml',] },],
    "fullHtmlChange": [{ type: Output, args: ['fullHtmlChange',] },],
    "html": [{ type: Input, args: ['html',] },],
    "htmlChange": [{ type: Output, args: ['htmlChange',] },],
    "text": [{ type: Input, args: ['text',] },],
    "textChange": [{ type: Output, args: ['textChange',] },],
    "entities": [{ type: Input, args: ['entities',] },],
    "entitiesChange": [{ type: Output, args: ['entitiesChange',] },],
    "onEnter": [{ type: Output, args: ['enter',] },],
    "onCommand": [{ type: Output, args: ['command',] },],
    "onLink": [{ type: Output, args: ['link',] },],
};

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxEmojiModule {
    /**
     * @param {?} path
     * @return {?}
     */
    static setEmojiBundlesPath(path) {
        NgxEmojiModule.emojiBundlesPath = path;
    }
    /**
     * @return {?}
     */
    static getEmojiBundlesPath() {
        return NgxEmojiModule.emojiBundlesPath;
    }
    /**
     * @param {?} max
     * @return {?}
     */
    static setRecentMax(max) {
        NgxEmojiModule.recentMax = max;
    }
    /**
     * @return {?}
     */
    static getRecentMax() {
        return NgxEmojiModule.recentMax;
    }
}
NgxEmojiModule.emojiBundlesPath = 'https://cdn.rawgit.com/arswarog/ngx-emoji/build/ngx-emoji-assets/';
NgxEmojiModule.recentMax = 20;
NgxEmojiModule.decorators = [
    { type: NgModule, args: [{
                imports: [
                    CommonModule
                ],
                declarations: [
                    NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiWithPickerComponent
                ],
                providers: [
                    NgxEmojiService
                ],
                exports: [
                    NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiWithPickerComponent
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

export { NgxEmojiModule, NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiEntityType, NgxEmojiWithPickerComponent, NgxEmojiService };
//# sourceMappingURL=ngx-emoji.js.map

var __values = (this && this.__values) || function (o) {
    var m = typeof Symbol === "function" && o[Symbol.iterator], i = 0;
    if (m) return m.call(o);
    return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
};
import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
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
var NgxEmojiService = /** @class */ (function () {
    function NgxEmojiService() {
        this.onEmojiPicked = new Subject$1();
    }
    /**
     * @return {?}
     */
    NgxEmojiService.getEmojis = function () {
        if (this.emojis === null) {
            this.emojis = require('ngx-emoji/emojis.json');
        }
        return this.emojis;
    };
    /**
     * @param {?} component
     * @return {?}
     */
    NgxEmojiService.prototype.setActiveComponent = function (component) {
        this.activeComponent = component;
    };
    /**
     * @param {?} component
     * @return {?}
     */
    NgxEmojiService.prototype.isActiveComponent = function (component) {
        return component === this.activeComponent;
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiService.loadEmoji = function (emoji) {
        var /** @type {?} */ bundleId = this.getEmojiBundle(emoji);
        if (bundleId !== null && !this.isCssBundleLoaded(bundleId)) {
            this.loadCssBundle(bundleId);
        }
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiService.getEmojiBundle = function (emoji) {
        try {
            for (var _a = __values(NgxEmojiService.getEmojis()), _b = _a.next(); !_b.done; _b = _a.next()) {
                var e = _b.value;
                if (e.unified == emoji) {
                    return e.bundle;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return null;
        var e_1, _c;
    };
    /**
     * @param {?} bundleId
     * @return {?}
     */
    NgxEmojiService.loadCssBundle = function (bundleId) {
        if (!this.isCssBundleLoaded(bundleId)) {
            var /** @type {?} */ id = 'ngx-emoji-bundle-' + bundleId;
            var /** @type {?} */ head = document.getElementsByTagName('head')[0];
            var /** @type {?} */ link = document.createElement('link');
            link.id = id;
            link.rel = 'stylesheet';
            link.type = 'text/css';
            link.href = NgxEmojiModule.getEmojiBundlesPath() + 'ngx-emoji-b' + bundleId + '.min.css';
            link.media = 'all';
            head.appendChild(link);
        }
    };
    /**
     * @param {?} bundleId
     * @return {?}
     */
    NgxEmojiService.isCssBundleLoaded = function (bundleId) {
        return (document.getElementById('ngx-emoji-bundle-' + bundleId)) ? true : false;
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiService.prototype.recentPush = function (emoji) {
        var /** @type {?} */ recent = this.getRecent();
        if (recent.indexOf(emoji) > -1) {
            return;
        }
        recent = [emoji].concat(recent)
            .slice(0, NgxEmojiModule.getRecentMax());
        window.localStorage.setItem('ngx-emoji-recent', recent.join(':'));
    };
    /**
     * @return {?}
     */
    NgxEmojiService.prototype.getRecent = function () {
        var /** @type {?} */ recent = window.localStorage.getItem('ngx-emoji-recent');
        if (!recent) {
            return [];
        }
        return recent.split(':');
    };
    return NgxEmojiService;
}());
NgxEmojiService.emojis = null;
NgxEmojiService.decorators = [
    { type: Injectable },
];
/** @nocollapse */
NgxEmojiService.ctorParameters = function () { return []; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiUtils = /** @class */ (function () {
    function NgxEmojiUtils() {
    }
    /**
     * @template T
     * @param {?} list
     * @return {?}
     */
    NgxEmojiUtils.arrayOfNodeList = function (list) {
        var /** @type {?} */ result = [];
        for (var /** @type {?} */ i = 0; i < list.length; i++) {
            result.push(list.item(i));
        }
        return result;
    };
    ;
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiUtils.isBlockNode = function (node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        if (node instanceof HTMLDivElement) {
            return true;
        }
        return window.getComputedStyle(node, '').display == 'block';
    };
    /**
     * String replace all implementation
     *
     * See: https://stackoverflow.com/a/1144788/1617101
     * @param {?} str
     * @param {?} find
     * @param {?} replace
     * @return {?}
     */
    NgxEmojiUtils.replaceAll = function (str, find, replace) {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    };
    /**
     * @param {?} html
     * @param {?=} allowTags
     * @param {?=} withCommands
     * @return {?}
     */
    NgxEmojiUtils.filterHtml = function (html, allowTags, withCommands) {
        if (allowTags === void 0) { allowTags = []; }
        if (withCommands === void 0) { withCommands = false; }
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        var /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        var /** @type {?} */ rf = function (nodes) {
            try {
                for (var _a = __values(NgxEmojiUtils.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    if (node.nodeType == node.ELEMENT_NODE) {
                        if (allowTags.indexOf(node.nodeName) > -1
                            || withCommands && ((node)).classList.contains('command')) {
                            if (node instanceof HTMLAnchorElement) {
                                html += '<' + node.nodeName.toLowerCase() + ' href="' + node.getAttribute('href') + '">';
                            }
                            else if (withCommands && ((node)).classList.contains('command')) {
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
            }
            catch (e_2_1) { e_2 = { error: e_2_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_2) throw e_2.error; }
            }
            var e_2, _c;
        };
        rf(tmp.childNodes);
        tmp.remove();
        return html;
    };
    return NgxEmojiUtils;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiHelper = /** @class */ (function () {
    function NgxEmojiHelper() {
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiHelper.createEmojiImg = function (emoji) {
        NgxEmojiService.loadEmoji(emoji);
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiHelper.emojiToSymbol = function (emoji) {
        emoji = emoji.trim();
        if (emoji.length == 0) {
            return '�';
        }
        var /** @type {?} */ emojiCodes = emoji.split('-').map(function (value) {
            return parseInt('0x' + value, 16);
        });
        try {
            emoji = String.fromCodePoint.apply(String, emojiCodes);
        }
        catch (error) {
            console.warn('Convert emoji ' + emoji + ' error: ' + error.message);
            emoji = '�';
        }
        return emoji;
    };
    /**
     * For debug...
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiHelper.dumpEmoji = function (emoji) {
        var /** @type {?} */ s = [];
        var /** @type {?} */ s2 = [];
        for (var /** @type {?} */ i = 0; i < emoji.length; i++) {
            s.push(emoji.codePointAt(i).toString(16).toUpperCase());
            s2.push(emoji.charCodeAt(i).toString(16).toUpperCase());
        }
        console.log(emoji, s, s2);
    };
    /**
     * @param {?} symbol
     * @return {?}
     */
    NgxEmojiHelper.emojiFromSymbol = function (symbol) {
        var /** @type {?} */ codes = [];
        for (var /** @type {?} */ i = 0; i < symbol.length; i++) {
            codes.push(symbol.codePointAt(i).toString(16));
        }
        codes = codes
            .filter(function (code) {
            var /** @type {?} */ p = parseInt(code, 16);
            return !(p >= 0xD800 && p <= 0xDFFF);
        })
            .map(function (code) {
            var /** @type {?} */ pad = '0000';
            return pad.substring(0, pad.length - code.length) + code;
        });
        return codes.join('-').toUpperCase();
    };
    /**
     * @param {?} text
     * @return {?}
     */
    NgxEmojiHelper.replaceSymbolsToEmojis = function (text) {
        text = text.replace(this.getEmojiRegex(), function (match) {
            return NgxEmojiHelper.createEmojiImg(NgxEmojiHelper.emojiFromSymbol(match));
        });
        text = NgxEmojiUtils.replaceAll(text, '\uFE0F', ''); // remove variation selector
        return text;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiHelper.isEmojiNode = function (node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiHelper.emojiFromNode = function (node) {
        if (!this.isEmojiNode(node)) {
            return null;
        }
        var /** @type {?} */ classList = ((node)).classList;
        var /** @type {?} */ emoji = null;
        for (var /** @type {?} */ i = 0; i < classList.length; i++) {
            if (classList.item(i).substr(0, 10) == 'ngx-emoji-') {
                emoji = classList.item(i).substr(10);
                break;
            }
        }
        return emoji;
    };
    /**
     * See: https://habrahabr.ru/company/badoo/blog/282113/
     * @return {?}
     */
    NgxEmojiHelper.getEmojiRegex = function () {
        var /** @type {?} */ emojiRanges = [
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
    };
    return NgxEmojiHelper;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiElement = /** @class */ (function () {
    /**
     * @param {?} nativeElement
     */
    function NgxEmojiElement(nativeElement) {
        this.nativeElement = nativeElement;
        this.onModified = new EventEmitter();
        var /** @type {?} */ onModified = this.onModified;
        nativeElement.addEventListener('DOMSubtreeModified', function (event) {
            onModified.emit(/** @type {?} */ (event));
        });
    }
    Object.defineProperty(NgxEmojiElement.prototype, "contentEditable", {
        /**
         * @return {?}
         */
        get: function () {
            return this.nativeElement.getAttribute('contenteditable') == 'true';
        },
        /**
         * @param {?} editable
         * @return {?}
         */
        set: function (editable) {
            if (editable != this.contentEditable) {
                this.nativeElement.setAttribute('contenteditable', editable ? 'true' : 'false');
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} command
     * @param {?=} value
     * @return {?}
     */
    NgxEmojiElement.prototype.execCommand = function (command, value) {
        var /** @type {?} */ editable = this.contentEditable;
        this.contentEditable = true;
        var /** @type {?} */ result = false;
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
    };
    /**
     * @param {?} tag
     * @param {?=} attributes
     * @return {?}
     */
    NgxEmojiElement.prototype.execCommandTag = function (tag, attributes) {
        if (attributes === void 0) { attributes = []; }
        this.execCommand('superscript');
        var /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = this.nativeElement.innerHTML;
        var /** @type {?} */ html = '';
        var /** @type {?} */ rf = function (nodes) {
            try {
                for (var _a = __values(NgxEmojiUtils.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    if (node.nodeType == node.ELEMENT_NODE) {
                        var /** @type {?} */ nodeName = node.nodeName.toLowerCase();
                        if (nodeName == 'sup') {
                            nodeName = tag;
                            html += '<' + tag;
                            try {
                                for (var attributes_1 = __values(attributes), attributes_1_1 = attributes_1.next(); !attributes_1_1.done; attributes_1_1 = attributes_1.next()) {
                                    var attr = attributes_1_1.value;
                                    html += ' ' + attr.name + '="' + attr.value + '"';
                                }
                            }
                            catch (e_3_1) { e_3 = { error: e_3_1 }; }
                            finally {
                                try {
                                    if (attributes_1_1 && !attributes_1_1.done && (_c = attributes_1.return)) _c.call(attributes_1);
                                }
                                finally { if (e_3) throw e_3.error; }
                            }
                            html += '>';
                        }
                        else {
                            html += '<' + nodeName;
                            for (var /** @type {?} */ i = 0; i < node.attributes.length; i++) {
                                var /** @type {?} */ attr = node.attributes.item(i);
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
            }
            catch (e_4_1) { e_4 = { error: e_4_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_d = _a.return)) _d.call(_a);
                }
                finally { if (e_4) throw e_4.error; }
            }
            var e_4, _d, e_3, _c;
        };
        rf(tmp.childNodes);
        tmp.remove();
        this.nativeElement.innerHTML = html;
        return true;
    };
    return NgxEmojiElement;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiFormatter = /** @class */ (function () {
    /**
     * @param {?} element
     */
    function NgxEmojiFormatter(element) {
        this.element = element;
    }
    /**
     * @param {?} type
     * @param {?=} value
     * @return {?}
     */
    NgxEmojiFormatter.prototype.formatText = function (type, value) {
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
    };
    /**
     * @return {?}
     */
    NgxEmojiFormatter.prototype.insertNewLine = function () {
        this.element.execCommand('insertParagraph');
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiFormatter.prototype.insertEmoji = function (emoji) {
        this.element.execCommand('insertHTML', NgxEmojiHelper.createEmojiImg(emoji));
    };
    return NgxEmojiFormatter;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiHandler = /** @class */ (function () {
    /**
     * @param {?} element
     * @param {?} formatter
     */
    function NgxEmojiHandler(element, formatter) {
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
    NgxEmojiHandler.prototype.format = function (text, entities) {
        var /** @type {?} */ handler = this;
        var /** @type {?} */ nativeElement = this.element.nativeElement;
        var /** @type {?} */ selection = window.getSelection();
        var /** @type {?} */ previousRange = (selection.rangeCount) ? selection.getRangeAt(0) : null;
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
        var /** @type {?} */ paragraphs = text.split('\n');
        text = '';
        try {
            for (var paragraphs_1 = __values(paragraphs), paragraphs_1_1 = paragraphs_1.next(); !paragraphs_1_1.done; paragraphs_1_1 = paragraphs_1.next()) {
                var paragraph = paragraphs_1_1.value;
                if (paragraph.length == 0) {
                    paragraph = '<br>';
                }
                if (paragraph == ' ') {
                    paragraph = '&nbsp;';
                }
                text += '<div>' + paragraph + '</div>';
            }
        }
        catch (e_5_1) { e_5 = { error: e_5_1 }; }
        finally {
            try {
                if (paragraphs_1_1 && !paragraphs_1_1.done && (_a = paragraphs_1.return)) _a.call(paragraphs_1);
            }
            finally { if (e_5) throw e_5.error; }
        }
        this.element.nativeElement.innerHTML = text;
        if (this.element.nativeElement.childNodes.length == 0) {
            this.element.nativeElement.appendChild(document.createTextNode(''));
        }
        /* set entities */
        var /** @type {?} */ endFounded = false;
        var _loop_1 = function (entity) {
            var /** @type {?} */ range = document.createRange();
            var /** @type {?} */ offset = 0;
            var /** @type {?} */ rf = function (nodes) {
                for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
                    var /** @type {?} */ node = nodes.item(i);
                    if (NgxEmojiHelper.isEmojiNode(node)) {
                        var /** @type {?} */ textLength = NgxEmojiHelper.emojiToSymbol(NgxEmojiHelper.emojiFromNode(node)).length;
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
                            var /** @type {?} */ textLength = node.textContent.length;
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
                    this_1.formatter.formatText(NgxEmojiEntityType.TextLink, entity.url);
                    break;
                case NgxEmojiEntityType.Url:
                    this_1.formatter.formatText(NgxEmojiEntityType.Url, range.cloneContents().textContent);
                    break;
                default:
                    this_1.formatter.formatText(/** @type {?} */ (entity.type));
                    break;
            }
        };
        var this_1 = this;
        try {
            for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                var entity = entities_1_1.value;
                _loop_1(/** @type {?} */ entity);
            }
        }
        catch (e_6_1) { e_6 = { error: e_6_1 }; }
        finally {
            try {
                if (entities_1_1 && !entities_1_1.done && (_b = entities_1.return)) _b.call(entities_1);
            }
            finally { if (e_6) throw e_6.error; }
        }
        selection.removeAllRanges();
        if (previousRange) {
            selection.addRange(previousRange);
        }
        var e_5, _a, e_6, _b;
    };
    /**
     * @return {?}
     */
    NgxEmojiHandler.prototype.getEntities = function () {
        var /** @type {?} */ entities = [];
        var /** @type {?} */ rf = function (nodes, offset) {
            try {
                for (var _a = __values(NgxEmojiUtils.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    if (node.textContent.trim().length > 0) {
                        var /** @type {?} */ nodeName = node.nodeName.toUpperCase();
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
            }
            catch (e_7_1) { e_7 = { error: e_7_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_7) throw e_7.error; }
            }
            var e_7, _c;
        };
        var /** @type {?} */ div = document.createElement('div');
        div.innerHTML = this.getMarkupHtml(this.element.nativeElement, true);
        rf(div.childNodes, 0);
        div.remove();
        entities = entities.map(function (entity) {
            if (entity.type == NgxEmojiEntityType.TextLink) {
                entity.type = 'text_link';
            }
            else {
                entity.type = NgxEmojiEntityType[(entity.type)].toLowerCase();
            }
            return entity;
        });
        return entities;
    };
    /**
     * @return {?}
     */
    NgxEmojiHandler.prototype.getText = function () {
        return NgxEmojiUtils.filterHtml(this.getMarkupHtml());
    };
    /**
     * @return {?}
     */
    NgxEmojiHandler.prototype.getFullHtml = function () {
        var /** @type {?} */ html = document.createElement('div');
        html.innerHTML = this.element.nativeElement.innerHTML;
        try {
            for (var _a = __values(NgxEmojiUtils.arrayOfNodeList(html.getElementsByTagName('img'))), _b = _a.next(); !_b.done; _b = _a.next()) {
                var img = _b.value;
                if (!img.classList.contains('ngx-emoji')) {
                    continue;
                }
                var /** @type {?} */ emoji = document.createElement('i');
                emoji.className = img.className;
                emoji.setAttribute('aria-hidden', 'true');
                img.parentElement.insertBefore(emoji, img);
                img.remove();
            }
        }
        catch (e_8_1) { e_8 = { error: e_8_1 }; }
        finally {
            try {
                if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
            }
            finally { if (e_8) throw e_8.error; }
        }
        var /** @type {?} */ result = html.innerHTML;
        html.remove();
        return result;
        var e_8, _c;
    };
    /**
     * @param {?=} rootElement
     * @param {?=} withCommands
     * @return {?}
     */
    NgxEmojiHandler.prototype.getMarkupHtml = function (rootElement, withCommands) {
        if (rootElement === void 0) { rootElement = null; }
        if (withCommands === void 0) { withCommands = false; }
        if (!rootElement) {
            rootElement = this.element.nativeElement;
        }
        var /** @type {?} */ html = '';
        var /** @type {?} */ rf = function (nodes) {
            try {
                for (var _a = __values(NgxEmojiUtils.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    var /** @type {?} */ blockNode = NgxEmojiUtils.isBlockNode(node);
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
                            else if (((node)).classList.contains('command')) {
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
                        && ((node)).nextElementSibling
                        && NgxEmojiUtils.isBlockNode(((node)).nextElementSibling)
                        && node.nextSibling.textContent.length == 0) {
                        html += '\n';
                    }
                }
            }
            catch (e_9_1) { e_9 = { error: e_9_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_9) throw e_9.error; }
            }
            var e_9, _c;
        };
        rf(rootElement.childNodes);
        html = NgxEmojiUtils.replaceAll(html, '\u00A0', ' ');
        html = NgxEmojiUtils.replaceAll(html, '&nbsp;', ' ');
        return NgxEmojiUtils.filterHtml(html, this.allowedTags, withCommands);
    };
    /**
     * @param {?} html
     * @return {?}
     */
    NgxEmojiHandler.prototype.setFullHtml = function (html) {
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags);
    };
    /**
     * @param {?} html
     * @return {?}
     */
    NgxEmojiHandler.prototype.setMarkupHtml = function (html) {
        html = html.split('\n').map(function (line, index) {
            return (index > 0) ? '<div>' + line + '</div>' : line;
        }).join('');
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags.concat('div'));
    };
    /**
     * @param {?} type
     * @return {?}
     */
    NgxEmojiHandler.prototype.normalizeEntityType = function (type) {
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
    };
    /**
     * @return {?}
     */
    NgxEmojiHandler.prototype.findCommands = function () {
        var /** @type {?} */ selection = window.getSelection();
        if (selection.anchorNode) {
            var /** @type {?} */ node = selection.anchorNode;
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
                var /** @type {?} */ regex = /(^|\s)(\/[a-z0-9]+)($|\s)/ig;
                var /** @type {?} */ match = void 0;
                while ((match = regex.exec(node.textContent)) !== null) {
                    var /** @type {?} */ offset = match.index;
                    if (match[0].charAt(0) == ' ') {
                        offset++;
                    }
                    var /** @type {?} */ length = match[2].length;
                    if (match[2].charAt(length - 1) == ' ') {
                        length--;
                    }
                    regex.lastIndex = regex.lastIndex - (match[0].length - match[2].length);
                    var /** @type {?} */ node2 = document.createTextNode(node.textContent.substr(0, offset));
                    node.textContent = node.textContent.substr(offset + length);
                    node.parentNode.insertBefore(node2, node);
                    var /** @type {?} */ span = document.createElement('span');
                    span.classList.add('command');
                    span.textContent = match[2].trim();
                    node.parentNode.insertBefore(span, node);
                }
            }
        }
    };
    /**
     * @return {?}
     */
    NgxEmojiHandler.prototype.findLinks = function () {
        //
    };
    return NgxEmojiHandler;
}());
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
/**
 * @record
 */
/** @enum {number} */
var NgxEmojiEntityType = {
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
var NgxEmojiComponentPrevent = /** @class */ (function () {
    function NgxEmojiComponentPrevent() {
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
    return NgxEmojiComponentPrevent;
}());
var NgxEmojiComponent = /** @class */ (function () {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    function NgxEmojiComponent(elRef, globalEmojiService) {
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
        var /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        var /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            if (globalEmojiService.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
        this.element = new NgxEmojiElement(elRef.nativeElement);
        this.element.nativeElement.appendChild(document.createTextNode(''));
        this.formatter = new NgxEmojiFormatter(this.element);
        this.handler = new NgxEmojiHandler(this.element, this.formatter);
        var /** @type {?} */ range = document.createRange();
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
    Object.defineProperty(NgxEmojiComponent.prototype, "placeholder", {
        /**
         * @param {?} value
         * @return {?}
         */
        set: function (value) {
            this.element.nativeElement.setAttribute('placeholder', value);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.ngOnDestroy = function () {
        this.emojiServiceSubscription.unsubscribe();
    };
    /**
     * @param {?} service
     * @return {?}
     */
    NgxEmojiComponent.prototype.addEmojiService = function (service) {
        service.setActiveComponent(this);
        var /** @type {?} */ component = this;
        var /** @type {?} */ subscription = service.onEmojiPicked.subscribe(function (emoji) {
            if (service.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "inputPicker", {
        /**
         * Emoji picker
         * @param {?} pickerComponent
         * @return {?}
         */
        set: function (pickerComponent) {
            this.emojiServiceSubscription.unsubscribe();
            this.emojiServiceSubscription = new Subscription$1();
            var /** @type {?} */ service = new NgxEmojiService();
            service.setActiveComponent(this);
            this.emojiService = service;
            pickerComponent.setEmojiService(service);
            var /** @type {?} */ component = this;
            var /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
                if (service.isActiveComponent(component)) {
                    component.insertEmoji(emoji);
                }
            });
            this.emojiServiceSubscription.add(subscription);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "attrContenteditable", {
        /**
         * Content editable
         * @param {?} editable
         * @return {?}
         */
        set: function (editable) {
            this.contenteditable = editable;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "contenteditable", {
        /**
         * @return {?}
         */
        get: function () {
            return this._contenteditable;
        },
        /**
         * @param {?} editable
         * @return {?}
         */
        set: function (editable) {
            this._contenteditable = editable;
            this.element.contentEditable = editable;
            this.contenteditableChange.emit(editable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "enterOn", {
        /**
         * @return {?}
         */
        get: function () {
            return this._enterOn;
        },
        /**
         * Enter on
         * @param {?} enterOn
         * @return {?}
         */
        set: function (enterOn) {
            this._enterOn = enterOn;
            this.enterOnChange.emit(enterOn);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsEnter = function () {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsCtrlEnter = function () {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.ctrl) ? true : false;
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsShiftEnter = function () {
        if (this.onEnter.observers.length == 0) {
            return false;
        }
        return (this.enterOn.shift) ? true : false;
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "fullHtml", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.preventGet.fullHtmlCounter != this.preventCounter) {
                this.preventGet.fullHtmlValue = this.handler.getFullHtml();
                this.preventGet.fullHtmlCounter = this.preventCounter;
            }
            return this.preventGet.fullHtmlValue;
        },
        /**
         * HTML
         * @param {?} html
         * @return {?}
         */
        set: function (html) {
            if ((this.preventSet.htmlValue != html || this.preventSet.htmlCounter != this.preventCounter)
                && html != this.html) {
                this.handler.setFullHtml(html);
                this.preventSet.fullHtmlValue = html;
                this.preventSet.fullHtmlCounter = this.preventCounter;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "html", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.preventGet.htmlCounter != this.preventCounter) {
                this.preventGet.htmlValue = this.handler.getMarkupHtml();
                this.preventGet.htmlCounter = this.preventCounter;
            }
            return this.preventGet.htmlValue;
        },
        /**
         * HTML wihout parahraphs
         * @param {?} html
         * @return {?}
         */
        set: function (html) {
            if ((this.preventSet.htmlCounter != this.preventCounter || this.preventSet.htmlValue != html)
                && html != this.html) {
                this.handler.setMarkupHtml(html);
                this.preventSet.htmlValue = html;
                this.preventSet.htmlCounter = this.preventCounter;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "text", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.preventGet.textCounter != this.preventCounter) {
                this.preventGet.textValue = this.handler.getText();
                this.preventGet.textCounter = this.preventCounter;
            }
            return this.preventGet.textValue;
        },
        /**
         * Text
         * @param {?} text
         * @return {?}
         */
        set: function (text) {
            if ((this.preventSet.textCounter != this.preventCounter || this.preventSet.textValue != text)
                && text != this.text) {
                this.handler.format(text, this.entities);
                var /** @type {?} */ range = document.createRange();
                var /** @type {?} */ lastChild = this.element.nativeElement.lastChild;
                while (lastChild.hasChildNodes()) {
                    lastChild = lastChild.lastChild;
                }
                range.setStart(lastChild, lastChild.textContent.length);
                this.lastSelectionRange = range;
                this.preventSet.textValue = text;
                this.preventSet.textCounter = this.preventCounter;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "entities", {
        /**
         * @return {?}
         */
        get: function () {
            if (this.preventGet.entitiesCounter != this.preventCounter) {
                this.preventGet.entitiesValue = this.handler.getEntities();
                this.preventGet.entitiesCounter = this.preventCounter;
            }
            return this.preventGet.entitiesValue;
        },
        /**
         * Entities
         * @param {?} entities
         * @return {?}
         */
        set: function (entities) {
            var /** @type {?} */ entitiesJson = JSON.stringify(entities);
            if ((this.preventSet.entitiesCounter != this.preventCounter || this.preventSet.entitiesStringValue != entitiesJson)
                && entitiesJson != JSON.stringify(this.entities)) {
                this.handler.format(this.text, entities);
                this.preventSet.entitiesStringValue = JSON.stringify(entities);
                this.preventSet.entitiesCounter = this.preventCounter;
            }
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydownEnter = function (event) {
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydownControlEnter = function (event) {
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydownShiftEnter = function (event) {
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
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.emitEnter = function () {
        this.textChange.emit(this.text);
        this.entitiesChange.emit(this.entities);
        this.fullHtmlChange.emit(this.fullHtml);
        this.htmlChange.emit(this.html);
        this.onEnter.emit();
    };
    /**
     * Keyboard events
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydown = function (event) {
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
    };
    /**
     * Focus events
     * @return {?}
     */
    NgxEmojiComponent.prototype.onFocus = function () {
        this.emojiService.setActiveComponent(this);
    };
    /**
     * Get selection before blur don't work in Firefox.
     * Use hotfix with onSelectionchange()
     * This is fallback
     * @return {?}
     */
    NgxEmojiComponent.prototype.onFocusout = function () {
        //if (document.onselectionchange === undefined) {
        this.lastSelectionRange = window.getSelection().getRangeAt(0);
        //}
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.onSelectionChange = function () {
        var /** @type {?} */ selection = window.getSelection();
        if (selection.containsNode(this.element.nativeElement, true)) {
            this.lastSelectionRange = selection.getRangeAt(0);
        }
    };
    /**
     * Clipboard events
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onPaste = function (event) {
        event.preventDefault();
        var /** @type {?} */ html = '';
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
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onCopy = function (event) {
        var /** @type {?} */ previousRange = window.getSelection().getRangeAt(0);
        if (previousRange.collapsed) {
            return;
        }
        event.preventDefault();
        var /** @type {?} */ content = window.getSelection().getRangeAt(0).cloneContents();
        var /** @type {?} */ div = document.createElement('div');
        div.appendChild(content);
        div.innerHTML = this.handler.getMarkupHtml(div);
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        var /** @type {?} */ range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        var /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.element.execCommand('copy');
        div.remove();
        selection.removeAllRanges();
        selection.addRange(previousRange);
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onCut = function (event) {
        this.onCopy(event);
        this.element.execCommand('delete');
    };
    /**
     * Click events
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onClick = function (event) {
        if (this.contenteditable && NgxEmojiHelper.isEmojiNode(event.toElement)) {
            var /** @type {?} */ range = document.createRange();
            range.setStartBefore(event.toElement);
            var /** @type {?} */ selection = window.getSelection();
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
    };
    /**
     * Internal
     * @return {?}
     */
    NgxEmojiComponent.prototype.onElementModified = function () {
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
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiComponent.prototype.insertEmoji = function (emoji) {
        if (!this.contenteditable) {
            return;
        }
        var /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(this.lastSelectionRange);
        this.formatter.insertEmoji(emoji);
        this.emojiService.recentPush(emoji);
    };
    return NgxEmojiComponent;
}());
NgxEmojiComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji',
                template: ''
            },] },
];
/** @nocollapse */
NgxEmojiComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: NgxEmojiService, },
]; };
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
var NgxEmojiPickerComponent = /** @class */ (function () {
    /**
     * @param {?} emojiService
     */
    function NgxEmojiPickerComponent(emojiService) {
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
    }
    /**
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.ngOnInit = function () {
    };
    /**
     * @param {?} service
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.setEmojiService = function (service) {
        this.emojiService = service;
    };
    Object.defineProperty(NgxEmojiPickerComponent.prototype, "inputFor", {
        /**
         * @param {?} emojiComponent
         * @return {?}
         */
        set: function (emojiComponent) {
            this.emojiService = new NgxEmojiService();
            emojiComponent.addEmojiService(this.emojiService);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.emojiPicked = function (emoji) {
        this.emojiService.onEmojiPicked.next(emoji);
    };
    /**
     * @param {?} category
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.selectCategory = function (category) {
        this.currentCategory = category;
    };
    /**
     * @param {?} category
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.loadCategory = function (category) {
        var /** @type {?} */ emojis = NgxEmojiService.getEmojis().filter(function (emoji) {
            return emoji.category == category;
        });
        try {
            for (var emojis_1 = __values(emojis), emojis_1_1 = emojis_1.next(); !emojis_1_1.done; emojis_1_1 = emojis_1.next()) {
                var emoji = emojis_1_1.value;
                NgxEmojiService.loadEmoji(emoji.unified);
            }
        }
        catch (e_10_1) { e_10 = { error: e_10_1 }; }
        finally {
            try {
                if (emojis_1_1 && !emojis_1_1.done && (_a = emojis_1.return)) _a.call(emojis_1);
            }
            finally { if (e_10) throw e_10.error; }
        }
        this.categories[category] = emojis;
        var e_10, _a;
    };
    /**
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.getEmojis = function () {
        var /** @type {?} */ category = this.currentCategory;
        if (category == 'Recent') {
            var /** @type {?} */ recent = [];
            try {
                for (var _a = __values(this.emojiService.getRecent()), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var emoji = _b.value;
                    try {
                        for (var _c = __values(NgxEmojiService.getEmojis()), _d = _c.next(); !_d.done; _d = _c.next()) {
                            var e = _d.value;
                            if (e.unified == emoji) {
                                recent.push(e);
                                NgxEmojiService.loadEmoji(e.unified);
                                break;
                            }
                        }
                    }
                    catch (e_11_1) { e_11 = { error: e_11_1 }; }
                    finally {
                        try {
                            if (_d && !_d.done && (_e = _c.return)) _e.call(_c);
                        }
                        finally { if (e_11) throw e_11.error; }
                    }
                }
            }
            catch (e_12_1) { e_12 = { error: e_12_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_f = _a.return)) _f.call(_a);
                }
                finally { if (e_12) throw e_12.error; }
            }
            return recent;
        }
        else {
            if (this.categories[category] == null) {
                this.loadCategory(category);
            }
            return this.categories[category];
        }
        var e_12, _f, e_11, _e;
    };
    /**
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.getCategories = function () {
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
    };
    return NgxEmojiPickerComponent;
}());
NgxEmojiPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji-picker',
                template: "<i *ngFor=\"let emoji of getEmojis()\"\n   [class]=\"'ngx-emoji ngx-emoji-' + emoji.unified\"\n   aria-hidden=\"true\"\n   (click)=\"emojiPicked(emoji.unified)\"\n></i>\n<hr>\n<img *ngFor=\"let category of getCategories()\"\n     [class]=\"'ngx-emoji-cat ' + category.class\"\n     aria-hidden=\"true\"\n     src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=\"\n     [alt]=\"category.name\"\n     (click)=\"selectCategory(category.name)\"\n>\n"
            },] },
];
/** @nocollapse */
NgxEmojiPickerComponent.ctorParameters = function () { return [
    { type: NgxEmojiService, },
]; };
NgxEmojiPickerComponent.propDecorators = {
    "inputFor": [{ type: Input, args: ['for',] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiWithPickerComponent = /** @class */ (function () {
    function NgxEmojiWithPickerComponent() {
    }
    return NgxEmojiWithPickerComponent;
}());
NgxEmojiWithPickerComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji-with-picker',
                template: "<ngx-emoji-picker #picker [for]=\"emoji\"></ngx-emoji-picker>\n<ngx-emoji text=\"123\" contenteditable=\"true\" [picker]=\"picker\" #emoji></ngx-emoji>\n"
            },] },
];
//
/** @nocollapse */
NgxEmojiWithPickerComponent.ctorParameters = function () { return []; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiModule = /** @class */ (function () {
    function NgxEmojiModule() {
    }
    /**
     * @param {?} path
     * @return {?}
     */
    NgxEmojiModule.setEmojiBundlesPath = function (path) {
        NgxEmojiModule.emojiBundlesPath = path;
    };
    /**
     * @return {?}
     */
    NgxEmojiModule.getEmojiBundlesPath = function () {
        return NgxEmojiModule.emojiBundlesPath;
    };
    /**
     * @param {?} max
     * @return {?}
     */
    NgxEmojiModule.setRecentMax = function (max) {
        NgxEmojiModule.recentMax = max;
    };
    /**
     * @return {?}
     */
    NgxEmojiModule.getRecentMax = function () {
        return NgxEmojiModule.recentMax;
    };
    return NgxEmojiModule;
}());
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
NgxEmojiModule.ctorParameters = function () { return []; };
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

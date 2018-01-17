(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('@angular/common'), require('rxjs/Subject'), require('rxjs/Subscription'), require('util'), require('ngx-emoji/ngx-emoji.min.css'), require('ngx-emoji/emojis.min.css')) :
	typeof define === 'function' && define.amd ? define(['exports', '@angular/core', '@angular/common', 'rxjs/Subject', 'rxjs/Subscription', 'util', 'ngx-emoji/ngx-emoji.min.css', 'ngx-emoji/emojis.min.css'], factory) :
	(factory((global['ngx-emoji'] = {}),global.ng.core,global.ng.common,global.Rx,global.Rx,global.builtins));
}(this, (function (exports,core,common,Subject,Subscription,util) { 'use strict';

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
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiService = /** @class */ (function () {
    function NgxEmojiService() {
        this.onEmojiPicked = new Subject.Subject();
    }
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
    return NgxEmojiService;
}());
NgxEmojiService.decorators = [
    { type: core.Injectable },
];
/** @nocollapse */
NgxEmojiService.ctorParameters = function () { return []; };
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
/** @enum {number} */
var NgxEmojiEntityType = {
    Bold: 0,
    Italic: 1,
    Underline: 2,
};
NgxEmojiEntityType[NgxEmojiEntityType.Bold] = "Bold";
NgxEmojiEntityType[NgxEmojiEntityType.Italic] = "Italic";
NgxEmojiEntityType[NgxEmojiEntityType.Underline] = "Underline";
/**
 * @record
 */
var NgxEmojiComponent = /** @class */ (function () {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    function NgxEmojiComponent(elRef, globalEmojiService) {
        this.elRef = elRef;
        this._contenteditable = false;
        this._enterOn = {
            shift: false,
            ctrl: false
        };
        this.prevent = {
            text: null, entities: null
        };
        this.emojiServiceSubscription = new Subscription.Subscription();
        this.allowedTags = ['b', 'i', 'u', 'strong', 'em'];
        this.onContenteditable = new core.EventEmitter();
        this.onEnterOn = new core.EventEmitter();
        this.onFullHtml = new core.EventEmitter();
        this.onHtml = new core.EventEmitter();
        this.onText = new core.EventEmitter();
        this.onEntities = new core.EventEmitter();
        /**
         * Enter events
         */
        this.onEnter = new core.EventEmitter();
        var /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        var /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            if (globalEmojiService.isActiveComponent(component)) {
                component.insertEmoji(emoji);
            }
        });
        this.emojiServiceSubscription.add(subscription);
        this.getNativeElement().appendChild(document.createTextNode(''));
        var /** @type {?} */ range = document.createRange();
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
    NgxEmojiComponent.prototype.getNativeElement = function () {
        return this.elRef.nativeElement;
    };
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
            this.emojiServiceSubscription = new Subscription.Subscription();
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
            this.elRef.nativeElement.setAttribute('contenteditable', editable);
            this.onContenteditable.emit(editable);
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
            this.onEnterOn.emit(enterOn);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsEnter = function () {
        return !this.enterKeyIsShiftEnter() && !this.enterKeyIsCtrlEnter();
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsCtrlEnter = function () {
        return (this.enterOn.ctrl) ? true : false;
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.enterKeyIsShiftEnter = function () {
        return (this.enterOn.shift) ? true : false;
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "fullHtml", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ html = document.createElement('div');
            html.innerHTML = this.getNativeElement().innerHTML;
            try {
                for (var _a = __values(this.arrayOfNodeList(html.getElementsByTagName('img'))), _b = _a.next(); !_b.done; _b = _a.next()) {
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
            catch (e_1_1) { e_1 = { error: e_1_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_1) throw e_1.error; }
            }
            return html.innerHTML;
            var e_1, _c;
        },
        /**
         * HTML
         * @param {?} html
         * @return {?}
         */
        set: function (html) {
            this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "html", {
        /**
         * @return {?}
         */
        get: function () {
            return this.getHtml(this.getNativeElement());
        },
        /**
         * HTML wihout parahraphs
         * @param {?} html
         * @return {?}
         */
        set: function (html) {
            this.getNativeElement().innerHTML = this.filterHtml(html, this.allowedTags);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} rootElement
     * @return {?}
     */
    NgxEmojiComponent.prototype.getHtml = function (rootElement) {
        var /** @type {?} */ component = this;
        var /** @type {?} */ html = '';
        var /** @type {?} */ rf = function (nodes) {
            try {
                for (var _a = __values(component.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
                    var /** @type {?} */ blockNode = component.isBlockNode(node);
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
                        && ((node)).nextElementSibling
                        && component.isBlockNode(((node)).nextElementSibling)
                        && node.nextSibling.textContent.length == 0) {
                        html += '\n';
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
        rf(rootElement.childNodes);
        html = this.replaceAll(html, '\u00A0', ' ');
        html = this.replaceAll(html, '&nbsp;', ' ');
        return html;
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "text", {
        /**
         * @return {?}
         */
        get: function () {
            return this.filterHtml(this.html);
        },
        /**
         * Text
         * @param {?} text
         * @return {?}
         */
        set: function (text) {
            if (!this.contenteditable && text == this.prevent.text) {
                return;
            }
            this.prevent.text = text;
            text = this.filterHtml(text);
            text = this.replaceAll(text, '\u00A0', ' ');
            text = this.replaceAll(text, '  ', '&nbsp;&nbsp;');
            text = this.replaceSymbolsToEmojis(text);
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
            catch (e_3_1) { e_3 = { error: e_3_1 }; }
            finally {
                try {
                    if (paragraphs_1_1 && !paragraphs_1_1.done && (_a = paragraphs_1.return)) _a.call(paragraphs_1);
                }
                finally { if (e_3) throw e_3.error; }
            }
            this.getNativeElement().innerHTML = text;
            if (this.getNativeElement().childNodes.length == 0) {
                this.getNativeElement().appendChild(document.createTextNode(''));
            }
            var /** @type {?} */ range = document.createRange();
            var /** @type {?} */ lastChild = this.getNativeElement().lastChild;
            while (lastChild.hasChildNodes()) {
                lastChild = lastChild.lastChild;
            }
            range.setStart(lastChild, lastChild.textContent.length);
            this.lastSelectionRange = range;
            var e_3, _a;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * Entities
     * @param {?} type
     * @return {?}
     */
    NgxEmojiComponent.prototype.normalizeEntityType = function (type) {
        if (util.isString(type)) {
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
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "entities", {
        /**
         * @return {?}
         */
        get: function () {
            var /** @type {?} */ component = this;
            var /** @type {?} */ entities = [];
            var /** @type {?} */ rf = function (nodes, offset) {
                try {
                    for (var _a = __values(component.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                        var node = _b.value;
                        if (node.textContent.trim().length > 0) {
                            var /** @type {?} */ nodeName = node.nodeName.toUpperCase();
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
                }
                catch (e_4_1) { e_4 = { error: e_4_1 }; }
                finally {
                    try {
                        if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                    }
                    finally { if (e_4) throw e_4.error; }
                }
                var e_4, _c;
            };
            var /** @type {?} */ div = document.createElement('div');
            div.innerHTML = this.html;
            rf(div.childNodes, 0);
            div.remove();
            return entities;
        },
        /**
         * @param {?} entities
         * @return {?}
         */
        set: function (entities) {
            if (!this.contenteditable && JSON.stringify(entities) == JSON.stringify(this.prevent.entities)) {
                return;
            }
            this.prevent.entities = entities;
            var /** @type {?} */ component = this;
            var /** @type {?} */ nativeElement = this.getNativeElement();
            var /** @type {?} */ selection = window.getSelection();
            var /** @type {?} */ previousRange = (selection.rangeCount) ? selection.getRangeAt(0) : null;
            var /** @type {?} */ previousContenteditableState = this.contenteditable;
            if (!util.isArray(entities)) {
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
            var /** @type {?} */ text = this.text;
            this.text = '';
            this.text = text;
            // Enable contenteditable for exec commands
            this.contenteditable = true;
            var /** @type {?} */ endFounded = false;
            var _loop_1 = function (entity) {
                var /** @type {?} */ range = document.createRange();
                var /** @type {?} */ offset = 0;
                var /** @type {?} */ rf = function (nodes) {
                    for (var /** @type {?} */ i = 0; i < nodes.length; i++) {
                        var /** @type {?} */ node = nodes.item(i);
                        if (component.isEmojiNode(node)) {
                            var /** @type {?} */ textLength = component.emojiToSymbol(component.emojiFromNode(node)).length;
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
                this_1.formatText(/** @type {?} */ (entity.type));
            };
            var this_1 = this;
            try {
                for (var entities_1 = __values(entities), entities_1_1 = entities_1.next(); !entities_1_1.done; entities_1_1 = entities_1.next()) {
                    var entity = entities_1_1.value;
                    _loop_1(/** @type {?} */ entity);
                }
            }
            catch (e_5_1) { e_5 = { error: e_5_1 }; }
            finally {
                try {
                    if (entities_1_1 && !entities_1_1.done && (_a = entities_1.return)) _a.call(entities_1);
                }
                finally { if (e_5) throw e_5.error; }
            }
            // Restore previous state
            selection.removeAllRanges();
            if (previousRange) {
                selection.addRange(previousRange);
            }
            this.contenteditable = previousContenteditableState;
            var e_5, _a;
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
            this.insertNewLine();
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
            this.insertNewLine();
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
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.emitEnter = function () {
        this.onText.emit(this.text);
        this.onEntities.emit(this.entities);
        this.onFullHtml.emit(this.fullHtml);
        this.onHtml.emit(this.html);
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
        if (document.onselectionchange === undefined) {
            this.lastSelectionRange = window.getSelection().getRangeAt(0);
        }
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.onSelectionchange = function () {
        var /** @type {?} */ selection = window.getSelection();
        if (selection.containsNode(this.getNativeElement(), true)) {
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
        html = this.filterHtml(html, this.allowedTags);
        html = this.replaceSymbolsToEmojis(html);
        this.execCommand('insertHTML', html);
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
        div.innerHTML = this.getHtml(div);
        // Copy HTML hack
        document.getElementsByTagName('body')[0].appendChild(div);
        var /** @type {?} */ range = document.createRange();
        range.setStartBefore(div.firstChild);
        range.setEndAfter(div.lastChild);
        var /** @type {?} */ selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        this.execCommand('copy');
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
        this.execCommand('delete');
    };
    /**
     * Internal
     * @template T
     * @param {?} list
     * @return {?}
     */
    NgxEmojiComponent.prototype.arrayOfNodeList = function (list) {
        var /** @type {?} */ result = [];
        for (var /** @type {?} */ i = 0; i < list.length; i++) {
            result.push(list.item(i));
        }
        return result;
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiComponent.prototype.isBlockNode = function (node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        if (node instanceof HTMLDivElement) {
            return true;
        }
        return window.getComputedStyle(node, '').display == 'block';
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiComponent.prototype.isEmojiNode = function (node) {
        if (!(node instanceof HTMLElement)) {
            return false;
        }
        return node.classList.contains('ngx-emoji');
    };
    /**
     * @param {?} node
     * @return {?}
     */
    NgxEmojiComponent.prototype.emojiFromNode = function (node) {
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
     * @param {?} text
     * @return {?}
     */
    NgxEmojiComponent.prototype.replaceSymbolsToEmojis = function (text) {
        var /** @type {?} */ component = this;
        text = text.replace(this.getEmojiRegex(), function (match) {
            return component.createEmojiImg(component.emojiFromSymbol(match));
        });
        text = this.replaceAll(text, '\uFE0F', ''); // remove variation selector
        return text;
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
    NgxEmojiComponent.prototype.replaceAll = function (str, find, replace) {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    };
    /**
     * @param {?} command
     * @param {?=} value
     * @return {?}
     */
    NgxEmojiComponent.prototype.execCommand = function (command, value) {
        return document.execCommand(command, false, value);
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.insertNewLine = function () {
        this.execCommand('insertParagraph');
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiComponent.prototype.createEmojiImg = function (emoji) {
        return '<img class="ngx-emoji ngx-emoji-' + emoji + '" ' +
            'aria-hidden="true" ' +
            'alt="' + this.emojiToSymbol(emoji) + '" ' +
            'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=">';
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiComponent.prototype.emojiToSymbol = function (emoji) {
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
     * @param {?} symbol
     * @return {?}
     */
    NgxEmojiComponent.prototype.emojiFromSymbol = function (symbol) {
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
        this.execCommand('insertHTML', this.createEmojiImg(emoji));
    };
    /**
     * @param {?} html
     * @param {?=} allowTags
     * @return {?}
     */
    NgxEmojiComponent.prototype.filterHtml = function (html, allowTags) {
        if (allowTags === void 0) { allowTags = []; }
        var /** @type {?} */ component = this;
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        var /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        var /** @type {?} */ rf = function (nodes) {
            try {
                for (var _a = __values(component.arrayOfNodeList(nodes)), _b = _a.next(); !_b.done; _b = _a.next()) {
                    var node = _b.value;
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
            }
            catch (e_6_1) { e_6 = { error: e_6_1 }; }
            finally {
                try {
                    if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
                }
                finally { if (e_6) throw e_6.error; }
            }
            var e_6, _c;
        };
        rf(tmp.childNodes);
        tmp.remove();
        return html;
    };
    /**
     * @param {?} type
     * @return {?}
     */
    NgxEmojiComponent.prototype.formatText = function (type) {
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
    };
    /**
     * See: https://stackoverflow.com/a/41164587/1617101
     * @return {?}
     */
    NgxEmojiComponent.prototype.getEmojiRegex = function () {
        return /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|[\ud83c[\ude01\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|[\ud83c[\ude32\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|[\ud83c[\ude50\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g;
    };
    return NgxEmojiComponent;
}());
NgxEmojiComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ngx-emoji',
                template: ''
            },] },
];
/** @nocollapse */
NgxEmojiComponent.ctorParameters = function () { return [
    { type: core.ElementRef, },
    { type: NgxEmojiService, },
]; };
NgxEmojiComponent.propDecorators = {
    "inputPicker": [{ type: core.Input, args: ['picker',] },],
    "attrContenteditable": [{ type: core.Input, args: ['attr.contenteditable',] },],
    "contenteditable": [{ type: core.Input, args: ['contenteditable',] },],
    "onContenteditable": [{ type: core.Output, args: ['contenteditable',] },],
    "enterOn": [{ type: core.Input, args: ['enterOn',] },],
    "onEnterOn": [{ type: core.Output, args: ['enterOn',] },],
    "fullHtml": [{ type: core.Input, args: ['fullHtml',] },],
    "onFullHtml": [{ type: core.Output, args: ['fullHtml',] },],
    "html": [{ type: core.Input, args: ['html',] },],
    "onHtml": [{ type: core.Output, args: ['html',] },],
    "text": [{ type: core.Input, args: ['text',] },],
    "onText": [{ type: core.Output, args: ['text',] },],
    "entities": [{ type: core.Input, args: ['entities',] },],
    "onEntities": [{ type: core.Output, args: ['entities',] },],
    "onEnter": [{ type: core.Output, args: ['enter',] },],
    "onKeydownEnter": [{ type: core.HostListener, args: ["keydown.enter", ['$event'],] },],
    "onKeydownControlEnter": [{ type: core.HostListener, args: ["keydown.control.enter", ['$event'],] },],
    "onKeydownShiftEnter": [{ type: core.HostListener, args: ["keydown.shift.enter", ['$event'],] },],
    "onKeydown": [{ type: core.HostListener, args: ["keydown", ['$event'],] },],
    "onFocus": [{ type: core.HostListener, args: ["focus",] },],
    "onFocusout": [{ type: core.HostListener, args: ["focusout",] },],
    "onPaste": [{ type: core.HostListener, args: ["paste", ['$event'],] },],
    "onCopy": [{ type: core.HostListener, args: ["copy", ['$event'],] },],
    "onCut": [{ type: core.HostListener, args: ["cut", ['$event'],] },],
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
        this.emojis = [];
    }
    /**
     * @return {?}
     */
    NgxEmojiPickerComponent.prototype.ngOnInit = function () {
        this.emojis = require('ngx-emoji/emojis.json');
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
    return NgxEmojiPickerComponent;
}());
NgxEmojiPickerComponent.decorators = [
    { type: core.Component, args: [{
                selector: 'ngx-emoji-picker',
                template: "<i *ngFor=\"let emoji of emojis\"\n   [class]=\"'ngx-emoji ngx-emoji-' + emoji.unified\"\n   aria-hidden=\"true\"\n   (click)=\"emojiPicked(emoji.unified)\"\n></i>\n"
            },] },
];
/** @nocollapse */
NgxEmojiPickerComponent.ctorParameters = function () { return [
    { type: NgxEmojiService, },
]; };
NgxEmojiPickerComponent.propDecorators = {
    "inputFor": [{ type: core.Input, args: ['for',] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiModule = /** @class */ (function () {
    function NgxEmojiModule() {
    }
    return NgxEmojiModule;
}());
NgxEmojiModule.decorators = [
    { type: core.NgModule, args: [{
                imports: [
                    common.CommonModule
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
NgxEmojiModule.ctorParameters = function () { return []; };

exports.NgxEmojiModule = NgxEmojiModule;
exports.NgxEmojiPickerComponent = NgxEmojiPickerComponent;
exports.NgxEmojiComponent = NgxEmojiComponent;
exports.NgxEmojiEntityType = NgxEmojiEntityType;
exports.NgxEmojiService = NgxEmojiService;

Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ngx-emoji.umd.js.map

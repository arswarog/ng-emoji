import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Subscription as Subscription$1 } from 'rxjs/Subscription';
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxHtmlConverter = /** @class */ (function () {
    function NgxHtmlConverter() {
    }
    /**
     * @param {?} html
     * @return {?}
     */
    NgxHtmlConverter.prototype.fromHtml = function (html) {
        var /** @type {?} */ text = html.replace('<br>', '\n');
        return text;
    };
    /**
     * @param {?} text
     * @return {?}
     */
    NgxHtmlConverter.prototype.toHtml = function (text) {
        var /** @type {?} */ html = text.replace('\n', '<br>');
        return html;
    };
    /**
     * @param {?} text
     * @return {?}
     */
    NgxHtmlConverter.prototype.filterHtml = function (text) {
        var /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || "";
        return text;
    };
    return NgxHtmlConverter;
}());
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
var NgxEmojiComponent = /** @class */ (function () {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    function NgxEmojiComponent(elRef, globalEmojiService) {
        this.elRef = elRef;
        this.contenteditable = false;
        this.enterOn = {
            shift: false,
            ctrl: false
        };
        this.htmlConverter = new NgxHtmlConverter();
        this.emojiServiceSubscription = new Subscription$1();
        this.lastSelectionRange = {
            start: 0,
            stop: 0
        };
        this.onText = new EventEmitter();
        this.onEnter = new EventEmitter();
        this.onEntities = new EventEmitter();
        var /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        var /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }
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
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    };
    Object.defineProperty(NgxEmojiComponent.prototype, "inputPicker", {
        /**
         * @param {?} pickerComponent
         * @return {?}
         */
        set: function (pickerComponent) {
            this.emojiServiceSubscription.unsubscribe();
            this.emojiServiceSubscription = new Subscription$1();
            this.emojiService = new NgxEmojiService();
            this.emojiService.setActiveComponent(this);
            pickerComponent.setEmojiService(this.emojiService);
            var /** @type {?} */ component = this;
            var /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
                component.insertEmoji(emoji);
            });
            this.emojiServiceSubscription.add(subscription);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "attrContenteditable", {
        /**
         * @param {?} editable
         * @return {?}
         */
        set: function (editable) {
            this.setContentEditable(editable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "inputContenteditable", {
        /**
         * @param {?} editable
         * @return {?}
         */
        set: function (editable) {
            this.setContentEditable(editable);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "inputEnterOn", {
        /**
         * @param {?} enterOn
         * @return {?}
         */
        set: function (enterOn) {
            this.enterOn = enterOn;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NgxEmojiComponent.prototype, "inputText", {
        /**
         * @param {?} text
         * @return {?}
         */
        set: function (text) {
            this.setText(text);
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydownEnter = function (event) {
        if (!this.isContentEditable()) {
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
        if (!this.isContentEditable()) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsCtrlEnter()) {
            this.emitEnter();
        }
    };
    /**
     * @param {?} event
     * @return {?}
     */
    NgxEmojiComponent.prototype.onKeydownShiftEnter = function (event) {
        if (!this.isContentEditable()) {
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
    NgxEmojiComponent.prototype.onFocus = function () {
        this.emojiService.setActiveComponent(this);
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.onFocusout = function () {
        this.lastSelectionRange = this.getSelectionRange();
    };
    /**
     * @param {?} editable
     * @return {?}
     */
    NgxEmojiComponent.prototype.setContentEditable = function (editable) {
        /*if (this.contenteditable != editable && editable == true) {
                    this.elRef.nativeElement.innerHTML = this.htmlConverter.fromHtml(this.elRef.nativeElement.innerHTML);
                }
                if (this.contenteditable != editable && editable == false) {
                    this.elRef.nativeElement.innerHTML = this.htmlConverter.toHtml(this.elRef.nativeElement.innerHTML);
                }*/
        this.contenteditable = editable;
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.isContentEditable = function () {
        return this.contenteditable;
    };
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
    /**
     * @param {?} text
     * @return {?}
     */
    NgxEmojiComponent.prototype.setText = function (text) {
        this.elRef.nativeElement.innerHTML = this.htmlConverter.filterHtml(text);
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.getText = function () {
        var /** @type {?} */ text = this.elRef.nativeElement.innerHTML;
        // hotfix to insert new line
        if (text.substr(text.length - 2) == '\n\n') {
            text = text.substr(0, text.length - 1);
        }
        return text;
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.getNativeElement = function () {
        return this.elRef.nativeElement;
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.emitEnter = function () {
        this.onText.emit(this.getText());
        this.onEnter.emit();
        this.elRef.nativeElement.innerHTML = '';
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.insertNewLine = function () {
        this.insertText('\n');
    };
    /**
     * @param {?} emoji
     * @return {?}
     */
    NgxEmojiComponent.prototype.insertEmoji = function (emoji) {
        if (!this.isContentEditable()) {
            return;
        }
        if (!this.emojiService.isActiveComponent(this)) {
            return;
        }
        this.insertText(' ' + emoji + ' ');
    };
    /**
     * @param {?} text
     * @return {?}
     */
    NgxEmojiComponent.prototype.insertText = function (text) {
        var /** @type {?} */ currentText = this.elRef.nativeElement.innerHTML;
        var /** @type {?} */ selection;
        if (document.activeElement === this.elRef.nativeElement) {
            selection = this.getSelectionRange();
        }
        else {
            selection = this.lastSelectionRange;
        }
        this.elRef.nativeElement.innerHTML =
            currentText.substr(0, selection.start)
                + text
                + currentText.substr(selection.stop);
        // hotfix to insert new line
        if (selection.stop == currentText.length && text == '\n') {
            this.elRef.nativeElement.innerHTML = this.elRef.nativeElement.innerHTML + '\n';
        }
        this.setCaretPosition(selection.start + text.length);
    };
    /**
     * @return {?}
     */
    NgxEmojiComponent.prototype.getSelectionRange = function () {
        var /** @type {?} */ selection = window.getSelection();
        var /** @type {?} */ start = 0;
        var /** @type {?} */ stop = 0;
        if (selection.type == 'Caret') {
            start = selection.extentOffset;
            stop = selection.extentOffset;
        }
        if (selection.type == 'Range') {
            start = selection.extentOffset;
            stop = selection.anchorOffset;
            if (start > stop) {
                start = selection.anchorOffset;
                stop = selection.extentOffset;
            }
        }
        return {
            start: start,
            stop: stop
        };
    };
    /**
     * @param {?} pos
     * @return {?}
     */
    NgxEmojiComponent.prototype.setCaretPosition = function (pos) {
        var /** @type {?} */ selection = window.getSelection();
        selection.collapse(this.elRef.nativeElement.firstChild, pos);
    };
    return NgxEmojiComponent;
}());
NgxEmojiComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji',
                template: '',
                styles: ["ngx-emoji,\nngx-emoji-picker {\n  display: block;\n}\nngx-emoji {\n  white-space: pre-wrap;\n}\n"]
            },] },
];
/** @nocollapse */
NgxEmojiComponent.ctorParameters = function () { return [
    { type: ElementRef, },
    { type: NgxEmojiService, },
]; };
NgxEmojiComponent.propDecorators = {
    "inputPicker": [{ type: Input, args: ['picker',] },],
    "attrContenteditable": [{ type: Input, args: ['attr.contenteditable',] },],
    "inputContenteditable": [{ type: Input, args: ['contenteditable',] },],
    "inputEnterOn": [{ type: Input, args: ['enterOn',] },],
    "inputText": [{ type: Input, args: ['text',] },],
    "onText": [{ type: Output, args: ['text',] },],
    "onEnter": [{ type: Output, args: ['enter',] },],
    "onEntities": [{ type: Output, args: ['entities',] },],
    "onKeydownEnter": [{ type: HostListener, args: ["keydown.enter", ['$event'],] },],
    "onKeydownControlEnter": [{ type: HostListener, args: ["keydown.control.enter", ['$event'],] },],
    "onKeydownShiftEnter": [{ type: HostListener, args: ["keydown.shift.enter", ['$event'],] },],
    "onFocus": [{ type: HostListener, args: ["focus",] },],
    "onFocusout": [{ type: HostListener, args: ["focusout",] },],
};
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiService = /** @class */ (function () {
    function NgxEmojiService() {
        this.onEmojiPicked = new Subject$1();
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
    { type: Injectable },
];
/** @nocollapse */
NgxEmojiService.ctorParameters = function () { return []; };
/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
var NgxEmojiPickerComponent = /** @class */ (function () {
    /**
     * @param {?} emojiService
     */
    function NgxEmojiPickerComponent(emojiService) {
        this.emojiService = emojiService;
    }
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
    { type: Component, args: [{
                selector: 'ngx-emoji-picker',
                template: "<button type=\"button\" (click)=\"emojiPicked(':)')\">:)</button>\n<button type=\"button\" (click)=\"emojiPicked(';)')\">;)</button>\n<button type=\"button\" (click)=\"emojiPicked(':D')\">:D</button>\n"
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
//import { CommonModule } from '@angular/common';
var NgxEmojiModule = /** @class */ (function () {
    function NgxEmojiModule() {
    }
    return NgxEmojiModule;
}());
NgxEmojiModule.decorators = [
    { type: NgModule, args: [{
                imports: [],
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
export { NgxEmojiModule, NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiService };
//# sourceMappingURL=ngx-emoji.js.map

import { Component, ElementRef, EventEmitter, HostListener, Injectable, Input, NgModule, Output } from '@angular/core';
import { Subject as Subject$1 } from 'rxjs/Subject';
import { Subscription as Subscription$1 } from 'rxjs/Subscription';

/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes} checked by tsc
 */
class NgxHtmlConverter {
    /**
     * @param {?} html
     * @return {?}
     */
    fromHtml(html) {
        let /** @type {?} */ text = html.replace('<br>', '\n');
        return text;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    toHtml(text) {
        let /** @type {?} */ html = text.replace('\n', '<br>');
        return html;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    filterHtml(text) {
        let /** @type {?} */ tmp = document.createElement("div");
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || "";
        return text;
    }
}

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

class NgxEmojiComponent {
    /**
     * @param {?} elRef
     * @param {?} globalEmojiService
     */
    constructor(elRef, globalEmojiService) {
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
        let /** @type {?} */ component = this;
        globalEmojiService.setActiveComponent(this);
        this.emojiService = globalEmojiService;
        let /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
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
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }
    /**
     * @param {?} pickerComponent
     * @return {?}
     */
    set inputPicker(pickerComponent) {
        this.emojiServiceSubscription.unsubscribe();
        this.emojiServiceSubscription = new Subscription$1();
        this.emojiService = new NgxEmojiService();
        this.emojiService.setActiveComponent(this);
        pickerComponent.setEmojiService(this.emojiService);
        let /** @type {?} */ component = this;
        let /** @type {?} */ subscription = this.emojiService.onEmojiPicked.subscribe(function (emoji) {
            component.insertEmoji(emoji);
        });
        this.emojiServiceSubscription.add(subscription);
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set attrContenteditable(editable) {
        this.setContentEditable(editable);
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    set inputContenteditable(editable) {
        this.setContentEditable(editable);
    }
    /**
     * @param {?} enterOn
     * @return {?}
     */
    set inputEnterOn(enterOn) {
        this.enterOn = enterOn;
    }
    /**
     * @param {?} text
     * @return {?}
     */
    set inputText(text) {
        this.setText(text);
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownEnter(event) {
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
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownControlEnter(event) {
        if (!this.isContentEditable()) {
            return;
        }
        event.preventDefault();
        if (this.enterKeyIsCtrlEnter()) {
            this.emitEnter();
        }
    }
    /**
     * @param {?} event
     * @return {?}
     */
    onKeydownShiftEnter(event) {
        if (!this.isContentEditable()) {
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
    onFocus() {
        this.emojiService.setActiveComponent(this);
    }
    /**
     * @return {?}
     */
    onFocusout() {
        this.lastSelectionRange = this.getSelectionRange();
    }
    /**
     * @param {?} editable
     * @return {?}
     */
    setContentEditable(editable) {
        /*if (this.contenteditable != editable && editable == true) {
                    this.elRef.nativeElement.innerHTML = this.htmlConverter.fromHtml(this.elRef.nativeElement.innerHTML);
                }
                if (this.contenteditable != editable && editable == false) {
                    this.elRef.nativeElement.innerHTML = this.htmlConverter.toHtml(this.elRef.nativeElement.innerHTML);
                }*/
        this.contenteditable = editable;
        this.elRef.nativeElement.setAttribute('contenteditable', editable);
    }
    /**
     * @return {?}
     */
    isContentEditable() {
        return this.contenteditable;
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
     * @param {?} text
     * @return {?}
     */
    setText(text) {
        this.elRef.nativeElement.innerHTML = this.htmlConverter.filterHtml(text);
    }
    /**
     * @return {?}
     */
    getText() {
        let /** @type {?} */ text = this.elRef.nativeElement.innerHTML;
        // hotfix to insert new line
        if (text.substr(text.length - 2) == '\n\n') {
            text = text.substr(0, text.length - 1);
        }
        return text;
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
    emitEnter() {
        this.onText.emit(this.getText());
        this.onEnter.emit();
        this.elRef.nativeElement.innerHTML = '';
    }
    /**
     * @return {?}
     */
    insertNewLine() {
        this.insertText('\n');
    }
    /**
     * @param {?} emoji
     * @return {?}
     */
    insertEmoji(emoji) {
        if (!this.isContentEditable()) {
            return;
        }
        if (!this.emojiService.isActiveComponent(this)) {
            return;
        }
        this.insertText(' ' + emoji + ' ');
    }
    /**
     * @param {?} text
     * @return {?}
     */
    insertText(text) {
        let /** @type {?} */ currentText = this.elRef.nativeElement.innerHTML;
        let /** @type {?} */ selection;
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
    }
    /**
     * @return {?}
     */
    getSelectionRange() {
        let /** @type {?} */ selection = window.getSelection();
        let /** @type {?} */ start = 0;
        let /** @type {?} */ stop = 0;
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
    }
    /**
     * @param {?} pos
     * @return {?}
     */
    setCaretPosition(pos) {
        let /** @type {?} */ selection = window.getSelection();
        selection.collapse(this.elRef.nativeElement.firstChild, pos);
    }
}
NgxEmojiComponent.decorators = [
    { type: Component, args: [{
                selector: 'ngx-emoji',
                template: '',
                styles: [`ngx-emoji,
ngx-emoji-picker {
  display: block;
}
ngx-emoji {
  white-space: pre-wrap;
}
`]
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
class NgxEmojiPickerComponent {
    /**
     * @param {?} emojiService
     */
    constructor(emojiService) {
        this.emojiService = emojiService;
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
                template: `<button type="button" (click)="emojiPicked(':)')">:)</button>
<button type="button" (click)="emojiPicked(';)')">;)</button>
<button type="button" (click)="emojiPicked(':D')">:D</button>
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
//import { CommonModule } from '@angular/common';
class NgxEmojiModule {
}
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

export { NgxEmojiModule, NgxEmojiPickerComponent, NgxEmojiComponent, NgxEmojiService };
//# sourceMappingURL=ngx-emoji.js.map

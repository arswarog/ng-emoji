import { EventEmitter } from "@angular/core";
import { NgxEmojiUtils } from "./utils";

export class NgxEmojiElement {

    public readonly onModified: EventEmitter<MutationEvent> = new EventEmitter<MutationEvent>();

    public constructor(
        public readonly nativeElement: HTMLElement
    ) {
        let onModified = this.onModified;
        nativeElement.addEventListener('DOMSubtreeModified', function (event) {
            onModified.emit(event as MutationEvent);
        });
    }

    public set contentEditable(editable: boolean) {
        if (editable != this.contentEditable) {
            this.nativeElement.setAttribute('contenteditable', editable ? 'true' : 'false');
        }
    }

    public get contentEditable(): boolean {
        return this.nativeElement.getAttribute('contenteditable') == 'true';
    }

    public execCommand(command: string, value?: any): boolean {
        let editable = this.contentEditable;
        this.contentEditable = true;
        let result = false;
        switch (command) {
            case 'code':
                result = this.execCommandTag('code');
                break;
            case 'pre':
                result = this.execCommandTag('pre');
                break;
            case 'command':
                result = this.execCommandTag('span', [{name: 'class', value: 'command'}]);
                break;
            default:
                result = document.execCommand(command, false, value);
                break;
        }
        this.contentEditable = editable;
        return result;
    }

    protected execCommandTag(tag: string, attributes: { name: string, value: string }[] = []): boolean {
        this.execCommand('superscript');
        let tmp = document.createElement("div");
        tmp.innerHTML = this.nativeElement.innerHTML;
        let html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
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
                        html += '<' + nodeName;
                        for (let i = 0; i < node.attributes.length; i++) {
                            let attr = node.attributes.item(i);
                            html += ' ' + attr.name + '="' + attr.value + '"';
                        }
                        html += '>';
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
        this.nativeElement.innerHTML = html;
        return true;
    }

}
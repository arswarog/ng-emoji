import { NgxEmojiEntity, NgxEmojiEntityType } from "./ngx-emoji.component";
import { NgxEmojiUtils } from "./utils";
import { NgxEmojiElement } from "./ngx-emoji.element";
import { NgxEmojiHelper } from "./ngx-emoji.helper";
import { NgxEmojiFormatter } from "./ngx-emoji.formatter";

export class NgxEmojiHandler {
    public readonly allowedTags = [
        'b', 'i', 'u', 'strong', 'em',
        'strike', 'code', 'pre', 'a'
    ];

    public constructor(
        protected readonly element: NgxEmojiElement,
        protected readonly formatter: NgxEmojiFormatter
    ) {
    }

    public format(text: string, entities: NgxEmojiEntity[]): void {
        let handler = this;
        let nativeElement = this.element.nativeElement;
        let selection = window.getSelection();
        let previousRange: Range = (selection.rangeCount) ? selection.getRangeAt(0) : null;

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
        this.element.nativeElement.innerHTML = text;
        if (this.element.nativeElement.childNodes.length == 0) {
            this.element.nativeElement.appendChild(document.createTextNode(''));
        }

        /* set entities */
        let endFounded = false;
        for (let entity of entities) {
            let range = document.createRange();
            let offset = 0;
            let rf = function (nodes: NodeList) {
                for (let i = 0; i < nodes.length; i++) {
                    let node = nodes.item(i);
                    if (NgxEmojiHelper.isEmojiNode(node)) {
                        let textLength = NgxEmojiHelper.emojiToSymbol(NgxEmojiHelper.emojiFromNode(node)).length;
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
                    this.formatter.formatText(entity.type as NgxEmojiEntityType);
                    break;
            }
        }

        selection.removeAllRanges();
        if (previousRange) {
            selection.addRange(previousRange);
        }
    }

    public getEntities(): NgxEmojiEntity[] {
        let entities: NgxEmojiEntity[] = [];
        let rf = function (nodes: NodeList, offset: number): void {
            for (let node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
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
        div.innerHTML = this.getMarkupHtml(this.element.nativeElement, true);
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

    public getText(): string {
        return NgxEmojiUtils.filterHtml(this.getMarkupHtml());
    }

    public getFullHtml() {
        let html = document.createElement('div');
        html.innerHTML = this.element.nativeElement.innerHTML;
        for (let img of NgxEmojiUtils.arrayOfNodeList(html.getElementsByTagName('img'))) {
            if (!img.classList.contains('ngx-emoji')) {
                continue;
            }
            let emoji = document.createElement('i');
            emoji.className = img.className;
            emoji.setAttribute('aria-hidden', 'true');
            img.parentElement.insertBefore(emoji, img);
            img.remove();
        }
        let result = html.innerHTML;
        html.remove();
        return result;
    }

    public getMarkupHtml(rootElement: HTMLElement = null, withCommands: boolean = false): string {
        if (!rootElement) {
            rootElement = this.element.nativeElement;
        }
        let html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
                let blockNode = NgxEmojiUtils.isBlockNode(node);
                if (node.nodeName == 'PRE') {
                    blockNode = false;
                }
                if (NgxEmojiHelper.isEmojiNode(node)) {
                    html += NgxEmojiHelper.emojiToSymbol(NgxEmojiHelper.emojiFromNode(node));
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
                    && (node as HTMLElement).nextElementSibling
                    && NgxEmojiUtils.isBlockNode((node as HTMLElement).nextElementSibling)
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

    public setFullHtml(html: string): void {
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags);
    }

    public setMarkupHtml(html: string): void {
        html = html.split('\n').map(function (line, index) {
            return (index > 0) ? '<div>' + line + '</div>' : line;
        }).join('');
        this.element.nativeElement.innerHTML = NgxEmojiUtils.filterHtml(html, this.allowedTags.concat('div'));
    }

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
            case 'bot_command':
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

    public findCommands(): void {
        let selection = window.getSelection();
        if (selection.anchorNode) {
            let node = selection.anchorNode;
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
            } else {
                let regex = /(^|\s)(\/[a-z0-9]+)($|\s)/ig;
                let match: RegExpExecArray;
                while ((match = regex.exec(node.textContent)) !== null) {
                    let offset = match.index;
                    if (match[0].charAt(0) == ' ') {
                        offset++;
                    }
                    let length = match[2].length;
                    if (match[2].charAt(length - 1) == ' ') {
                        length--;
                    }
                    regex.lastIndex = regex.lastIndex - (match[0].length - match[2].length);

                    let node2 = document.createTextNode(node.textContent.substr(0, offset));
                    node.textContent = node.textContent.substr(offset + length);
                    node.parentNode.insertBefore(node2, node);
                    let span = document.createElement('span');
                    span.classList.add('command');
                    span.textContent = match[2].trim();
                    node.parentNode.insertBefore(span, node);
                }
            }
        }
    }

    public findLinks(): void {
        //
    }

}

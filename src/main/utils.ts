export class NgxEmojiUtils {

    public static arrayOfNodeList<T extends Node>(list: NodeListOf<T>): T[] {
        let result: T[] = [];
        for (let i = 0; i < list.length; i++) {
            result.push(list.item(i))
        }
        return result;
    };

    public static isBlockNode(node: Node): boolean {
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
     */
    public static replaceAll(str: string, find: string, replace: string): string {
        find = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
        return str.replace(new RegExp(find, 'g'), replace);
    }

    public static filterHtml(html: string, allowTags: string[] = [], withCommands: boolean = false): string {
        allowTags = allowTags.map(function (value) {
            return value.toUpperCase();
        });
        let tmp = document.createElement("div");
        tmp.innerHTML = html;
        html = '';
        let rf = function (nodes: NodeList): void {
            for (let node of NgxEmojiUtils.arrayOfNodeList(nodes)) {
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

}

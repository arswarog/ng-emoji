export declare class NgxEmojiUtils {
    static arrayOfNodeList<T extends Node>(list: NodeListOf<T>): T[];
    static isBlockNode(node: Node): boolean;
    /**
     * String replace all implementation
     *
     * See: https://stackoverflow.com/a/1144788/1617101
     */
    static replaceAll(str: string, find: string, replace: string): string;
    static filterHtml(html: string, allowTags?: string[], withCommands?: boolean): string;
}

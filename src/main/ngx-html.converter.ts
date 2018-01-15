export class NgxHtmlConverter {

    /*public fromHtml(html: string): string {
        let text = html.replace('<br>', '\n');
        return text;
    }

    public toHtml(text: string): string {
        let html = text.replace('\n', '<br>');
        return html;
    }*/

    public filterHtml(text: string): string {
        let tmp = document.createElement("div");
        tmp.innerHTML = text;
        text = tmp.textContent || tmp.innerText || "";
        return text;
    }

}

import html from './CommentDom.html'

export default class CommentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.outerHTML = <string>html;
    }

    public getHtmlElement(): HTMLElement {
        return this.htmlElement;
    }

    public getCommentMetadataElement(): HTMLElement {
        return <HTMLElement>this.htmlElement.querySelector('#comment-metadata');
    }

    public setPostIdCommentId(postId: string, commentId: string): void {
        this.get('#post-id').textContent = postId;
        this.get('#comment-id').textContent = commentId;
    }

    public setCommentText(commentTest: string): void {
        this.get('#comment-text').textContent = commentTest;
    }

    private get(selectors: string) {
        return <HTMLElement>this.htmlElement.querySelector(selectors);
    }

}

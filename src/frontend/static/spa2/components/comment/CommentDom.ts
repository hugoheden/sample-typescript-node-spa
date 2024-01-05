import html from './CommentDom.fragment.html'
import IComponentDom from "../../IComponentDom";

export default class CommentDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element): void => {
        parent.replaceChildren(this.htmlElement);
    };

    setPostIdCommentId(postId: string, commentId: string): void {
        console.log('setPostIdCommentId: ' + postId + ', ' + commentId)
        this.get('#post-id').textContent = postId;
        this.get('#comment-id').textContent = commentId;
    }

    setCommentText(commentText: string): void {
        this.get('#comment-text').textContent = commentText;
    }

    private get(selectors: string) {
        return <HTMLElement>this.htmlElement.querySelector(selectors);
    }

}

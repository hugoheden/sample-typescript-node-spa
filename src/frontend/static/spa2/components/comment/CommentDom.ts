import html from './CommentDom.fragment.html'
import IComponentDom from "../../IComponentDom";
import CommentState from "./CommentState";

export default class CommentDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element) => {
        parent.replaceChildren(this.htmlElement);
    };

    render = (state: CommentState) => {
        this.setPostIdCommentId(state.postId, state.commentId);
        this.setCommentText(state.commentText);
    }

    private setPostIdCommentId = (postId: number, commentId: number) => {
        this.get('#post-id').textContent = `${postId}`;
        this.get('#comment-id').textContent = `${commentId}`;
    };

    private setCommentText = (commentText: string) => {
        this.get('#comment-text').textContent = commentText;
    };

    private get = (selectors: string) => <HTMLElement>this.htmlElement.querySelector(selectors);

}

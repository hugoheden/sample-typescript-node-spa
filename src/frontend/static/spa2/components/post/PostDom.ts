import html from './PostDom.fragment.html'
import IComponentDom from "../../IComponentDom";
import PostState from "./PostState";

export default class PostDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element) => {
        parent.replaceChildren(this.htmlElement);
    };

    render = (state: PostState) => {
        document.title = `${state.docTitle}`;
        this.setPostId(state.postId);
        this.setPostDoc(state.postDoc);
    }

    private setPostId = (postId: number) => {
        this.get('#post-id').textContent = `${postId}`;
        this.getAnchor('#prev-post').href = `/posts/${postId - 1}`;
        this.getAnchor('#next-post').href = `/posts/${postId + 1}`;
    };

    private setPostDoc = (postDoc: string) => {
        this.get('#post-doc').textContent = postDoc;
    };

    private get = (selectors: string) => <HTMLElement>this.htmlElement.querySelector(selectors);

    private getAnchor = (selectors: string) => <HTMLAnchorElement>this.htmlElement.querySelector(selectors);

}

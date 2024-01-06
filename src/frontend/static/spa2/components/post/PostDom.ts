import html from './PostDom.fragment.html'
import IComponentDom from "../../IComponentDom";

export default class PostDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element): void => {
        parent.replaceChildren(this.htmlElement);
    };

    setPostId(postId: number): void {
        this.get('#post-id').textContent = `${postId}`;
        this.getAnchor('#prev-post').href = `/posts/${postId - 1}`;
        this.getAnchor('#next-post').href = `/posts/${postId + 1}`;
    }

    setPostDoc(postDoc: string): void {
        this.get('#post-doc').textContent = postDoc;
    }

    private get(selectors: string) {
        return <HTMLElement>this.htmlElement.querySelector(selectors);
    }

    private getAnchor(selectors: string) {
        return <HTMLAnchorElement>this.htmlElement.querySelector(selectors);
    }

}

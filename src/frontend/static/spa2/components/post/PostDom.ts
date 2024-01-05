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

    setPostId(postId: string): void {
        this.get('#post-id').textContent = postId;
    }

    setPostDoc(postDoc: string): void {
        this.get('#post-doc').textContent = postDoc;
    }

    private get(selectors: string) {
        return <HTMLElement>this.htmlElement.querySelector(selectors);
    }

}

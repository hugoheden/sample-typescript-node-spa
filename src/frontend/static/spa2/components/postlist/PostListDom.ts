import html from './PostListDom.fragment.html'
import IComponentDom from "../../IComponentDom";

export default class PostListDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element): void => {
        parent.replaceChildren(this.htmlElement);
    };

    setPostList(postList: string): void {
        this.get('#post-list').textContent = postList;
    }

    private get(selectors: string) {
        return <HTMLElement>this.htmlElement.querySelector(selectors);
    }

}

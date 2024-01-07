import html from './PostListDom.fragment.html'
import PostListState from "./PostListState";

export default class PostListDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element) => {
        parent.replaceChildren(this.htmlElement);
    };

    render = (state: PostListState) => {
        document.title = `${state.docTitle}`;
        this.setPostList(state.postList);
    }

    private setPostList = (postList: string) => {
        this.get('#post-list').textContent = postList;
    };

    private get = (selectors: string) => <HTMLElement>this.htmlElement.querySelector(selectors);

}

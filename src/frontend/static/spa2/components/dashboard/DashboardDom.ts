import html from './DashboardDom.fragment.html'
import DashboardState from "./DashboardState";

export default class DashboardDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element) => {
        parent.replaceChildren(this.htmlElement);
    };

    render = (state: DashboardState) => {
        document.title = `${state.docTitle}`;
    }
}

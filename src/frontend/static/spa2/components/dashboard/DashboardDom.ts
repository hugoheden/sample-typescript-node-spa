import html from './DashboardDom.fragment.html'
import IComponentDom from "../../IComponentDom";

export default class DashboardDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element): void => {
        parent.replaceChildren(this.htmlElement);
    };

}

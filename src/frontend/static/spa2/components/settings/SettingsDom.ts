import html from './SettingsDom.fragment.html'
import IComponentDom from "../../IComponentDom";
import SettingsState from "./SettingsState";

export default class SettingsDom implements IComponentDom {
    private readonly htmlElement: HTMLElement;

    constructor() {
        this.htmlElement = document.createElement('div');
        // Using type assertion to avoid IDE complaining about the type of html
        this.htmlElement.innerHTML = <string>html;
    }

    mountOn = (parent: Element) => {
        parent.replaceChildren(this.htmlElement);
    };

    render = (state: SettingsState) => {
        document.title = `SPA: ${state.docTitle}`;
    };
}

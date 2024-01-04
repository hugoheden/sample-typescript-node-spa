import AbstractView from "./AbstractView";
import ViewParameters from "./ViewParamenters";

export default class Settings extends AbstractView {
    constructor(_: ViewParameters) {
        super();
        this.setTitle("Settings");
    }

    async getHtml(): Promise<string> {
        return `
            <h1>Settings</h1>
            <p>Manage your privacy and configuration.</p>
        `;
    }
}
import AbstractView from "./AbstractView";
import ViewParameters from "./ViewParamenters";

export default class Posts extends AbstractView {

    constructor(_: ViewParameters) {
        super();
        this.setTitle("Posts");
    }

    async getHtml(): Promise<string> {
        return `
            <h1>Posts</h1>
            <p>You are viewing the posts!</p>
        `;
    }
}
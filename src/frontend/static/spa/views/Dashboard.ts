import AbstractView from "./AbstractView";
import ViewParameters from "./ViewParamenters";


export default class Dashboard extends AbstractView {
    // Regarding the ` = {}`: The Dashboard view is special - it supports passing nothing to the constructor. This
    // is because the Dashboard view is used as a fallback view when no other view matches the user pathname. In that
    // case, the Dashboard view is instantiated without any parameters.
    constructor(_: ViewParameters = {}) {
        super();
        this.setTitle("Dashboard");
    }

    async getHtml(): Promise<string> {
        return `
            <h1>Welcome back</h1>
            <p>
                Fugiat voluptate et nisi Lorem cillum anim sit do eiusmod occaecat irure do. Reprehenderit anim fugiat sint exercitation consequat. Sit anim laborum sit amet Lorem adipisicing ullamco duis. Anim in do magna ea pariatur et.
            </p>
            <p>
                <a href="/posts" data-link>View recent posts</a>.
            </p>
        `;
    }
}

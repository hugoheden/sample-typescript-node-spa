import AbstractView from "./AbstractView";
import ViewParameters from "./ViewParamenters";

export default class extends AbstractView {
    private readonly postId: string;
    private readonly commentId: string;

    constructor(params: ViewParameters) {
        super();
        this.postId = params.id;
        this.commentId = params.commentId;
        this.setTitle("Viewing Post");
    }

    async getHtml() {
        return `
            <h1>Post</h1>
            <p>You are viewing post #${this.postId}${this.commentId ? ", comment #" + this.commentId : ""}.</p>
        `;
    }
}

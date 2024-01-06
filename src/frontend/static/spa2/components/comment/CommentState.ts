import Props from "../../Props";

export default interface CommentState {
    readonly props: Props;
    readonly docTitle: string;
    readonly postId: number;
    readonly commentId: number;
    readonly commentText: string;
}

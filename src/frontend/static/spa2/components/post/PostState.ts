import Props from "../../Props";

export default interface PostState {
    readonly props: Props;
    readonly docTitle: string;
    readonly postId: number;
    readonly postDoc: string;
}

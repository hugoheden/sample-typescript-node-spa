import Props from "../../Props";

export default class PostState {
    // probably mainly used for logging/debugging:
    readonly props: Props;
    readonly postId: number;
    readonly postDoc: string;

    constructor(props: Props, postId: number, postDoc: string) {
        this.postId = postId;
        this.props = props;
        this.postDoc = postDoc;
    }

};

import IComponent from "../../IComponent";
import CommentDom from "./CommentDom";
import Props from "../../Props";
import CommentState from "./CommentState";

export default class CommentComponent implements IComponent {
    private readonly componentDom: CommentDom;
    private state: CommentState;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new CommentDom();
        this.state = CommentComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.state = CommentComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        this.componentDom.render(this.state);
    };

    updateAsync = async () => {
    };

    mountOn = (parent: Element) => {
        this.componentDom.mountOn(parent);
    }

    onMounted = () => {
    }

    beforeUnmount = () => {
    }


    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props): CommentState => {
        const postId = parseInt(props.postId);
        const commentId = parseInt(props.commentId);
        return {
            props: {...props},
            docTitle: "Comment",
            postId: postId,
            commentId: commentId,
            commentText: "some comment should be visible here"
        };
    };

}

import IComponent from "../../IComponent";
import CommentDom from "./CommentDom";
import Props from "../../Props";
import CommentState from "./CommentState";

export default class CommentComponent implements IComponent {
    private readonly componentDom: CommentDom;
    private mutableState: CommentState;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new CommentDom();
        this.mutableState = CommentComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.mutableState = CommentComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        document.title = `SPA: ${this.constructor.name}`;
        // TODO:
        // this.componentDom.setPostIdCommentId(this.currentProps.postId, this.currentProps.commentId);
        // this.componentDom.setCommentText(this.currentProps.commentText);
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props) => {
        // if (!this.currentProps.postId || !this.currentProps.commentId) {
        //     throw new Error('Bad props - missing postId or commentId: ' + JSON.stringify(this.currentProps));
        // }
        // TODO parse, validate, convert, store:
        return new CommentState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

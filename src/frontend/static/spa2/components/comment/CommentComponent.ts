import IComponent from "../../IComponent";
import CommentDom from "./CommentDom";
import Props from "../../Props";
import CommentState from "./CommentState";

export default class CommentComponent implements IComponent {
    private readonly componentDom: CommentDom;
    private currentProps: Props;
    private mutableState: CommentState;
    // private readonly dataFetcher: DataFetcher;
    // private readonly commentMetadataComponent;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new CommentDom();
        // TODO - a "static" subcomponent (meaning it will remain for the lifetime of this
        //  component - although its state may change):
        // this.commentMetadataComponent = new CommentMetadataComponent(
        //     initialProps,
        //     dataFetcher
        // );
        // .... and: attach subcomponent to DOM
        // TODO this.dataFetcher = dataFetcher;
        this.currentProps = initialProps;
        this.mutableState = this.calculateState();
        this.render();
    }

    /** Called by the parent component when new props are passed in.
     * Could also be called by the component itself, if it needs to update its own props.
     * */
    onPropsUpdated = (props: Props) => {
        this.currentProps = props;
        this.mutableState = this.calculateState();
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        // TODO - this.currentProps is user input. Validate to avoid malicious injections (XSS, etc.)
        document.title = `SPA: ${this.constructor.name}`;
        this.componentDom.setPostIdCommentId(this.currentProps.postId, this.currentProps.commentId);
        this.componentDom.setCommentText(this.currentProps.commentText);
    };

    refresh = async () => {
        // TODO - do some async work... then call render() when done. Also, potentially let the signal cascade down to subcomponents?
    };

    /** Uses the current (presumably new/updated) props, and the previous state, to calculate what the next state should be. */
    private calculateState = () => {
        if (!this.currentProps.postId || !this.currentProps.commentId) {
            throw new Error('Bad props - missing postId or commentId: ' + JSON.stringify(this.currentProps));
        }
        // TODO ...?
        return new CommentState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

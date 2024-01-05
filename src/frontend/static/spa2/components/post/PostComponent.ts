import IComponent from "../../IComponent";
import PostDom from "./PostDom";
import Props from "../../Props";
import PostState from "./PostState";

export default class PostComponent implements IComponent {
    private readonly componentDom: PostDom;
    private currentProps: Props;
    private mutableState: PostState;

    // private readonly dataFetcher: DataFetcher;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new PostDom();
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
        this.componentDom.setPostId(this.currentProps.postId);
        this.componentDom.setPostDoc("NO POST DOC YET...");
    };

    refresh = async () => {
        // TODO - do some async work... then call render() when done. Also, potentially let the signal cascade down to subcomponents?
    };

    /** Uses the current (presumably new/updated) props, and the previous state, to calculate what the next state should be. */
    private calculateState = () => {
        if (!this.currentProps.postId) {
            throw new Error('Bad props - missing postId: ' + JSON.stringify(this.currentProps));
        }
        // TODO ...?
        return new PostState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

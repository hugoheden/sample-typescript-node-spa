import IComponent from "../../IComponent";
import PostDom from "./PostDom";
import Props from "../../Props";
import PostState from "./PostState";

export default class PostComponent implements IComponent {
    private readonly componentDom: PostDom;
    private state: PostState;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new PostDom();
        this.state = PostComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.state = PostComponent.calculateState(props);
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
    private static calculateState = (props: Props): PostState => {
        // props.postId is a string. "Convert" it to a number (which is in accordance with our business model).
        // If the conversion fails, we will get NaN. We will treat that as an error (TODO)
        const postIdAsNumber: number = parseInt(props.postId);
        return {
            props: {...props},
            docTitle: "Post",
            postId: postIdAsNumber,
            postDoc: "TODO - get post doc from data fetcher, or something"
        };
    };

}

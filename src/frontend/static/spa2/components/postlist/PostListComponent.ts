import IComponent from "../../IComponent";
import PostListDom from "./PostListDom";
import Props from "../../Props";
import PostListState from "./PostListState";

export default class PostListComponent implements IComponent {
    private readonly componentDom: PostListDom;
    private state: PostListState;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new PostListDom();
        this.state = PostListComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.state = PostListComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        this.componentDom.render(this.state);
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props): PostListState => {
        return {
            props: {...props},
            docTitle: "Post List",
            postList: "TODO - get post list from data fetcher, or something"
        };
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

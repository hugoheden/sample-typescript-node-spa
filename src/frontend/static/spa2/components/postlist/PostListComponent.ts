import IComponent from "../../IComponent";
import PostListDom from "./PostListDom";
import Props from "../../Props";
import PostListState from "./PostListState";

export default class PostListComponent implements IComponent {
    private readonly componentDom: PostListDom;
    private mutableState: PostListState;

    // private readonly dataFetcher: DataFetcher;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new PostListDom();
        this.mutableState = PostListComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.mutableState = PostListComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        document.title = `SPA: ${this.constructor.name}`;
        this.componentDom.setPostList("no post list yet...");
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props) => {
        return new PostListState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

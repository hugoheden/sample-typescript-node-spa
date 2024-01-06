import IComponent from "../../IComponent";
import PostDom from "./PostDom";
import Props from "../../Props";
import PostState from "./PostState";

export default class PostComponent implements IComponent {
    private readonly componentDom: PostDom;
    private mutableState: PostState;

    // private readonly dataFetcher: DataFetcher;

    constructor(initialProps: Props /*, dataFetcher: DataFetcher */) {
        this.componentDom = new PostDom();
        this.mutableState = PostComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.mutableState = PostComponent.calculateState(props);
    };

    // /** Called by the parent component when new props are passed in.
    //  */
    // onPropsUpdated_NEW = (props: Props) => {
    //     // Might throw in exceptional cases. If so, we will let it propagate up to a global handler:
    //     this.mutableState = PostComponent.calculateState(props);
    //     // The calculated state might still be an "error state". We might handle that here.
    //     // In any case, the `render` method is then responsible for rendering the error state,
    //     // and ignore the other state (which is now bogus).
    //     if (this.mutableState.getError()) {
    //         // We can let props cascade down to subcomponents even if we have an error. We might decide on a case-by-case basis.
    //         return;
    //     }
    //     // Might throw in exceptional cases. If so, we will let it propagate up to a global handler:
    //     this.cascadeToSubcomponents(props);
    // };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        document.title = `SPA: ${this.constructor.name}`;
        this.componentDom.setPostId(this.mutableState.postId);
        this.componentDom.setPostDoc(this.mutableState.postDoc);
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props): PostState => {
        if (!props.postId) {
            // TODO set error state and return
        }
        // props.postId is a string. "Convert" it to a number (which is in accordance with our business model).
        // If the conversion fails, we will get NaN. We will treat that as an error:
        const postIdAsNumber: number = parseInt(props.postId);
        if (isNaN(postIdAsNumber)) {
            // TODO set error state and return
        }
        const propsCopy: Props = {
            // Defensive copy:
            ...props,
        }
        return new PostState(propsCopy, postIdAsNumber, "TODO - get post doc from data fetcher, or something");
    };

    getComponentDom = () => {
        return this.componentDom;
    }

}

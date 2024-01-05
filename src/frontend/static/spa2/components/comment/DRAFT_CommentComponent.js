import CommentDom from "./CommentDom";

export default class DRAFT_CommentComponent {
    #currentProps
    #mutableState;
    // #domTree;
    #fetcher;
    #commentMetadataComponent;
    #commentDom;

    constructor(initialProps, domContainerElement, fetcher) {
        this.#commentDom = new CommentDom();
        domContainerElement.appendChild(commentDom.getHtmlElement());
        // A "static" subcomponent (meaning it will remain for the lifetime of this component - although its props may change)
        this.#commentMetadataComponent = new CommentMetadataComponent(
            initialProps,
            this.#commentDom.getCommentMetadataElement(),
            fetcher
        );
        this.#fetcher = fetcher;
        this.handleProps(initialProps);
        this.render();
    }

    handleProps = props => {
        this.#currentProps = props;
        this.#mutableState = {
            commentText: "Loading ..." // meaning "not yet fetched"
        };

        // for each subcomponent, call handleProps()
        this.#commentMetadataComponent.handleProps(props);
        // TODO Perhaps we can add/remove subcomponents here, based on the props?
    };

    render = () => {
        // - Update the DOM tree
        // TODO - sanitize/validate initialProps.postId and initialProps.commentId to avoid malicious injections
        this.#commentDom.setPostIdCommentId(this.#mutableState.postId, this.#mutableState.commentId);
        this.#commentDom.setCommentText(this.#mutableState.commentText);
        // for each subcomponent, call render()
        this.#commentMetadataComponent.render();
    }

    refresh = async () => {
        try {
            await this.#longRunningBuildState();
            this.render();
            await this.#commentMetadataComponent.refresh();
        } catch (error) {
            // TODO - show some err msg to the user
            console.error("Error during PostView refresh: ", error);
        }
    };

    #longRunningBuildState = async () => {
        // TODO - error handling (try/catch or similar):
        this.#mutableState.commentText = await this.#fetcher.fetchCommentText(this.#currentProps.postId, this.#currentProps.commentId);
        // TODO Perhaps we can add/remove subcomponents here, based on the fetch result?
        await this.#commentMetadataComponent.longRunningBuildState();
    }


}

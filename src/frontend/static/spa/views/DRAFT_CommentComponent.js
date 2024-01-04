export default class DRAFT_CommentComponent {
    #currentProps
    #mutableState;
    #domTree;
    #fetcher;
    #commentMetadataComponent;

    constructor(initialProps, domContainerElement, fetcher) {
        this.#domTree = domContainerElement.appendChild(DRAFT_CommentComponent.createTemplateDomTree());
        // A "static" subcomponent (meaning it will remain for the lifetime of this component - although its props may change)
        this.#commentMetadataComponent = new CommentMetadataComponent(
            initialProps,
            this.#domTree.querySelector("#comment-metadata"),
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
        this.#domTree.querySelector("#static.postId").textContent = this.#mutableState.postId;
        this.#domTree.querySelector("#static.commentId").textContent = this.#mutableState.commentId;

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

    static createTemplateDomTree = () => {
        // TODO - use an import statement to import the template HTML file. Webpack will bundle it into the bundle.js file(?)
        //  and perhaps remove any source code comments?
        const templateHtml = `
            <div>
                <h1>Comment</h1>
                <p>You are viewing <div id="postId"></div>#<div id="commentId"></div></p>
                
                <!-- author, date/time, likes and stuff, populated by some "CommentMetadataComponent" (TODO) -->
                <div id="comment-metadata">&nbsp;</div>

                <!-- populated by this component (TODO) -->
                <div id="comment-text">Loading...</div>
                
                <!-- list of comments to the comment - populated by this component (TODO)-->
                <div id="comment-comments"></div>
            </div>
        `;
        const smallDomTree = document.createElement("div");
        smallDomTree.outerHTML = templateHtml;
        return smallDomTree;
    }


}

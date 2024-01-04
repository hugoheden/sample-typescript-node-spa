import CommentDom from "./CommentDom";
import Props from "../../Props";
import CommentState from "./CommentState";

export default class CommentComponent {
    private currentProps: Props;
    private mutableState: CommentState;
    private readonly commentDom: CommentDom;
    private readonly fetcher: object;

    // private readonly commentMetadataComponent;

    public constructor(initialProps: Props, domContainerElement: HTMLElement, fetcher: object) {
        this.commentDom = new CommentDom();
        domContainerElement.appendChild(this.commentDom.getHtmlElement());
        // A "static" subcomponent (meaning it will remain for the lifetime of this
        //  component - although its state may change):
        // this.commentMetadataComponent = new CommentMetadataComponent(
        //     initialProps,
        //     this.commentDom.getCommentMetadataElement(),
        //     fetcher
        // );
        this.fetcher = fetcher;
        this.currentProps = initialProps;
        this.mutableState = this.calculateState();
        this.render();
    }

    public handleProps = (props: Props) => {
        this.currentProps = props;
        this.mutableState = this.calculateState();
    };

    private render() {
        this.commentDom.setPostIdCommentId(this.currentProps.postId, this.currentProps.commentId);
        this.commentDom.setCommentText(this.currentProps.commentText);
    }

    private calculateState() {
        return new CommentState();
    }

}

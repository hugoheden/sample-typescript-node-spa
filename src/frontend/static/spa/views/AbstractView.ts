export default abstract class {
    setTitle(title: string): void {
        document.title = title;
    }

    abstract getHtml(): Promise<string>;
}
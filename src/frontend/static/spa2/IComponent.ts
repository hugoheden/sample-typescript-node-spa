import Props from "./Props";

/**
 * When constructed, the component will receive props, from which it should calculate its initial
 * state. The component will typically also create a DOM fragment. Example:
 * <pre>
 * constructor(initialProps: Props) {
 *   this.state = MyComponent.calculateState(initialProps);
 *   // Potentially delegated to a separate class, this will typically be done in the constructor:
 *   this.htmlElement = document.createElement('div'); // A HTMLElement
 *   this.htmlElement.innerHTML = "<html>...</html>";
 * };
 * </pre>
 * Later updates of the props will be passed to the `onPropsUpdated` method, which should calculate
 * a new state, like the constructor.
 */
export default interface IComponent {
    /**
     * Called by the parent component when new props are passed in. Intended for synchronous (and presumably fast) calculation
     * of a new state based on the props. Should not cause side effects other than state updates.
     * <ul>
     *     <li>Must not run async code.</li>
     *     <li>No rendering should be done here.</li>
     *     <li>If this component maintains any subcomponents, then the signal should be passed to those subcomponents.</li>
     *     <li>Must be idempotent.</li>
     *     <li>Depending on the props, subcomponents might be added or deleted here.</li>
     * </ul>
     */
    onPropsUpdated: (props: Props) => void;

    /**
     * Uses the state to render/update the component's DOM. Intended for synchronous (and presumably fast) rendering.
     * This method may be called multiple times whether the component is mounted or not.
     * <ul>
     *   <li>Must not run async code.</li>
     *   <li>If this component maintains any subcomponents, then the signal should be passed to them.</li>
     *   <li>Should be idempotent.</li>
     * </ul>
     */
    render: () => void;

    /**
     * Used for asynchronous (presumably somewhat slow) construction of a new state based on the props, and re-rendering.
     * This is useful for fetching data from a server, for example.
     * <ul>
     *     <li>Async code can be (and will typically) run here.</li>
     *     <li>Rendering can be performed here</li>
     *     <li>If this component maintains any subcomponents, then the signal should be passed to those subcomponents.</li>
     * </ul>
     */
    refresh: () => Promise<void>;

    /**
     * Passed an `Element`, the component should mount its DOM fragment on that element.
     * Does not need to render. (If this method is called without a previous render, it is a bug).
     * Example (potentially delegated to a separate class):
     * <pre>
     *     // this.htmlElement is a HTMLElement, presumably created in the constructor:
     *     parent.replaceChildren(this.htmlElement);
     * <pre>
     * This is also where event listeners should be added, and potentially other side effects.
     */
    mountOn: (parent: Element) => void;

    /**
     * Called when the component is about to be (and before it is) removed from the DOM.
     * <ul>
     *     <li>If this component maintains any subcomponents, then the signal should be passed to those subcomponents.</li>
     *     <li>Any async code should be cancelled</li>
     *     <li>Any event listeners should be removed</li>
     *     <li>Any other side effects set up in `mountOn` should be undone</li>
     * </ul>
     */
    beforeUnmount: () => void;
}
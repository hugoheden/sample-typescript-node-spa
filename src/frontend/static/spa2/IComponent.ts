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
     * `onPropsUpdated` is invoked when the component receives new props from its parent. This method updates the
     * component's internal state based on the new props and prepares any dependent or subcomponents for subsequent
     * rendering. It's a key method for ensuring the component reacts appropriately to prop changes.
     *
     * Key Principles of `onPropsUpdated`:
     * - State Synchronization: Efficiently update the state to reflect the new props, ensuring the component remains responsive.
     * - No Direct DOM Manipulation: Avoid modifying the DOM directly in this method. The purpose of `onPropsUpdated` is to
     *   compute and update the internal state only. Direct DOM manipulations should be deferred until the `render` method
     *   is called. This separation ensures that all components in the subtree have a chance to update their state
     *   before any rendering occurs, maintaining a consistent and predictable rendering flow.
     * - Avoid Async Operations: Focus solely on synchronous operations. Asynchronous tasks, like data fetching, should
     *   be handled in methods designated for async operations like `updateAsync`.
     * - Idempotency: Ensure that calling this method with the same props results in the same state, without side effects.
     * - Subcomponent Updates: Propagate the new props to subcomponents to ensure the entire component tree is consistently updated.
     * - Conditional Logic: Implement logic for adding, removing, or updating subcomponents or internal states based on prop changes.
     * - Async Work Cancellation: If the component has ongoing asynchronous operations (e.g., data fetching), consider
     *   canceling them if the new props invalidate the need for these operations. This helps prevent race conditions and
     *   ensures that the component's state and UI are always up-to-date and relevant.
     * - Resource Management and Cleanup: If the new props lead to substantial changes in the component's state or subcomponents,
     *   perform necessary cleanup to release any resources no longer needed or to reset states to their initial conditions.
     *
     * Example usage:
     * <pre>
     *     onPropsUpdated(props: Props): void {
     *         // Compute and update state based on new props (and potentially the old state):
     *         this.state = MyComponent.calculateState(props, this.state);
     *
     *         // Pass new props to subcomponents
     *         this.subComponents.forEach(subComponent => subComponent.onPropsUpdated(props));
     *
     *         // Handle any specific changes based on the new props
     *         if (props.condition) {
     *             // Adjust subcomponents or state as needed
     *         }
     *     }
     * </pre>
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
     * The `updateAsync` method is responsible for handling asynchronous operations and updating the component's state and UI
     * based on the results of these operations. Common use cases include fetching data from a server or performing
     * computations that require significant processing time.
     *
     * Guidelines:
     * - Asynchronous Operations: Ideal for running any asynchronous code like API calls, data processing, etc.
     * - State Updates: Use the results of async operations to update the component's state. Ensure that state changes are
     *   handled in a way that avoids race conditions and maintains consistency.
     * - Conditional Rendering: Based on the state changes, `updateAsync` may perform rendering. This could include showing
     *   loading indicators, updating the UI with new data, or handling error states.
     * - Subcomponent Management: If the component has subcomponents, propagate the `updateAsync` signal to them. This ensures
     *   that the entire component tree is updated based on new data or state changes.
     * - Error Handling: Implement robust error handling within `updateAsync` to catch and manage exceptions from async
     *   operations, preventing uncaught errors.
     * - Cleanup and Cancellation: In preparation for component unmounting, use the `beforeUnmount` method to cancel
     *   any ongoing asynchronous operations initiated by `updateAsync`. This is essential to prevent side effects or
     *   state updates from operations that complete after the component has been unmounted.
     *
     * Further considerations:
     * - `updateAsync` is generally most effective when the component is already mounted in the DOM, as it often
     *   involves updating the component's state and UI based on asynchronous tasks.
     * - It can also be used in cases where preloading data or preparing the component even before mounting
     *   (but it should be designed to handle both mounted and non-mounted scenarios).
     * - Implement a mechanism to check the component's mounting status if certain operations within
     *   `updateAsync` should only occur when the component is visible or interactable in the DOM.
     *
     * Example usage:
     * <pre>
     *     updateAsync(): Promise<void> {
     *         if (!this.isMounted) {
     *             // Optionally skip or modify operations based on mounting status
     *             return;
     *         }
     *         // Example of fetching data and updating the state
     *         return fetchDataFromApi().then(data => {
     *             this.state = processData(data);
     *             this.render();  // Re-render with the new state
     *         }).catch(error => {
     *             this.handleError(error);
     *         }).finally(() => {
     *             // Perform any final operations after async tasks complete
     *             this.updateSubcomponents();  // Update subcomponents if necessary
     *         });
     *     }
     * </pre>
     */
    updateAsync: () => Promise<void>;

    /**
     * Passed an `Element`, the component should mount its DOM fragment on that element.
     * Does not need to render. (If this method is called without a previous render, it is a bug).
     * Example:
     * <pre>
     *     // this.htmlElement is a HTMLElement, presumably created in the constructor:
     *     parent.replaceChildren(this.htmlElement);
     *     this.onMounted();
     * <pre>
     * This is also where event listeners should be added, and potentially other side effects.
     */
    mountOn: (parent: Element) => void;

    /**
     * Called when the component is successfully mounted in the DOM. This method is intended for
     * side effects and operations that are dependent on the component being part of the live DOM tree.
     *
     * Use cases include:
     * - Initializing third-party libraries that require a DOM element that is mounted in the DOM.
     * - Starting animations or interactions that needs to interact with the DOM, e.g
     *      depend on the component's position or visibility in the DOM.
     * - Initiating asynchronous operations (e.g. fetching data) that are relevant only when the component
     *      is visible to the user (e.g., lazy loading of data)
     *
     * Remember to propagate the `onMounted` call to all subcomponents to ensure they are also aware of being mounted:
     * <pre>
     *     this.subComponents.forEach(component => component.onMounted());
     * </pre>
     *
     * Example usage:
     * <pre>
     *     onMounted(): void {
     *         // Initialize a library requiring a DOM element
     *         this.initializeSomeLibrary(this.htmlElement);
     *
     *         // Start a DOM-dependent animation
     *         this.startAnimation();
     *
     *         // Fetch data for visible components
     *         if (this.isVisible()) {
     *             this.fetchData();
     *         }
     *
     *         // Notify subcomponents
     *         this.subComponents.forEach(component => component.onMounted());
     *     }
     * </pre>
     */
    onMounted: () => void;

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
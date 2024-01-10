import Props from "./Props";

/**
 * Interface for UI components.
 * <h1>Introduction</h1>
 * <p>
 *     The IComponent interface is at the core of our application's UI architecture, defining the essential lifecycle methods
 *     and interactions for each UI component. This interface is designed to ensure a consistent and predictable behavior
 *     for components, providing a structured lifecycle that components follow from creation to destruction.
 *     It facilitates clear state management, efficient rendering, and responsive interaction with user inputs and
 *     asynchronous processes. By adhering to this interface, components within our application can efficiently manage
 *     their state, handle updates, and interact seamlessly within the larger UI ecosystem.
 * <p>
 *     The UI components are expected to live in a tree, with parent components owning and managing child components.
 *
 * <h1>Lifecycle, overview</h1>
 * <p>
 * The lifecycle of a UI component is constituted by certain operation sequences, described in the following.
 * This constitutes a contract of what calls a child component can expect from its parent component,
 * and thus what a parent component is responsible for in regard to its child components.
 *
 * <h2>The initialization sequence</h2>
 * A UI component shall initially experience the follow initialization sequence of calls:
 * <ol>
 *     <li>constructor</li>
 *     <li>render</li>
 *     <li>onPropsAsync</li>
 * </ol>
 *
 * <h2>The update sequences</h2>
 * After the initialization sequence, the component will experience a number of <i>update</i> sequences. There are
 * two types - the onProps sequence and the onMounted sequence. The onProps sequence occurs when the component
 * receives new props. The onMounted sequence occurs when the component is mounted in the DOM tree.
 * <h3>The onProps sequence</h3>
 * <ol>
 *     <li>onProps</li>
 *     <li>render</li>
 *     <li>onPropsAsync</li>
 * </ol>
 * <h3>The onMounted sequence</h3>
 * <ol>
 *     <li>onMounted</li>
 *     <li>render</li>
 *     <li>onPropsAsync</li>
 * </ol>
 *
 * <h2>The sequence pattern</h2>
 * <ul>
 *     <li>
 *         You will notice that each sequence is constituted by:
 *         <ol>
 *             <li>
 *                 a method for synchronously handling a relevant change (props our mount), typically used for fast calculations
 *                 of new state.
 *             <li>
 *                 a render call (to update the DOM)
 *             <li>
 *                 an async method for performing any long-running async operations that may be needed
 *          </ol>
 *     <li>
 *         Note that the initialization sequence is similar in nature to the onProps sequence.
 *     <li>
 *         The UI components live in a tree, with parent components managing child components. Each method call within a
 *         sequence is propagated down the tree to all subcomponents, before the next method call is made and propagated.
 *         The main rationale for this is the `render` call. It shall occur after the "relevant change (props our mount)"
 *         has finished cascading down the component tree. This ensures that the component tree is in a fully consistent
 *         state when rendering starts. The rendering is then done "all at once" in one synchronous flow down the component
 *         tree, which might offer performance optimizations for the runtime/browser (such as queuing/batching DOM updates).
 * </ul>
 *
 * <h2>Rules for sequences</h2>
 * <ul>
 *     <li>
 *         Each of the method calls in a sequence is shall be called exactly once, and in the
 *         order specified.
 *     <li>
 *         Each sequence is executed atomically. This means it runs as a complete unit, without interruption from other method calls.
 *         The exception is the getHTMLElement method, which can be called at any point.
 *     <li>These sequences can occur in any order, and any number of times. So, after initialization,
 *     the component may experience
 *     <ol>
 *          <li>the onProps sequence or the onMounted sequence</li>
 *          <li>the onProps sequence or the onMounted sequence</li>
 *          <li>the onProps sequence or the onMounted sequence</li>
 *          <li>ad infinitum</li>
 *      </ol>
 *      <li>The onMounted sequence shall never occur two without a `beforeUnmount` call at some point in between.</li>
 * </ul>
 *
 */
export default interface IComponent2 {

    onProps: (props: Props) => void;
    onPropsAsync: () => Promise<void>;

    onMounted: () => void;
    onMountedAsync: () => Promise<void>;
    beforeUnmount: () => void;

    getHTMLElement: () => HTMLElement;
    render: () => void;
}
import IComponent from "../../IComponent";
import DashboardDom from "./DashboardDom";
import Props from "../../Props";
import DashboardState from "./DashboardState";

export default class DashboardComponent implements IComponent {
    private readonly componentDom: DashboardDom;
    private state: DashboardState;

    // This particular component has a constructor that accepts a no-param. It is a special
    // component that can be used _without_ props - as a "default" or "fallback" component
    // if no props were available to the application. (If this is used anywhere
    // or not is another matter.)
    constructor(initialProps: Props = {}) {
        this.componentDom = new DashboardDom();
        this.state = DashboardComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.state = DashboardComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        this.componentDom.render(this.state);
    };

    updateAsync = async () => {
    };

    mountOn = (parent: Element) => {
        this.componentDom.mountOn(parent);
    }

    onMounted = () => {
    }

    beforeUnmount = () => {
    }

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props): DashboardState => {
        return {
            props: {...props},
            docTitle: "Dashboard"
        };
    };

}

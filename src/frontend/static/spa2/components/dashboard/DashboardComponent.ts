import IComponent from "../../IComponent";
import DashboardDom from "./DashboardDom";
import Props from "../../Props";
import DashboardState from "./DashboardState";

export default class DashboardComponent implements IComponent {
    private readonly componentDom: DashboardDom;
    private mutableState: DashboardState;

    // This particular component has a constructor that accepts a no-param. It is a special component that can be
    // used _without_ props - as a "default" or "fallback" component if no props were available to the application.
    constructor(initialProps: Props = {}) {
        this.componentDom = new DashboardDom();
        this.mutableState = DashboardComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        this.mutableState = DashboardComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        document.title = `SPA: ${this.constructor.name}`;
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props) => {
        return new DashboardState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }


}

import IComponent from "../../IComponent";
import DashboardDom from "./DashboardDom";
import Props from "../../Props";
import DashboardState from "./DashboardState";

export default class DashboardComponent implements IComponent {
    private currentProps: Props;
    private mutableState: DashboardState;
    private readonly dashboardDom: DashboardDom;

    // This particular component has a constructor that accepts a no-param. It is a special component that can be
    // used _without_ props - as a "default" or "fallback" component if no props were available to the application.
    constructor(initialProps: Props = {}) {
        this.dashboardDom = new DashboardDom();
        this.currentProps = initialProps;
        this.mutableState = this.calculateState();
        this.render();
    }

    /** Called by the parent component when new props are passed in.
     * Could also be called by the component itself, if it needs to update its own props.
     * */
    onPropsUpdated = (props: Props) => {
        this.currentProps = props;
        this.mutableState = this.calculateState();
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
    };

    refresh = async () => {
        // TODO - do some async work... then call render() when done. Also, potentially let the signal cascade down to subcomponents?
    };

    /** Uses the current (presumably new/updated) props, and the previous state, to calculate what the next state should be. */
    private calculateState() {
        // TODO ...?
        return new DashboardState();
    }

    getComponentDom = () => {
        return this.dashboardDom;
    }


}

import IComponent from "../../IComponent";
import SettingsDom from "./SettingsDom";
import Props from "../../Props";
import SettingsState from "./SettingsState";

export default class SettingsComponent implements IComponent {
    private readonly componentDom: SettingsDom;
    private state: SettingsState;

    // This particular component has a constructor that accepts a no-param. It is a special component that can be
    // used _without_ props - as a "default" or "fallback" component if no props were available to the application.
    constructor(initialProps: Props) {
        this.componentDom = new SettingsDom();
        this.state = SettingsComponent.calculateState(initialProps);
    }

    /** Called by the parent component when new props are passed in.
     */
    onPropsUpdated = (props: Props) => {
        console.log("SettingsComponent.onPropsUpdated", props);
        throw new Error("blah blah problem");
        this.state = SettingsComponent.calculateState(props);
    };


    /** Uses the current props and state to render/update the component's DOM. */
    render = () => {
        this.componentDom.render(this.state);
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and perhaps the previous state, to calculate what the next state should be. */
    private static calculateState = (props: Props): SettingsState => {
        return {
            props: {...props},
            docTitle: "Settings"
        };
    };

    getComponentDom = () => {
        return this.componentDom;
    }


}

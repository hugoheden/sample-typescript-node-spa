import IComponent from "../../IComponent";
import SettingsDom from "./SettingsDom";
import Props from "../../Props";
import SettingsState from "./SettingsState";

export default class SettingsComponent implements IComponent {
    private readonly componentDom: SettingsDom;
    private currentProps: Props;
    private mutableState: SettingsState;

    // This particular component has a constructor that accepts a no-param. It is a special component that can be
    // used _without_ props - as a "default" or "fallback" component if no props were available to the application.
    constructor(initialProps: Props = {}) {
        this.componentDom = new SettingsDom();
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
        // TODO - this.currentProps is user input. Validate to avoid malicious injections (XSS, etc.)
        console.log('SettingsComponent.render()', this.currentProps, this.constructor.name);
        document.title = `SPA: ${this.constructor.name}`;
    };

    refresh = async () => {
    };

    /** Uses the current (presumably new/updated) props, and the previous state, to calculate what the next state should be. */
    private calculateState = () => {
        // TODO ...?
        return new SettingsState();
    };

    getComponentDom = () => {
        return this.componentDom;
    }


}

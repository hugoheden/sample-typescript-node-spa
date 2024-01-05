import Props from "./Props";
import IComponentDom from "./IComponentDom";

export default interface IComponent {
    onPropsUpdated: (props: Props) => void;
    render: () => void;
    // TODO - some other name... reload? refreshData? fetchAndRender? asyncUpdate? updateAsync? updateAndRender?
    //  refreshAsync? refreshAndRender?
    refresh: () => Promise<void>;
    getComponentDom: () => IComponentDom;
}

import "../css/index.css";
import IComponent from "./IComponent";
import Props from "./Props";


// The Router is where we define the routes and the request handlers for those routes.
class Route<ComponentType extends IComponent> {
    // The `new` indicates that the componentConstructor is not any old function, but a _constructor_ function (for ComponentType).
    // Such a constructor function can be referenced (not called) by just writing a class name, like `componentConstructor = Dashboard`.
    private readonly componentConstructor: new (p: Props) => ComponentType;
    // routePath is just for logging when debugging:
    private readonly routePath: string;
    private readonly pathnameMatcher: RegExp;
    private readonly parameterNames: string[];
    // Lazily constructed (hence potentially undefined, and mutable):
    private component: ComponentType | undefined;

    constructor(routePath: string, componentConstructor: new (p: Props) => ComponentType) {
        this.routePath = routePath;
        this.componentConstructor = componentConstructor;
        this.pathnameMatcher = Route.constructPathnameRegex(routePath);
        this.parameterNames = Route.extractParameterNames(routePath);
    }

    /**
     * The returned array will contain the names of the route parameters. For example, if the path is
     * "/posts/:id/comments/:comment_id", then the parameterNames array will contain the strings "id" and "comment_id".
     */
    private static extractParameterNames = (routePath: string): string[] =>
        Array.from(routePath.matchAll(/:(\w+)/g)).map(result => result[1]);

    /**
     * Construct a regex from a routePath such as "/", or "/posts/:id", or "/posts/:id/comments/:comment_id".
     * <br>
     * For example, given the routerPath /posts/:id/comments/:comment_id, the regex will look like this: /^\/posts\/(.+)\/comments\/(.+)$/
     * <br>
     * The regex will be used to match a user pathname to a route. For example, if the user pathname is "/posts/123/comments/456",
     * then the regex constructed from the path "/posts/:id/comments/:comment_id" will match, and the result will
     * be an array of the form ["/posts/123/comments/456", "123", "456"].
     */
    private static constructPathnameRegex = (path: string): RegExp =>
        new RegExp("^" + path.replace(/\//g, "\\/").replace(/:\w+/g, "([^/]+)") + "$");

    /**
     * Match a user pathname, like "/posts/123/comments/456", to this route. If it did not match, null is returned.
     * If it was a match, on the other hand, a "parameter-object" is created, such as: {id: "123", comment_id: "456"},
     * where the keys are the names of the route parameters, and the values are the values of the route parameters.
     * Then the component of this route is updated with parameter-object, and returned.
     */
    getComponentIfMatching = (pathname: string): null | ComponentType => {
        const match = pathname.match(this.pathnameMatcher);
        if (match === null) {
            return null;
        }
        // remove first element from ["/posts/123/comments/456", "123", "456"]
        match.shift();
        if (match.length !== this.parameterNames.length) {
            throw new Error("match.length !== this.parameterNames.length");
        }
        // Convert the array of route parameters to an object, like this: {id: "123", comment_id: "456"}:
        const paramsArray = this.parameterNames.map((key, i) => {
            return [key, match[i]];
        });
        const propsObject: Props = Object.fromEntries(paramsArray);
        if (this.component === undefined) {
            this.component = new this.componentConstructor(propsObject);
        } else {
            this.component.onPropsUpdated(propsObject);
        }
        return this.component;
    }
}

export interface Routes {
    containerDomElement: HTMLElement,
    defaultComponent: new () => IComponent,
    // An array with tuples of the form ["/posts/:id", PostComponent]:
    routes: [string, new (p: Props) => IComponent][],
}

export default class Router {
    private readonly routes: Route<IComponent>[];
    // If no matching route is found, then this default component will be used:
    private readonly defaultComponent;
    private readonly componentContainerElement: HTMLElement;

    constructor(routes: Routes) {
        const routesSpec: Routes = routes;
        this.routes = this.buildRoutes(routesSpec);
        this.defaultComponent = routesSpec.defaultComponent;
        this.componentContainerElement = routesSpec.containerDomElement;
    }

    buildRoutes = (routesSpec: Routes): Route<IComponent>[] => {
        return routesSpec.routes.map(([routePath, componentConstructor]) => {
            return new Route(routePath, componentConstructor);
        });
    }

    /**
     * Given a pathname, like "/posts/123/comments/456", return the component that matches that pathname.
     * If no component matches, then the default component is returned.
     */
    private getMatchingComponent = (pathname: string): IComponent => {
        for (const route of this.routes) {
            const component = route.getComponentIfMatching(pathname);
            if (component !== null) {
                return component;
            }
        }
        // Default if no match:
        return new this.defaultComponent();
    }

    /**
     * This method is called when the user navigates to a new URL, or when the user refreshes the page.
     */
    route = async () => {
        // If pathname is not "/", then remove any trailing slash:
        const pathname = window.location.pathname;
        if (pathname !== "/" && pathname.endsWith("/")) {
            // Hmm, should we "redirect" to the new URL? Maybe that should be the job of the server, not the client?
            // What about search engine indexing...? Will they create duplicate indices - one for the path _with_ the
            // trailing slash, and one for the path _without_ it? If so, then that's bad for SEO...?
            // Does it help if we redirect here? I have no idea... Confused.
            window.location.replace(pathname.slice(0, -1));
            return;
        }
        const component = this.getMatchingComponent(pathname);
        const containerElement = <Element>document.querySelector("#app");
        component.render();
        component.getComponentDom().mountOn(this.componentContainerElement);
        component.refresh();
    }
}

import "../css/index.css";
import IComponent from "./IComponent";
import Props from "./Props";

// The `new` indicates that the componentConstructor is not any old function, but a _constructor_ function (for IComponent).
type ComponentConstructor = new (p: Props) => IComponent;
type RouteTarget = ComponentConstructor | IComponent;
// A route-path can be associated with either a component constructor or an already pre-instantiated component.
// Example (with a constructor): ["/posts/:id", PostComponent]:
// It is up to the caller which is suitable.
// If a ComponentConstructor is passed, the Router will instantiate the component lazily, not until needed.
// A pre-instantiated component is probably useful in rare corner cases, where it is important that
// the component can perform time-consuming async work even before actually being mounted in the DOM tree.
type RouteEntry = [string, RouteTarget];

export interface Routes {
    containerDomElement: HTMLElement,
    // TODO - defaultComponent: consider allowing a constructor (to enable lazy construction):
    //  IComponent | new () => IComponent
    defaultComponent: IComponent,
    routes: RouteEntry[],
}

class Route {
    private routeTarget: RouteTarget;
    // routePath is just for logging when debugging:
    private readonly routePath: string;
    private readonly pathnameMatcher: RegExp;
    private readonly parameterNames: string[];

    constructor(routePath: string, routeTarget: RouteTarget) {
        this.routePath = routePath;
        this.routeTarget = routeTarget;
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
    ifMatchingGetUpdatedComponent = (pathname: string): null | IComponent => {
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
        if (typeof this.routeTarget === 'function') {
            this.routeTarget = new this.routeTarget(propsObject);
        } else {
            this.routeTarget.onPropsUpdated(propsObject);
        }
        return this.routeTarget;
    }
}


// The Router is where we define the routes and the request handlers for those routes.
export default class Router {
    private readonly routes: Route[];
    // If no matching route is found, then this default component will be used:
    private readonly defaultComponent: IComponent;
    private readonly componentContainerElement: HTMLElement;

    constructor(routes: Routes) {
        this.routes = this.buildRoutes(routes.routes);
        this.defaultComponent = routes.defaultComponent;
        this.componentContainerElement = routes.containerDomElement;
    }

    private buildRoutes = (r: [string, RouteTarget][]): Route[] => {
        return r.map(([routePath, routeTarget]) => {
            return new Route(routePath, routeTarget);
        });
    }

    /**
     * Given a pathname, like "/posts/123/comments/456", return the component that matches that pathname.
     * If no component matches, then the default component is returned.
     */
    private updateMatchingComponent = (pathname: string): IComponent => {
        for (const route of this.routes) {
            const component = route.ifMatchingGetUpdatedComponent(pathname);
            if (component !== null) {
                return component;
            }
        }
        // Default if no match:
        return this.defaultComponent;
    }

    /**
     * This method is called when the user navigates to a new URL, or when the user refreshes the page.
     */
    route = () => {
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
        const component = this.updateMatchingComponent(pathname);
        // TODO TODO - prev component: `beforeUnmount` and do unmount
        component.render();
        component.mountOn(this.componentContainerElement);
        component.updateAsync();
    }
}

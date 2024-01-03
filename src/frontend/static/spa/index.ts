import AbstractView from "./views/AbstractView";
import ViewParameters from "./views/ViewParamenters";
import Dashboard from "./views/Dashboard";
import Posts from "./views/Posts";
import PostView from "./views/PostView";
import Settings from "./views/Settings";
import "../css/index.css";

// This file is the entry point for the frontend (i.e client side) single-page application.
// It's where we define the routes and the request handlers for those routes.
class Route<ViewType extends AbstractView> {
    // The `new` indicates that the viewConstructor is not any old function, but a _constructor_ function (for ViewType).
    // Such a constructor function can be referenced (not called) by just writing a class name, like `viewConstructor = Dashboard`.
    private readonly viewConstructor: new (vp: ViewParameters) => ViewType;
    // routePath is just for logging when debugging:
    private readonly routePath: string;
    private readonly pathnameMatcher: RegExp;
    private readonly parameterNames: string[];

    constructor(routePath: string, viewConstructor: new (vp: ViewParameters) => ViewType) {
        this.routePath = routePath;
        this.viewConstructor = viewConstructor;
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
     * If it was a match, on the other hand, a "parameter-object" is returned, such as: {id: "123", comment_id: "456"},
     * where the keys are the names of the route parameters, and the values are the values of the route parameters.
     */
    matchPathnameToView = (pathname: string): null | ViewType => {
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
        const paramsObject: ViewParameters = Object.fromEntries(paramsArray);
        return new this.viewConstructor(paramsObject);
    }
}

class Router {
    private readonly routes: Route<AbstractView>[];
    // If no matching route is found, then this default view will be used:
    private readonly defaultView = Dashboard;

    constructor() {
        this.routes = [
            new Route("/", Dashboard),
            new Route("/posts", Posts),
            new Route("/posts/:id", PostView),
            new Route("/posts/:id/comments", PostView),
            new Route("/posts/:id/comments/:commentId", PostView),
            new Route("/settings", Settings)
        ];
    }

    private selectView = (pathname: string): AbstractView => {
        for (const route of this.routes) {
            const view = route.matchPathnameToView(pathname);
            if (view !== null) {
                return view;
            }
        }
        // Default if no match:
        return new this.defaultView();
    }

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
        const view = this.selectView(pathname);
        const element = document.querySelector("#app");
        if (element !== null) {
            element.innerHTML = await view.getHtml();
        }

    }
}

const router = new Router();

window.addEventListener("popstate", _ => {
    router.route();
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target instanceof HTMLLinkElement && e.target.matches("[data-link]")) {
            // Call preventDefault() to prevent the default action of the anchor tag, which is for the browser to make an
            // HTTP GET request for the URL specified in the href attribute. This is an SPA, so we don't want that -
            // we will handle the navigation ourselves.
            e.preventDefault();
            history.pushState(null, "", e.target.href);
            router.route();
        }
    });
    router.route();
});

// // For debugging, understanding whether a page is reloading (which is typically what we do _not_ want in an SPA).
// // (See https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
// window.addEventListener("beforeunload", function (e) {
//     // Cancel the event as stated by the standard, to see the "Are you sure you want to leave this page?" message:
//     e.preventDefault();
//     // Chrome requires returnValue to be set....(?)
//     e.returnValue = '';
// });


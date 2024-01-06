import "../css/index.css";
import navigationHtml from './navigation/Navigation.fragment.html'
import Router from "./Router";
import DashboardComponent from "./components/dashboard/DashboardComponent";
import SettingsComponent from "./components/settings/SettingsComponent";
import PostListComponent from "./components/postlist/PostListComponent";
import PostComponent from "./components/post/PostComponent";
import CommentComponent from "./components/comment/CommentComponent";


// This file is the entry point for the frontend (i.e. client side) single-page application.
const router = new Router({
    containerDomElement: <HTMLElement>document.querySelector("#app"),
    defaultComponent: DashboardComponent,
    routes: [
        ["/", DashboardComponent],
        ["/settings", SettingsComponent],
        ["/posts", PostListComponent],
        ["/posts/:postId", PostComponent],
        ["/posts/:postId/comments/:commentId", CommentComponent],
    ],
});

interface ErrorData {
    type: 'onerror' | 'onunhandledrejection';
    message: string;
    source?: string;
    lineno?: number;
    colno?: number;
    stack?: string;
    url: string;
    timestamp: string;
}

const sendErrorDetails = (errorData: ErrorData) => {
    try {
        const payload = JSON.stringify(errorData);
        // TODO TODO - implement endpoint in backend.
        if (!navigator.sendBeacon('/api/logError', payload)) {
            // Fallback logging if sendBeacon fails (e.g., due to size limitations)
            console.error('sendBeacon failed, logging to console instead', errorData);
        }
    } catch (logError) {
        console.error('Error logging failed:', logError);
    }
};

window.onerror = (message, source, lineno, colno, error) => {
    let errorMessage: string;
    if (typeof message === 'string') {
        errorMessage = message;
    } else if (message instanceof ErrorEvent) {
        // ErrorEvent provides more detailed error information
        errorMessage = message.message;
    } else {
        // For generic Event objects, provide a standard message
        errorMessage = "An error occurred";
    }
    const errorData: ErrorData = {
        type: 'onerror',
        message: errorMessage,
        source,
        lineno,
        colno,
        stack: error?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };
    sendErrorDetails(errorData);
    // TODO TODO - make sure the /error page is actually routed/displayed correctly.
    window.location.href = "/error";
};

window.onunhandledrejection = event => {
    const errorData: ErrorData = {
        type: 'onunhandledrejection',
        message: event.reason?.message || 'No error message',
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };
    sendErrorDetails(errorData);
    window.location.href = "/error";
};

window.addEventListener("popstate", _ => {
    router.route();
});

document.addEventListener("DOMContentLoaded", () => {
    document.body.addEventListener("click", e => {
        if (e.target instanceof HTMLAnchorElement && e.target.matches("[data-link]")) {
            // Call preventDefault() to prevent the default action of the anchor tag, which is for the browser to make an
            // HTTP GET request for the URL specified in the href attribute. This is an SPA, so we don't want that -
            // we will handle the navigation ourselves.
            e.preventDefault();
            history.pushState(null, "", e.target.href);
            router.route();
        }
    });
    (<HTMLElement>document.querySelector("#nav")).innerHTML = navigationHtml;
    router.route();
});

// For debugging, understanding whether a page is reloading (which is typically what we do _not_ want in an SPA).
// (See https://developer.mozilla.org/en-US/docs/Web/API/Window/beforeunload_event)
window.addEventListener("beforeunload", function (e) {
    // Cancel the event as stated by the standard, to see the "Are you sure you want to leave this page?" message:
    e.preventDefault();
    // Chrome requires returnValue to be set....(?)
    e.returnValue = '';
});


import "../css/index.css";
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

window.addEventListener("popstate", _ => {
    console.log("popstate");
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


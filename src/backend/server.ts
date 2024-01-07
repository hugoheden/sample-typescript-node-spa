import path from 'path';

import express, {Express, NextFunction, Request, Response} from "express";

const distPath: string = process.env.DIST_PATH || path.resolve(process.cwd(), "dist");
const port: string = process.env.PORT || "3000";

const app: Express = express();

// Custom middleware to log requests
function logRequests(req: Request, res: Response, next: NextFunction): void {
    console.log("Received request for:", req.url);
    next(); // Pass control to the next handler
}

/* Requests prefixed with /static: Log, and serve the file from our "frontend/static" directory */
app.use("/static", logRequests, express.static(path.resolve(distPath, "frontend", "static")));

/* Requests for /error: Serve a literal html string */
app.get("/error", (req: Request, res: Response) => {
    // TODO: This is just a placeholder. Implement a proper error page.
    // User Guidance: Ensure that the error page provides clear guidance to the user. This might include information on
    // how to report the error, links to return to the home page or contact support, and reassurance that the error has
    // been logged.
    //
    // Logging and Monitoring: Implement server-side logging for these critical errors. This allows you to monitor and
    // analyze the causes of such failures and address them proactively.
    //
    // Design and Messaging: While the error page might have a different look and feel from the SPA, strive to make
    // it user-friendly and informative. A well-designed error page can mitigate the impact of the error on the user experience.
    res.send(
        "<h1>Something went wrong.</h1>" +
        "<p>Sorry about that. It is not your fault, it is ours. The error has been reported, and we aim to fix it as soon as possible.</p>" +
        "<p>You can try again by hitting the back button. Or go to the <a href='/'>start page</a>.</p>"
    );
});

app.post('/api/log-error', express.json({type: '*/*'}), (req, res) => {
    const errorData = req.body; // The data sent from the client
    // The errorData sent by the frontend is a JSON string, so we might want to parse that here. Or just log the whole thing:
    console.log('Error received:', errorData);
    // Respond with a success status
    res.status(200).send('Error logged');
});

app.get('/api/rnd', (req: Request, res: Response) => {
    const randomNumber = Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
    res.json({rnd: randomNumber});
});

app.get("/*", (req: Request, res: Response) => {
    console.log("req.url: " + req.url);
    res.sendFile(path.resolve(distPath, "frontend", "index.html"));
});

app.listen(port, () => console.log("Server running... " + new Date().toUTCString()));


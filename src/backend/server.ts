import path from 'path';

import express, {NextFunction, Request, Response} from "express";

const distPath = process.env.DIST_PATH || path.resolve(process.cwd(), "dist");

const app = express();

// Custom middleware to log requests
function logRequests(req: Request, res: Response, next: NextFunction) {
    console.log("Received request for:", req.url);
    next(); // Pass control to the next handler
}

/* Requests prefixed with /static: Log, and serve the file from our "frontend/static" directory */
app.use("/static", logRequests, express.static(path.resolve(distPath, "frontend", "static")));

app.get('/api/rnd', (req: Request, res: Response) => {
    const randomNumber = Math.floor(Math.random() * 100); // Generate a random number between 0 and 99
    res.json({rnd: randomNumber});
});

app.get("/*", (req: Request, res: Response) => {
    console.log("req.url: " + req.url);
    res.sendFile(path.resolve(distPath, "frontend", "index.html"));
});

app.listen(process.env.PORT || 3000, () => console.log("Server running... " + new Date().toUTCString()));


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

const buildErrorData_onerror = (message: Event | string, source: string | undefined, lineno: number | undefined, colno: number | undefined, error: Error | undefined) => {
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
    return errorData;
};

const buildErrorData_onunhandledrejection = (event: PromiseRejectionEvent) => {
    const errorData: ErrorData = {
        type: 'onunhandledrejection',
        message: event.reason?.message || 'No error message',
        stack: event.reason?.stack,
        url: window.location.href,
        timestamp: new Date().toISOString()
    };
    return errorData;
};

const sendErrorDetails = (errorData: ErrorData, url: string) => {
    const failedToLogError = 'ERROR: Failed to log fatal error to backend.';
    try {
        const payload = JSON.stringify(errorData);
        if (!navigator.sendBeacon(url, payload)) {
            // Fallback logging if sendBeacon fails (e.g., due to size limitations)
            console.error(failedToLogError);
            return;
        }
    } catch (logError) {
        console.error(failedToLogError);
    }
};

/**
 * Register global error handlers to log fatal errors to the backend and redirect to an error page.
 * By "fatal errors", we mean errors that are not handled by the application. Any error that is not handled by the
 * application is a bug.
 * <br/>
 * The error handlers are:
 * <ul>
 *     <li>window.onerror</li>
 *     <li>window.onunhandledrejection</li>
 * </ul>
 * <br/>
 * This function does not create the error page, that is up to the application. This function only redirects to the
 * error page.
 *
 */
export default function registerFatalErrorHandlers(backendLogPath: string, errorPagePath: string) {
    const handleError = (errorData: ErrorData) => {
        sendErrorDetails(errorData, backendLogPath);
        window.location.href = errorPagePath;
    };

    window.onerror = (message: Event | string, source: string | undefined, lineno: number | undefined, colno: number | undefined, error: Error | undefined) => {
        const errorData = buildErrorData_onerror(message, source, lineno, colno, error);
        handleError(errorData);
        // TODO return false if development mode, otherwise return true
        return true; // Prevent the default browser error handler from running (which logs the error to the console)
    };

    window.onunhandledrejection = (event: PromiseRejectionEvent) => {
        // event.preventDefault();
        const errorData = buildErrorData_onunhandledrejection(event);
        handleError(errorData);
        // TODO do this only in production mode.
        event.preventDefault(); // Prevent the default browser error handler from running (which logs the error to the console)
    };
}


// Enables TypeScript to import HTML files as strings without complaining.
// Example: import htmlString from './some.html'
declare module '*.html' {
    const value: string;
    export default value
}

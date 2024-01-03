const path = require('path');

// DRAFT
// Intended to check whether the backend code
// npm install -g webpack-cli webpack
// npm prune --production
// webpack --config webpack.stupid.backend.js

// There has to be a better way though...?
module.exports = {
    mode: 'production',
    entry: './dist/backend/server.js',
    output: {
        path: path.join(__dirname, 'webpack-trash'),
        // publicPath: '/',
        filename: 'trash.js',
    },
    target: 'node',
};

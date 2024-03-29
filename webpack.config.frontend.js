const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
    mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
    entry: './src/frontend/static/spa2/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: 'ts-loader',
                    options: {
                        configFile: path.resolve(__dirname, 'src', 'frontend', 'tsconfig.json'),
                    },
                },
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
            {
                test: /\.html$/,
                use: ['html-loader']
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'], // Resolve these extensions
    },
    output: {
        path: path.resolve(__dirname, 'dist', 'frontend', 'static'), // Output folder
        filename: 'js/bundle.js', // Output bundle file inside js folder
        publicPath: '/static/'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/frontend/index.html', // Path to src template
            filename: '../index.html', // Output file,
            publicPath: '/static/'
        })
    ],
    devServer: {
        static: {
            directory: path.resolve(__dirname, 'dist', 'frontend', 'static'),
        },
        compress: true,
        port: 9000,
        proxy: {
            '!/static/**': {
                target: 'http://localhost:3000', // URL of your backend server
                changeOrigin: true,
            },
        },
    },
};
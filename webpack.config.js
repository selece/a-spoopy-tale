const html_webpack_plugin = require('html-webpack-plugin');
const clean_webpack_plugin = require('clean-webpack-plugin');

module.exports = {
    entry: {
        bundle: __dirname + '\\src\\index.jsx'
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            },
            {
                test: /\.scss$/,
                exclude: /node_modules/,
                loader: 'sass-loader'
            }
        ],
        rules: [
            {
                test: /\.(s*)css$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: 'babel-loader'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '\\build',
    },
    plugins: [
        new clean_webpack_plugin(
            ['build/*.*'],
            {
                verbose: true,
                watch: true,
                beforeEmit: true
            }
        ),
        new html_webpack_plugin({
            template: __dirname + '\\src\\index.html',
            filename: 'index.html',
            inject: 'body'
        })
    ],
    resolve: {
        // requirejs aliases for webpack
        alias: {
            'jquery': __dirname + '\\src\\vendor\\jquery.min',
            'underscore': __dirname + '\\src\\vendor\\underscore.min',

            'spoopy.engine': __dirname + '\\src\\js\\spoopy.engine.js',
            'spoopy.rooms': __dirname + '\\src\\js\\spoopy.rooms.js',
            'spoopy.player': __dirname + '\\src\\js\\spoopy.player.js',
            'spoopy.items': __dirname + '\\src\\js\\spoopy.items.js',
        }
    },
    cache: true,
    devtool: 'source-map',
};
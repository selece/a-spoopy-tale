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
    cache: true,
    devtool: 'source-map',
};
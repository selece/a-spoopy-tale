const html_webpack_plugin = require('html-webpack-plugin');
const html_webpack_plugin_config = new html_webpack_plugin({
    template: __dirname + '\\src\\index.html',
    filename: 'index.html',
    inject: 'body'
});

module.exports = {
    entry: {
        spoopy_gui: __dirname + '\\src\\react\\spoopy.jsx',
        spoopy_game: __dirname + '\\src\\js\\spoopy.game.js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx*$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    output: {
        filename: '[name].js',
        path: __dirname + '\\build',
    },
    plugins: [
        html_webpack_plugin_config
    ],
    resolve: {
        // modulesDirectories: [__dirname + '\\src\\vendor'],
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
const HTMLPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  entry: {
    bundle: `${__dirname}/src/index.jsx`
  },
  module: {
    rules: [
      {
        test: /\.(s*)css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'sass-loader' }
        ]
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'html-loader',
            options: { minimize: true }
          }
        ]
      },
      {
        test: /\.(js|jsx)$/,
        exclude: [/node_modules/, /\.spec.(js|jsx)$/],
        use: [
          {
            loader: 'babel-loader'
          }
        ]
      }
    ]
  },
  output: {
    filename: '[name].js',
    path: `${__dirname}/build`
  },
  plugins: [
    new CleanPlugin(['build/*.*'], {
      verbose: true,
      watch: true,
      beforeEmit: true
    }),
    new HTMLPlugin({
      template: `${__dirname}/src/index.html`,
      filename: 'index.html',
      inject: 'body'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  cache: true,
  devServer: {
    hot: true,
    open: true,
    compress: true
  },
  devtool: 'inline-source-map',
  resolve: {
    extensions: ['.js', '.jsx']
  },
  mode: 'development'
};

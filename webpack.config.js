const HtmlWebPackPlugin = require("html-webpack-plugin");
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv')

// only filter for variables in dotenv
const env = dotenv.config().parsed;

const envKeys = Object.keys(env).reduce((prev, next) => {
  prev[`process.env.${next}`] = JSON.stringify(env[next]);
  return prev;
}, {});

// you need this to inject html
const htmlPlugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html"
});

const config = {
  entry: { // source files
    polyfill: 'babel-polyfill',
    'index': './src/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: '[name].bundle.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src')
    }
  },
  module: { // here be loaders
    rules: [
      { // look for js(x) files => babelify
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      },
      {
        type: 'javascript/auto',
        test: /\.json$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: "./assets/[name].[ext]"
            }
          }
        ]
      },
      {
        test: /\.s(c|a)ss$/,
        use: [
          "style-loader", // creates style nodes from JS strings
          "css-loader", // translates CSS into CommonJS
          "sass-loader" // compiles Sass to CSS, using Node Sass by default
        ]
      },
      { // css
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      { // images
        test: /\.(pdf|jpg|png|gif|svg|ico)$/,
        use: [
          {
            loader: 'url-loader'
          },
        ]
      },
    ]
  },
  plugins: [
    htmlPlugin,
    new webpack.DefinePlugin(envKeys)
  ]
};

module.exports = config;
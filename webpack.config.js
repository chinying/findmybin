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
    'index': './src/index.js'
  },
  output: {
    path: path.resolve('dist'),
    filename: 'bundle.js' 
  },
  module: { // here be loaders
    rules: [
      { // look for js(x) files => babelify
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
        }
      }
    ]
  },
  plugins: [ 
    htmlPlugin,
    new webpack.DefinePlugin(envKeys)
  ]
};

module.exports = config;
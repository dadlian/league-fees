const path = require("path");
const webpack = require("webpack");
const combineLoaders = require("webpack-combine-loaders");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    home: "./pages/home/home.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: argv.env == 'staging'?'/blueocean/':'/',
    filename: "./[name].bundle.js"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        loader: "babel-loader",
        options: { presets: ["@babel/env"] }
      },
      {
        test: /\.scss$/,
        loader: 'style-loader'
      },
      {
        test: /\.scss$/,
        loader: 'css-loader',
        options: {
          modules:{
            localIdentName: '[name]__[local]___[hash:base64:5]'
          }
        }
      },
      {
        test: /\.scss$/,
        loader: 'sass-loader'
      },
      {
        test: /\.(gif|svg|jpg|png)$/,
        loader: "url-loader",
        options: {
          esModule: false,
        }
      },
      {
        test: /\.(woff)$/,
        loader: 'file-loader'
      }
    ]
  },
  resolve: { extensions: ["*", ".js", ".jsx"] },
  plugins: [
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        { from: 'assets', to: 'assets' }
      ]
    }),
    new HtmlWebpackPlugin({
      title: "Home | ReactJS MPA Shell",
      filename:"index.html",
      template: 'index.html',
      chunks: ['home'],
      base: '/'
    })
  ],
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    writeToDisk: true
  }
});

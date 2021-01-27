const path = require("path");
const webpack = require("webpack");
const combineLoaders = require("webpack-combine-loaders");
const CopyPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackExcludeAssetsPlugin = require('html-webpack-exclude-assets-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => ({
  entry: {
    leagues: "./pages/leagues/leagues.js",
    seasons: "./pages/seasons/seasons.js",
    teams: "./pages/teams/teams.js"
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: argv.env == 'production'?'/league-fees/':'/',
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
      title: "Leagues | Pay League Fees",
      filename:"index.html",
      template: 'index.html',
      chunks: ['leagues'],
      base: argv.env == 'production'?'/league-fees/':'/'
    }),
    new HtmlWebpackPlugin({
      title: "Seasons | Pay League Fees",
      filename:"seasons/index.html",
      template: 'index.html',
      chunks: ['seasons'],
      base: argv.env == 'production'?'/league-fees/':'/'
    }),
    new HtmlWebpackPlugin({
      title: "Teams | Pay League Fees",
      filename:"teams/index.html",
      template: 'index.html',
      chunks: ['teams'],
      base: argv.env == 'production'?'/league-fees/':'/'
    })
  ],
  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
    writeToDisk: true
  }
});

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    verifier: './src/verifier.js',
  },
  devtool: 'source-map',
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'src/index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      filename: 'verifier.html',
      template: 'src/verifier.html',
      chunks: ['verifier'],
    }),
    // Once we switch to React, we can take a more standard approach to asset management
    // (https://webpack.js.org/guides/asset-management/#loading-images) and won't need this plugin
    new CopyPlugin({
      patterns: [
        {from: './src/assets/images', to: 'images'},
      ],
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    static: './dist',
  },
  module: {
    rules: [
      {
        test: /\.(js)$/,
        exclude: /node_modules/,
        use: ['babel-loader', 'eslint-loader'],
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
    },
  },
};

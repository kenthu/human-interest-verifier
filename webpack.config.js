const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    index: './src/index.js',
    verifier: './src/verifier.js',
  },

  devtool: 'inline-source-map',
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Human Interest Verifier',
    }),
  ],
  devServer: {
    static: './dist',
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
  },
};

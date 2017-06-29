/* globals __dirname */

const path = require('path');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(__dirname, './public/js/game/initialize')
  },
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, './public/js/game')],
    extensions: ['.js']
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        loader: 'babel-loader',
        options: { presets: ['es2015'] }
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: '[name].bundle.js'
  }
};

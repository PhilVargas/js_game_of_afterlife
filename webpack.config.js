const path = require('path');
const webpack = require('webpack');

module.exports = {
  context: __dirname,
  entry: {
    app: path.resolve(__dirname, './public/js/game/initialize.js')
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
        use: [{
          loader: 'babel-loader',
          options: { presets: ['es2015'] }
        }]
      }
    ],
  },
  output: {
    path: path.resolve(__dirname, './public/js'),
    filename: '[name].bundle.js'
  }
};

const webpack = require('webpack');

const config = {
  // devtool: "inline-source-map",
  entry: {
    'react-awesome-button': ["./src/demo.js"]
  },
  output: {
    path: __dirname + '/demo',
    filename: "[name].js",
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: ["es2015","react","stage-0"]
      }
    }]
  },
  devServer: {
    contentBase: "./demo",
    colors: true,
    historyApiFallback: true,
    inline: true
  },

}

module.exports = config;

const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const config = {
  // devtool: 'inline-source-map',
  entry: {
    'react-awesome-button': ['./src/demo.js'],
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
      query: {
        presets: [
          'es2015',
          'react',
          'stage-0',
        ],
      },
    },
    {
      test: /\.scss|\.css$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: [
          'css-loader',
          'sass-loader',
        ],
      }),
    }],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorOptions: { discardComments: { removeAll: true } },
    }),
  ],
  devServer: {
    contentBase: './demo',
    historyApiFallback: true,
    inline: true,
  },
};

module.exports = config;

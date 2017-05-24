const ExtractTextPlugin = require('extract-text-webpack-plugin');

const config = {
  entry: {
    'react-awesome-button': ['./src/demo/demo.js'],
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      }, {
        test: /\.scss$/i,
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                modules: true,
                localIdentName: '[hash:base64:4]',
              },
            },
            'postcss-loader',
            'sass-loader'],
        }),
      },
      {
        test: /\.css$/i,
        loader: ExtractTextPlugin.extract({
          loader: 'css-loader?importLoaders=1!postcss-loader',
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
  ],
  devServer: {
    contentBase: './demo',
    historyApiFallback: true,
    inline: true,
  },
};

module.exports = config;

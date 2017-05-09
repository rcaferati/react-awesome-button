const webpack = require('webpack');
const path = require('path');

const config = {
  entry: {
    index: ['./src/react-awesome-button.js'],
  },
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'react-awesome-button',
  },
  externals: {
    react: {
      root: 'React',
      commonjs2: 'react',
      commonjs: 'react',
      amd: 'react',
    },
    'react-dom': {
      root: 'ReactDOM',
      commonjs: 'react-dom',
      commonjs2: 'react-dom',
      amd: 'react-dom',
    },
  },
  module: {
    loaders: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'babel-loader',
    }],
  },
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      comments: false,
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
  ],
};

module.exports = config;

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  mode: 'production',
  entry: {
    'react-awesome-button': ['./demo/index.js'],
  },
  devtool: 'source-map',
  resolve: {
    alias: {
      components: path.resolve(__dirname, 'demo/components'),
      examples: path.resolve(__dirname, 'demo/examples'),
      helpers: path.resolve(__dirname, 'demo/helpers'),
      src: path.resolve(__dirname, 'src'),
      dist: path.resolve(__dirname, 'dist'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/env', '@babel/react'],
        },
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          {
            loader: 'css-loader',
            options: {
              // modules: true,
              modules: {
                localIdentName: '[local]--[hash:base64:4]',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader?importLoaders=1!postcss-loader',
        ],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `styles.css`,
    }),
  ],
  performance: {
    hints: false,
    maxEntrypointSize: 512000,
    maxAssetSize: 512000,
  },
  devServer: {
    static: {
      directory: path.join(__dirname, '/demo/public'),
    },
    port: 9000,
    historyApiFallback: true,
  },
};

module.exports = config;

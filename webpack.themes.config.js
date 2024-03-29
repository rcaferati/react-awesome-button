const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const THEME = process.env.AWESOME_THEME;

module.exports = {
  mode: 'production',
  entry: {
    styles: [path.resolve(__dirname, `src/styles/themes/${THEME}/index.ts`)],
  },
  output: {
    path: path.resolve(__dirname, 'dist/themes'),
    filename: `${THEME}.js`,
    libraryTarget: 'umd',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          presets: ['es2015', 'react', 'stage-0'],
        },
      },
      {
        test: /\.ts?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/i,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
          },
          'css-loader',
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
  optimization: {},
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${THEME}.css`,
    }),
  ],
};

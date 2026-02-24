// webpack.scss.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'production',

  entry: {
    styles: [path.resolve(__dirname, 'src/styles/index.ts')],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },

  module: {
    rules: [
      // Keep JS handling for mixed codebases (if any JS gets imported by style entries)
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
          },
        },
      },

      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },

      {
        test: /\.scss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // postcss-loader + sass-loader apply to @import-ed resources
              importLoaders: 2,
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },

      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              // postcss-loader applies to @import-ed CSS
              importLoaders: 1,
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs'],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',
    }),
  ],

  stats: 'errors-warnings',
};

// webpack.themes.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const THEME = process.env.AWESOME_THEME;

if (!THEME || !String(THEME).trim()) {
  throw new Error(
    '[webpack.themes.config] Missing AWESOME_THEME env var. Example: AWESOME_THEME=theme-blue'
  );
}

const themeName = String(THEME).trim();

module.exports = {
  mode: 'production',

  entry: {
    styles: [
      path.resolve(__dirname, `src/styles/themes/${themeName}/index.ts`),
    ],
  },

  output: {
    path: path.resolve(__dirname, 'dist/themes'),
    filename: `${themeName}.js`,
  },

  module: {
    rules: [
      // JS support for mixed imports (if any)
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

  optimization: {},

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${themeName}.css`,
    }),
  ],

  stats: 'errors-warnings',
};

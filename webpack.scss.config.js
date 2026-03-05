// webpack.scss.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

module.exports = {
  mode: 'production',

  entry: {
    // keep your current entry orchestration
    styles: [path.resolve(__dirname, 'src/styles/index.ts')],
  },

  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js', // dist/styles.js (you already delete it after)
    clean: false,
  },

  // ✅ Critical: don’t let webpack prune "side-effect-only" imports (like SCSS)
  optimization: {
    sideEffects: false,
  },

  module: {
    rules: [
      // JS handling (only needed if your TS entry imports JS)
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: { cacheDirectory: true },
        },
      },

      // TS handling for the entry
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
          options: {
            // faster + avoids typechecking noise in a pure style build
            transpileOnly: true,
          },
        },
      },

      // SCSS
      {
        test: /\.scss$/i,
        // ✅ Critical: mark as side-effectful regardless of package.json sideEffects list
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              // safe default: only treat *.module.scss as CSS Modules
              modules: { auto: /\.module\.scss$/i },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              // keep it deterministic even without a postcss.config.js
              postcssOptions: { plugins: [require('autoprefixer')] },
            },
          },
          'sass-loader',
        ],
      },

      // CSS
      {
        test: /\.css$/i,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              modules: { auto: /\.module\.css$/i },
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: { plugins: [require('autoprefixer')] },
            },
          },
        ],
      },
    ],
  },

  resolve: {
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.mjs', '.scss', '.css'],
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css', // dist/styles.css
    }),
  ],

  stats: 'errors-warnings',
};

// webpack.themes.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');

const THEME_ENV_KEY = 'AWESOME_THEME';
const themeName = process.env[THEME_ENV_KEY];

if (!themeName || !String(themeName).trim()) {
  throw new Error(
    `[webpack.themes.config] Missing ${THEME_ENV_KEY} env var. Example: ${THEME_ENV_KEY}=theme-blue`
  );
}

const theme = String(themeName).trim();
const format = String(process.env.AWESOME_THEME_FORMAT || 'esm').toLowerCase();
const isEsm = format === 'esm';

module.exports = {
  mode: 'production',

  target: isEsm ? ['web', 'es2020'] : 'node',

  // ✅ needed for output.module / library.type='module'
  experiments: isEsm ? { outputModule: true } : undefined,

  entry: {
    styles: [path.resolve(__dirname, `src/styles/themes/${theme}/index.ts`)],
  },

  output: {
    path: path.resolve(__dirname, 'dist/themes'),
    filename: `${theme}.${isEsm ? 'mjs' : 'js'}`,
    clean: false,
    globalObject: 'this',

    ...(isEsm
      ? {
          module: true,
          library: { type: 'module' },
        }
      : {
          library: { type: 'commonjs2', export: 'default' },
        }),
  },

  optimization: { sideEffects: false },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: { loader: 'ts-loader', options: { transpileOnly: true } },
      },
      {
        test: /\.scss$/i,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2,
              esModule: true,
              modules: {
                auto: /\.module\.scss$/i,
                exportLocalsConvention: 'asIs',
              },
            },
          },
          'postcss-loader',
          'sass-loader',
        ],
      },
      {
        test: /\.css$/i,
        sideEffects: true,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 1,
              esModule: true,
              modules: {
                auto: /\.module\.css$/i,
                exportLocalsConvention: 'asIs',
              },
            },
          },
          'postcss-loader',
        ],
      },
    ],
  },

  resolve: { extensions: ['.ts', '.tsx', '.js', '.mjs'] },

  plugins: [
    new MiniCssExtractPlugin({
      filename: `${theme}.css`,
    }),
  ],

  stats: 'errors-warnings',
};

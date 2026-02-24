// .storybook/main.js

/** @type { import('@storybook/react-webpack5').StorybookConfig } */
const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],

  addons: [
    '@storybook/addon-webpack5-compiler-swc',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
    '@storybook/addon-onboarding',
    '@storybook/preset-scss',
  ],

  framework: '@storybook/react-webpack5',

  webpackFinal: async (config) => {
    // Keep this minimal. Storybook + preset-scss already provide loaders.
    config.resolve ||= {};
    config.resolve.extensions = Array.from(
      new Set([
        ...(config.resolve.extensions || []),
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
        '.mjs',
      ])
    );

    return config;
  },
};

export default config;

// .storybook/preview.js

/** @type { import('@storybook/react-webpack5').Preview } */

// Default theme module for stories that support `cssModule` (e.g. AwesomeButton family)
import themeEric from '../src/styles/themes/theme-eric';


const resolvedTheme = themeEric?.default || themeEric;

const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    layout: 'centered',

    // Nice defaults for button components
    actions: {
      argTypesRegex: '^on[A-Z].*',
    },
  },

  decorators: [
    (Story, context) => {
      // Inject cssModule only when the story didn't set one explicitly.
      // This keeps stories lean while still allowing overrides per story.
      const args = context.args || {};

      return Story({
        args: {
          ...args,
          cssModule: args.cssModule ?? resolvedTheme,
        },
      });
    },
  ],
};

export default preview;

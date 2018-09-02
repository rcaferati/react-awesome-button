// TODO: create array on build.
export const THEMES = [
  'theme-blue',
  'theme-red',
  'theme-amber',
  'theme-indigo',
  'theme-bojack',
  'theme-c137',
  'theme-eric',
  'theme-flat',
  'theme-rickiest',
];

export const MODULES = [];
THEMES.forEach((theme) => {
  // eslint-disable-next-line
  MODULES[theme] = require(`../../src/styles/themes/${theme}/styles.scss`);
});

export default {
  Modules: MODULES,
  Themes: THEMES,
};

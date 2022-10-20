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

THEMES.forEach(theme => {
  // eslint-disable-next-line
  const module = require(`../../src/styles/themes/${theme}/styles.module.scss`);
  MODULES[theme] = module.default;
});

export default {
  Modules: MODULES,
  Themes: THEMES,
};

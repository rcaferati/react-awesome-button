// TODO: create array on build.
export const THEMES = [
  'theme-amber',
  'theme-blue',
  'theme-c137',
  'theme-eric',
  'theme-flat',
  'theme-indigo',
  'theme-one',
  'theme-orange',
  'theme-red',
  'theme-rickiest',
  'theme-three',
  'theme-two',
];

const MODULES = [];
THEMES.forEach((theme) => {
  // eslint-disable-next-line
  MODULES[theme] = require(`../styles/themes/${theme}/styles.scss`);
});

export default {
  Modules: MODULES,
  Themes: THEMES,
};

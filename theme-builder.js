const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const THEMES = path.resolve(__dirname, 'src/styles/themes');
const THEMES_PATH = './dist/themes';
const THEMES_ARG = 'AWESOME_THEME';

fs.readdir(THEMES, (err, files) => {
  files.forEach(file => {
    if (file.match(/theme-/gi)) {
      shell.exec(
        `${THEMES_ARG}=${file} webpack --config webpack.themes.config.js`
      );
      shell.exec(`rm ${THEMES_PATH}/${file}.js`);
    }
  });
});

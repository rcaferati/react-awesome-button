import fs from 'fs';
import path from 'path';
import shell from 'shelljs';

const THEMES = path.resolve(__dirname);

fs.readdir(THEMES, (err, files) => {
  files.forEach((file) => {
    if (file.match(/theme-/ig)) {
      shell.exec(`AWESOME_THEME=${file} webpack`);
      shell.rm('-rf', '../../dist/themes');
    }
  });
});

// theme-builder.js
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const THEMES_DIR = path.resolve(__dirname, 'src/styles/themes');
const DIST_THEMES_DIR = path.resolve(__dirname, 'dist/themes');
const THEME_ENV_KEY = 'AWESOME_THEME';

function isThemeDirectory(name) {
  return /^theme-/i.test(name);
}

function ensureDir(dirPath) {
  shell.mkdir('-p', dirPath);
}

function runWebpack(themeName, format) {
  const command = 'webpack --config webpack.themes.config.js';

  const result = shell.exec(command, {
    env: {
      ...process.env,
      [THEME_ENV_KEY]: themeName,
      AWESOME_THEME_FORMAT: format, // 'esm' | 'cjs'
    },
    silent: false,
  });

  if (result.code !== 0) {
    throw new Error(
      `[theme-builder] Failed building theme "${themeName}" (${format}) (exit code ${result.code})`
    );
  }
}

function buildTheme(themeName) {
  runWebpack(themeName, 'esm'); // dist/themes/<theme>.mjs
  runWebpack(themeName, 'cjs'); // dist/themes/<theme>.js
}

fs.readdir(THEMES_DIR, { withFileTypes: true }, (err, entries) => {
  if (err) {
    console.error('[theme-builder] Failed to read themes directory:', err);
    process.exitCode = 1;
    return;
  }

  ensureDir(DIST_THEMES_DIR);

  const themeNames = entries
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter(isThemeDirectory)
    .sort();

  if (themeNames.length === 0) {
    console.warn('[theme-builder] No theme-* directories found.');
    return;
  }

  try {
    themeNames.forEach((themeName) => {
      console.log(`[theme-builder] Building ${themeName}...`);
      buildTheme(themeName);
    });

    console.log(`[theme-builder] Done. Built ${themeNames.length} theme(s).`);
  } catch (buildError) {
    console.error(buildError);
    process.exitCode = 1;
  }
});

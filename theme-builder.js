// theme-builder.js
const fs = require('fs');
const path = require('path');
const shell = require('shelljs');

const THEMES_DIR = path.resolve(__dirname, 'src/styles/themes');
const DIST_THEMES_DIR = path.resolve(__dirname, 'dist/themes');
const THEME_ENV_KEY = 'AWESOME_THEME';

// IMPORTANT:
// If your package exports `./themes/*` -> `./dist/themes/*.js`,
// you should set KEEP_THEME_JS=1 (or default this to true).
const KEEP_THEME_JS = process.env.KEEP_THEME_JS === '1';

function isThemeDirectory(name) {
  return /^theme-/i.test(name);
}

function ensureDir(dirPath) {
  shell.mkdir('-p', dirPath);
}

function buildTheme(themeName) {
  const command = 'webpack --config webpack.themes.config.js';

  const result = shell.exec(command, {
    env: {
      ...process.env,
      [THEME_ENV_KEY]: themeName,
    },
    silent: false,
  });

  if (result.code !== 0) {
    throw new Error(
      `[theme-builder] Failed building theme "${themeName}" (exit code ${result.code})`
    );
  }

  if (!KEEP_THEME_JS) {
    const jsStubPath = path.join(DIST_THEMES_DIR, `${themeName}.js`);
    shell.rm('-f', jsStubPath);
  }
}

fs.readdir(THEMES_DIR, { withFileTypes: true }, (err, entries) => {
  if (err) {
    // eslint-disable-next-line no-console
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
    // eslint-disable-next-line no-console
    console.warn('[theme-builder] No theme-* directories found.');
    return;
  }

  try {
    themeNames.forEach((themeName) => {
      // eslint-disable-next-line no-console
      console.log(`[theme-builder] Building ${themeName}...`);
      buildTheme(themeName);
    });

    // eslint-disable-next-line no-console
    console.log(
      `[theme-builder] Done. Built ${themeNames.length} theme(s).` +
        (KEEP_THEME_JS ? ' Kept JS theme stubs.' : ' Removed JS theme stubs.')
    );
  } catch (buildError) {
    // eslint-disable-next-line no-console
    console.error(buildError);
    process.exitCode = 1;
  }
});

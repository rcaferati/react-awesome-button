// tsup.config.ts
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    AwesomeButton: 'src/AwesomeButton.ts',
    AwesomeButtonProgress: 'src/AwesomeButtonProgress.ts',
    AwesomeButtonSocial: 'src/AwesomeButtonSocial.ts', // or .tsx if that's your file
  },

  outDir: 'dist',
  format: ['cjs', 'esm'],
  dts: true,

  bundle: true,
  splitting: false,

  sourcemap: true,
  clean: true,
  treeshake: true,
  minify: false,

  target: 'es2018',
  platform: 'neutral',
  tsconfig: './tsconfig.json',

  external: ['react', 'react-dom', '@rcaferati/wac'],

  outExtension(ctx) {
    return {
      js: ctx.format === 'esm' ? '.mjs' : '.js',
    };
  },
});

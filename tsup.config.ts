import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['./src/index.ts'],
  splitting: false,
  sourcemap: false,
  outDir: 'dist',
  dts: true,
  format: ['esm', 'cjs'],
});

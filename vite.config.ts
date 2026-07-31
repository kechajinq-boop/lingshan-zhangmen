import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: { target: 'es2018', chunkSizeWarningLimit: 3000 },
});

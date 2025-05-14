import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path';

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': '/src',
      ziggy: path.resolve('vendor/tightenco/ziggy/dist/vue.es.js'),
    },
  },
});

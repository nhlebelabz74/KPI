import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: './', // Correct for Electron
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
    }
  },
  // build: {
  //   outDir: path.resolve(__dirname, './dist'),
  //   minify: 'terser',
  //   terserOptions: {
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //     output: {
  //       comments: false,
  //     },
  //   },
  //   chunkSizeWarningLimit: 1500
  // }
});
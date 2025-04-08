import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
    }
  },
  build: {
    outDir: 'dist',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: process.env.NODE_ENV === 'production',
      },
      output: {
        comments: false,
      },
    },
    chunkSizeWarningLimit: 2500,
    rollupOptions: {
      output: {
        // Disable manual chunking completely
        manualChunks: undefined,
        
        // Asset naming
        assetFileNames: 'assets/[name]-[hash][extname]',
        entryFileNames: 'entries/[name]-[hash].js',
      }
    },
    sourcemap: process.env.NODE_ENV !== 'production',
  }
});
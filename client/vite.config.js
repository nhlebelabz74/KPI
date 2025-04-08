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
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        // Simpler chunking strategy to avoid React hooks dependency issues
        manualChunks: (id) => {
          // Keep all React related packages together in one chunk
          if (id.includes('node_modules')) {
            if (id.includes('react') || 
                id.includes('react-dom') || 
                id.includes('react-router') ||
                id.includes('react-hook-form') ||
                id.includes('hookform') ||
                id.includes('@radix-ui')) {
              return 'vendor-react'; // All React and UI components in one chunk
            }
            
            // Other large libraries in separate chunks
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            
            // Everything else from node_modules
            return 'vendor-others';
          }
          
          // Your application code
          if (id.includes('/src/')) {
            return 'app';
          }
        },
        // Asset naming
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      }
    },
    sourcemap: process.env.NODE_ENV !== 'production',
  }
});
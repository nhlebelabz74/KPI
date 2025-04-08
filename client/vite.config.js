import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  base: '/', // Changed from './' to '/' for web deployment
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
        // Properly chunk your build
        manualChunks: (id) => {
          // Create a vendors chunk containing node_modules
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor-react';
            }
            if (id.includes('recharts') || id.includes('d3')) {
              return 'vendor-charts';
            }
            if (id.includes('radix-ui')) {
              return 'vendor-ui';
            }
            return 'vendor';
          }
          // Create a chunk for your app's main code
          if (id.includes('/src/')) {
            if (id.includes('/components/')) {
              return 'components';
            }
            if (id.includes('/pages/')) {
              return 'pages';
            }
            if (id.includes('/hooks/')) {
              return 'hooks';
            }
          }
        },
        // Ensure assets are hashed properly
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'chunks/[name]-[hash].js',
        entryFileNames: 'entries/[name]-[hash].js',
      }
    },
    // Ensure correct source maps in production
    sourcemap: process.env.NODE_ENV !== 'production',
  }
});
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  base: '/',
  plugins: [
    react(), // SWC optimization is automatically applied
    svgr(),
  ],
  define: {
    global: 'window' // Fix for Dragula.js expecting `global`
  },
  server: {
    port: 3001,
    open: true,
  },
  cacheDir: '.vite',
  build: {
    outDir: 'build',
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['lodash', 'axios'],
        }
      }
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
})

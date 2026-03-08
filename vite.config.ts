import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import envCompatible from 'vite-plugin-env-compatible';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
    envPrefix: 'REACT_APP_', // Tells Vite to allow these variables
  plugins: [
    react(),
    tailwindcss(),
    envCompatible({ prefix: 'REACT_APP_' }) // Tells Vite to load REACT_APP_ variables
  ],
  define: {
    'process.env': {} // Prevents "process is not defined" errors in the browser
  }
});

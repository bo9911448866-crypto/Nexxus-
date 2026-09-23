import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // The hosted preview does not expose Vite's HMR WebSocket endpoint.
      // Disable Vite's client injection so the preview does not log failed socket closes.
      hmr: false,
      // Keep file watching available for the local dev server.
      watch: {},
    },
  };
});

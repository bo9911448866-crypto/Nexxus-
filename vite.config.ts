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
      // Hosted previews do not expose Vite's HMR WebSocket endpoint.
      // Disable HMR and websocket handling so @vite/client is not injected.
      hmr: false,
      ws: false,
      // Keep file watching available for the local dev server.
      watch: {},
    },
  };
});

import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'Jinner HR Employee',
        short_name: 'Jinner HR',
        theme_color: '#0d1b2a',
        background_color: '#f7fbff',
        display: 'standalone',
        start_url: '/'
      }
    })
  ],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true
  }
});

import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    port: 5173,
    proxy: {
      '/api/hermes': {
        target: 'http://localhost:20128/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/hermes/, ''),
        headers: {
          'Authorization': 'Bearer sk-091f0b09527143bb-182sc1-2aca3a57'
        }
      }
    }
  }
});

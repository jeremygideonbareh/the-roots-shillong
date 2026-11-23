import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative paths in production, so the build works under the GitHub Pages project path
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  server: { port: 5177, strictPort: true },
}));

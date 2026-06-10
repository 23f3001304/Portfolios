import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Honour an externally assigned port (e.g. the preview harness); default otherwise.
  server: process.env.PORT ? { port: Number(process.env.PORT) } : undefined,
});

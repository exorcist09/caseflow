import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from "path"

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173
  },
  define: {
    // optionally expose env defaults
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src")
    }
  }
});

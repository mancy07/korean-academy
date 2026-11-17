
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, searchForWorkspaceRoot } from 'vitest/config';

// One config file for both the dev/build tool (Vite) and the test runner (Vitest).
export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      // Lets us write `import x from '@/domain/...'` instead of '../../../domain/...'
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  server: {
    fs: {
      // Allow Vite to serve dependencies installed in the parent folder.
      allow: [searchForWorkspaceRoot(process.cwd())],
    },
  },

  test: {
    environment: 'jsdom', // fake browser so React components can be tested
    globals: true, // describe / it / expect available without importing
    setupFiles: ['./tests/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    css: false,
  },
});

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    setupFiles: ['./src/__tests__/setup.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '**/*.config.js',
        '**/*.config.ts',
        'app.js',
        'index.js',
        'scripts/**',
        'migrations/**',
      ],
      // Garantir que os caminhos sejam relativos ao diretório raiz do projeto
      reportsDirectory: './coverage',
      // Usar caminhos relativos corretos
      all: true,
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});

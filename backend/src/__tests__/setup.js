import dotenv from 'dotenv';
import { vi } from 'vitest';

// Carregar variáveis de ambiente de teste
dotenv.config({ path: '.env.test' });

// Configurar ambiente de teste
process.env.NODE_ENV = 'test';

// Mock do console para evitar logs durante os testes
const originalConsole = { ...console };

// Mock do console globalmente para todos os testes
global.console = {
  ...originalConsole,
  log: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
  debug: vi.fn(),
};

// Mock do pool de conexões do PostgreSQL
vi.mock('../config/database.js', () => ({
  __esModule: true,
  default: {
    connect: vi.fn().mockResolvedValue({
      release: vi.fn(),
      query: vi.fn().mockResolvedValue({ rows: [] }),
    }),
    query: vi.fn().mockResolvedValue({ rows: [] }),
    end: vi.fn().mockResolvedValue(undefined),
    on: vi.fn(),
  },
}));

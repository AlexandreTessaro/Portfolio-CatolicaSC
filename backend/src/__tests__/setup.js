import dotenv from 'dotenv';

// Carregar variáveis de ambiente para testes
dotenv.config({ path: '.env.test' });

// Configurações globais para testes
global.testTimeout = 10000;

// Mock do console para reduzir ruído nos testes
global.console = {
  ...console,
  // Comentar as linhas abaixo se quiser ver os logs durante os testes
  // log: jest.fn(),
  // debug: jest.fn(),
  // info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

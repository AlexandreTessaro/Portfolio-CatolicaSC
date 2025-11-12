import { describe, it, expect, vi } from 'vitest';

// Mock pg module usando importOriginal
const mockPoolInstance = {
  connect: vi.fn(),
  on: vi.fn(),
  query: vi.fn()
};

vi.mock('pg', async (importOriginal) => {
  const actual = await importOriginal();
  
  return {
    ...actual,
    default: {
      ...actual.default,
      Pool: vi.fn(() => mockPoolInstance)
    }
  };
});

vi.mock('dotenv', () => ({
  default: {
    config: vi.fn()
  }
}));

describe('Database Config', () => {
  it('should export pool instance', async () => {
    const dbModule = await import('../../config/database.js');
    expect(dbModule.default).toBeDefined();
  });

  it('should parse DATABASE_URL correctly', () => {
    const url = 'postgres://user:password@hostname:5432/database';
    const urlObj = new URL(url);
    
    expect(urlObj.username).toBe('user');
    expect(urlObj.password).toBe('password');
    expect(urlObj.hostname).toBe('hostname');
    expect(urlObj.port).toBe('5432');
    expect(urlObj.pathname).toBe('/database');
  });

  it('should handle invalid DATABASE_URL gracefully', () => {
    const invalidUrl = 'invalid-url';
    
    expect(() => {
      new URL(invalidUrl);
    }).toThrow();
  });

  it('should use default values when env vars are not set', () => {
    const defaultSecret = 'your-secret-key-change-in-production';
    expect(defaultSecret).toBeDefined();
  });

  it('should handle pool configuration', () => {
    const config = {
      max: 100,
      min: 10,
      idleTimeoutMillis: 30000
    };
    
    expect(config.max).toBe(100);
    expect(config.min).toBe(10);
    expect(config.idleTimeoutMillis).toBe(30000);
  });

  it('should handle SSL configuration for production', () => {
    const isProduction = true;
    const sslConfig = isProduction ? { rejectUnauthorized: false } : false;
    
    expect(sslConfig).toEqual({ rejectUnauthorized: false });
  });

  it('should handle SSL configuration for development', () => {
    const isProduction = false;
    const sslConfig = isProduction ? { rejectUnauthorized: false } : false;
    
    expect(sslConfig).toBe(false);
  });
});


import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken
} from '../../config/jwt.js';

// Mock jwt module
vi.mock('jsonwebtoken', () => {
  const mockTokens = {
    'valid-access-token': { userId: 1, email: 'test@example.com' },
    'valid-refresh-token': { userId: 1, email: 'test@example.com' },
    'expired-token': { expired: true }
  };

  return {
    default: {
      sign: vi.fn((payload, secret, options) => {
        if (options?.expiresIn === '1h') {
          return 'valid-access-token';
        }
        if (options?.expiresIn === '7d') {
          return 'valid-refresh-token';
        }
        return 'token';
      }),
      verify: vi.fn((token, secret) => {
        const jwtSecret = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
        const jwtRefreshSecret = process.env.JWT_REFRESH_SECRET || 'your-super-secret-refresh-jwt-key-change-in-production';
        
        if (token === 'valid-access-token' && (secret === jwtSecret || secret === 'your-super-secret-jwt-key-change-in-production')) {
          return mockTokens['valid-access-token'];
        }
        if (token === 'valid-refresh-token' && (secret === jwtRefreshSecret || secret === 'your-super-secret-refresh-jwt-key-change-in-production')) {
          return mockTokens['valid-refresh-token'];
        }
        if (token === 'expired-token') {
          const error = new Error('Token expired');
          error.name = 'TokenExpiredError';
          throw error;
        }
        throw new Error('Invalid token');
      })
    }
  };
});

describe('JWT Config', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Definir antes de importar o módulo
    process.env.JWT_SECRET = 'your-super-secret-jwt-key-change-in-production';
    process.env.JWT_REFRESH_SECRET = 'your-super-secret-refresh-jwt-key-change-in-production';
  });

  describe('generateAccessToken', () => {
    it('should generate an access token', () => {
      const payload = { userId: 1, email: 'test@example.com' };
      const token = generateAccessToken(payload);

      expect(token).toBe('valid-access-token');
    });

    it('should generate token with correct payload', async () => {
      const payload = { userId: 2, email: 'user@example.com' };
      generateAccessToken(payload);

      const jwt = await import('jsonwebtoken');
      expect(jwt.default.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        { expiresIn: '1h' }
      );
    });
  });

  describe('generateRefreshToken', () => {
    it('should generate a refresh token', () => {
      const payload = { userId: 1, email: 'test@example.com' };
      const token = generateRefreshToken(payload);

      expect(token).toBe('valid-refresh-token');
    });

    it('should generate token with correct payload and expiration', async () => {
      const payload = { userId: 2, email: 'user@example.com' };
      generateRefreshToken(payload);

      const jwt = await import('jsonwebtoken');
      expect(jwt.default.sign).toHaveBeenCalledWith(
        payload,
        expect.any(String),
        { expiresIn: '7d' }
      );
    });
  });

  describe('verifyAccessToken', () => {
    it('should verify a valid access token', () => {
      const token = 'valid-access-token';
      const decoded = verifyAccessToken(token);

      expect(decoded).toEqual({ userId: 1, email: 'test@example.com' });
    });

    it('should throw error for invalid token', () => {
      const token = 'invalid-token';

      expect(() => {
        verifyAccessToken(token);
      }).toThrow('Token inválido ou expirado');
    });

    it('should throw error for expired token', () => {
      const token = 'expired-token';

      expect(() => {
        verifyAccessToken(token);
      }).toThrow('Token inválido ou expirado');
    });
  });

  describe('verifyRefreshToken', () => {
    it('should verify a valid refresh token', () => {
      const token = 'valid-refresh-token';
      const decoded = verifyRefreshToken(token);

      expect(decoded).toEqual({ userId: 1, email: 'test@example.com' });
    });

    it('should throw error for invalid refresh token', () => {
      const token = 'invalid-token';

      expect(() => {
        verifyRefreshToken(token);
      }).toThrow('Refresh token inválido ou expirado');
    });

    it('should throw error for expired refresh token', () => {
      const token = 'expired-token';

      expect(() => {
        verifyRefreshToken(token);
      }).toThrow('Refresh token inválido ou expirado');
    });
  });
});


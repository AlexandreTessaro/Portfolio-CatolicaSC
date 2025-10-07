import { describe, it, expect, beforeEach, vi } from 'vitest';
import { authenticateToken, optionalAuth, requireAdmin } from '../../middleware/auth.js';
import { verifyAccessToken } from '../../config/jwt.js';

// Mock das dependências
vi.mock('../../config/jwt.js');

describe('Auth Middleware', () => {
  let req, res, next;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar mocks do Express
    req = {
      headers: {},
      user: null
    };
    
    res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis()
    };
    
    next = vi.fn();
  });

  describe('authenticateToken', () => {
    it('should authenticate user with valid token', () => {
      // Arrange
      const validToken = 'valid-access-token';
      const decodedUser = { userId: 1, email: 'test@example.com' };
      
      req.headers.authorization = `Bearer ${validToken}`;
      
      // Mock do jwt
      vi.mocked(verifyAccessToken).mockReturnValue(decodedUser);

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(validToken);
      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 401 when no token is provided', () => {
      // Arrange
      req.headers.authorization = undefined;

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeNull();
    });

    it('should return 401 when authorization header is empty', () => {
      // Arrange
      req.headers.authorization = '';

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header has no Bearer token', () => {
      // Arrange
      req.headers.authorization = 'InvalidFormat';

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 403 when token is invalid', () => {
      // Arrange
      const invalidToken = 'invalid-token';
      req.headers.authorization = `Bearer ${invalidToken}`;
      
      // Mock do jwt para simular token inválido
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(invalidToken);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
      expect(req.user).toBeNull();
    });

    it('should return 403 when token is expired', () => {
      // Arrange
      const expiredToken = 'expired-token';
      req.headers.authorization = `Bearer ${expiredToken}`;
      
      // Mock do jwt para simular token expirado
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Token expirado');
      });

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(expiredToken);
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 500 when unexpected error occurs', () => {
      // Arrange
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock do jwt para simular erro inesperado
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token inválido ou expirado'
      });
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should set user when valid token is provided', () => {
      // Arrange
      const validToken = 'valid-access-token';
      const decodedUser = { userId: 1, email: 'test@example.com' };
      
      req.headers.authorization = `Bearer ${validToken}`;
      
      // Mock do jwt
      vi.mocked(verifyAccessToken).mockReturnValue(decodedUser);

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(validToken);
      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should set user to null when no token is provided', () => {
      // Arrange
      req.headers.authorization = undefined;

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
      expect(verifyAccessToken).not.toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should set user to null when authorization header is empty', () => {
      // Arrange
      req.headers.authorization = '';

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
      expect(verifyAccessToken).not.toHaveBeenCalled();
    });

    it('should set user to null when token is invalid', () => {
      // Arrange
      const invalidToken = 'invalid-token';
      req.headers.authorization = `Bearer ${invalidToken}`;
      
      // Mock do jwt para simular token inválido
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(invalidToken);
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should set user to null when token is expired', () => {
      // Arrange
      const expiredToken = 'expired-token';
      req.headers.authorization = `Bearer ${expiredToken}`;
      
      // Mock do jwt para simular token expirado
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Token expirado');
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(expiredToken);
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', () => {
      // Arrange
      req.headers.authorization = 'Bearer valid-token';
      
      // Mock do jwt para simular erro inesperado
      vi.mocked(verifyAccessToken).mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      optionalAuth(req, res, next);

      // Assert
      expect(req.user).toBeNull();
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });
  });

  describe('requireAdmin', () => {
    it('should allow access when user is admin', () => {
      // Arrange
      req.user = { userId: 1, email: 'admin@example.com', isAdmin: true };

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access when user is not admin', () => {
      // Arrange
      req.user = { userId: 1, email: 'user@example.com', isAdmin: false };

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should deny access when user is admin but property is undefined', () => {
      // Arrange
      req.user = { userId: 1, email: 'user@example.com' }; // isAdmin undefined

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when no user is authenticated', () => {
      // Arrange
      req.user = null;

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Autenticação necessária'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user is undefined', () => {
      // Arrange
      req.user = undefined;

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Autenticação necessária'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle unexpected errors gracefully', () => {
      // Arrange
      req.user = { userId: 1, email: 'admin@example.com', isAdmin: true };
      
      // Simular erro inesperado
      next.mockImplementation(() => {
        throw new Error('Unexpected error');
      });

      // Act
      requireAdmin(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Erro na verificação de permissões'
      });
    });
  });

  describe('Edge Cases and Security', () => {
    it('should handle malformed authorization header', () => {
      // Arrange
      req.headers.authorization = 'Bearer';

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    });

    it('should handle authorization header with multiple spaces', () => {
      // Arrange
      req.headers.authorization = 'Bearer   '; // Multiple spaces, no token

      // Act
      authenticateToken(req, res, next);

      // Assert
      // O middleware usa split(' ')[1], então múltiplos espaços resultam em string vazia
      expect(verifyAccessToken).not.toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should handle case-insensitive Bearer keyword', () => {
      // Arrange
      const validToken = 'valid-token';
      const decodedUser = { userId: 1, email: 'test@example.com' };
      
      req.headers.authorization = `bearer ${validToken}`; // lowercase
      
      // Mock do jwt
      vi.mocked(verifyAccessToken).mockReturnValue(decodedUser);

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(verifyAccessToken).toHaveBeenCalledWith(validToken);
      expect(req.user).toEqual(decodedUser);
      expect(next).toHaveBeenCalled();
    });

    it('should handle empty token string', () => {
      // Arrange
      req.headers.authorization = 'Bearer ';

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    });

    it('should handle null authorization header', () => {
      // Arrange
      req.headers.authorization = null;

      // Act
      authenticateToken(req, res, next);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    });
  });
});

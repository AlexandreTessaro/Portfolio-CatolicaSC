import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock usando vi.hoisted para garantir que seja aplicado antes da importação
const { mockLogAction } = vi.hoisted(() => {
  const mockLogAction = vi.fn().mockResolvedValue({});
  return { mockLogAction };
});

vi.mock('../../services/AuditService.js', () => ({
  AuditService: vi.fn().mockImplementation(() => ({
    logAction: mockLogAction
  }))
}));

import { logAudit, auditMiddleware } from '../../utils/auditHelper.js';

describe('auditHelper', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLogAction.mockResolvedValue({});
  });

  describe('logAudit', () => {
    it('should log audit with user info', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0')
      };
      const action = 'user.login';
      const resourceType = 'user';
      const resourceId = 1;
      const details = { method: 'POST' };

      await logAudit(req, action, resourceType, resourceId, details);

      expect(mockLogAction).toHaveBeenCalledWith({
        userId: 1,
        action: 'user.login',
        resourceType: 'user',
        resourceId: 1,
        details: { method: 'POST' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0'
      });
    });

    it('should handle request without user', async () => {
      const req = {
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0')
      };

      await logAudit(req, 'user.action');

      expect(mockLogAction).toHaveBeenCalledWith({
        userId: null,
        action: 'user.action',
        resourceType: null,
        resourceId: null,
        details: {},
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0'
      });
    });

    it('should handle request without ip', async () => {
      const req = {
        user: { userId: 1 },
        connection: { remoteAddress: '192.168.1.1' },
        get: vi.fn().mockReturnValue('Mozilla/5.0')
      };

      await logAudit(req, 'user.action');

      expect(mockLogAction).toHaveBeenCalledWith(
        expect.objectContaining({
          ipAddress: '192.168.1.1'
        })
      );
    });

    it('should handle request without user agent', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue(null)
      };

      await logAudit(req, 'user.action');

      expect(mockLogAction).toHaveBeenCalledWith(
        expect.objectContaining({
          userAgent: null
        })
      );
    });

    it('should not throw error if audit service fails', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0')
      };

      mockLogAction.mockRejectedValue(new Error('Database error'));

      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      await expect(logAudit(req, 'user.action')).resolves.not.toThrow();

      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('auditMiddleware', () => {
    it('should create middleware that logs audit after response', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0'),
        params: {},
        route: { path: '/api/users' }
      };
      const originalJson = vi.fn().mockReturnThis();
      const res = {
        statusCode: 200,
        json: originalJson
      };
      const next = vi.fn();

      const middleware = auditMiddleware('user.create');
      await middleware(req, res, next);

      expect(next).toHaveBeenCalled();

      // Simular resposta - isso vai chamar o res.json sobrescrito
      res.json({ success: true });

      // Aguardar setImmediate para garantir que o callback seja executado
      await new Promise(resolve => setImmediate(resolve));
      await new Promise(resolve => setImmediate(resolve)); // Duplo para garantir

      expect(mockLogAction).toHaveBeenCalled();
      expect(originalJson).toHaveBeenCalledWith({ success: true });
    });

    it('should infer resource type from route path', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0'),
        params: { id: '123' },
        route: { path: '/api/users/:id' }
      };
      const originalJson = vi.fn().mockReturnThis();
      const res = {
        statusCode: 200,
        json: originalJson
      };
      const next = vi.fn();

      const middleware = auditMiddleware('user.update');
      await middleware(req, res, next);
      res.json({});
      
      // Aguardar setImmediate para garantir que o callback seja executado
      await new Promise(resolve => setImmediate(resolve));
      await new Promise(resolve => setImmediate(resolve)); // Duplo para garantir

      expect(mockLogAction).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceType: 'user',
          resourceId: 123
        })
      );
    });

    it('should use getResourceInfo function when provided', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0'),
        params: {}
      };
      const originalJson = vi.fn().mockReturnThis();
      const res = {
        statusCode: 201,
        json: originalJson
      };
      const next = vi.fn();

      const getResourceInfo = vi.fn().mockReturnValue({
        resourceType: 'project',
        resourceId: 456,
        details: { custom: 'data' }
      });

      const middleware = auditMiddleware('project.create', getResourceInfo);
      await middleware(req, res, next);
      res.json({ id: 456 });
      
      // Aguardar setImmediate para garantir que o callback seja executado
      await new Promise(resolve => setImmediate(resolve));
      await new Promise(resolve => setImmediate(resolve)); // Duplo para garantir

      expect(getResourceInfo).toHaveBeenCalledWith(req, { id: 456 });
      expect(mockLogAction).toHaveBeenCalledWith(
        expect.objectContaining({
          resourceType: 'project',
          resourceId: 456,
          details: expect.objectContaining({
            custom: 'data',
            statusCode: 201,
            success: true
          })
        })
      );
    });

    it('should include success status in details', async () => {
      const req = {
        user: { userId: 1 },
        ip: '127.0.0.1',
        get: vi.fn().mockReturnValue('Mozilla/5.0'),
        params: {},
        route: { path: '/api/projects' }
      };
      const originalJson = vi.fn().mockReturnThis();
      const res = {
        statusCode: 400,
        json: originalJson
      };
      const next = vi.fn();

      const middleware = auditMiddleware('project.create');
      await middleware(req, res, next);
      res.json({ error: 'Bad request' });
      
      // Aguardar setImmediate para garantir que o callback seja executado
      await new Promise(resolve => setImmediate(resolve));
      await new Promise(resolve => setImmediate(resolve)); // Duplo para garantir

      expect(mockLogAction).toHaveBeenCalledWith(
        expect.objectContaining({
          details: expect.objectContaining({
            statusCode: 400,
            success: false
          })
        })
      );
    });
  });
});


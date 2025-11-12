import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import AuditController from '../../controllers/AuditController.js';
import { AuditService } from '../../services/AuditService.js';

vi.mock('../../services/AuditService.js');

describe('AuditController', () => {
  let app;
  let auditController;
  let mockAuditService;
  let mockAuth;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAuditService = {
      getLogs: vi.fn(),
      getLogById: vi.fn(),
      getLogsByUserId: vi.fn()
    };

    vi.mocked(AuditService).mockImplementation(() => mockAuditService);
    
    auditController = new AuditController();
    auditController.auditService = mockAuditService;
    
    mockAuth = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com', role: 'admin' };
      next();
    });
    
    app = express();
    app.use(express.json());
    
    app.get('/api/admin/audit-logs', mockAuth, auditController.getLogs);
    app.get('/api/admin/audit-logs/:id', mockAuth, auditController.getLogById);
    app.get('/api/admin/audit-logs/user/:userId', mockAuth, auditController.getLogsByUserId);
  });

  describe('GET /api/admin/audit-logs', () => {
    it('should get logs with filters successfully', async () => {
      const logs = [
        { id: 1, userId: 1, action: 'CREATE', resourceType: 'project' },
        { id: 2, userId: 1, action: 'UPDATE', resourceType: 'project' }
      ];
      
      mockAuditService.getLogs.mockResolvedValue({
        logs,
        total: 2,
        page: 1,
        limit: 100
      });

      const response = await request(app)
        .get('/api/admin/audit-logs')
        .query({ userId: 1, page: 1, limit: 100 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(logs);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.pagination.page).toBe(1);
      expect(response.body.pagination.limit).toBe(100);
    });

    it('should handle filters correctly', async () => {
      mockAuditService.getLogs.mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 100
      });

      const response = await request(app)
        .get('/api/admin/audit-logs')
        .query({
          userId: 1,
          action: 'CREATE',
          resourceType: 'project',
          startDate: '2024-01-01',
          endDate: '2024-12-31',
          page: 1,
          limit: 50
        });

      expect(response.status).toBe(200);
      expect(mockAuditService.getLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          userId: 1,
          action: 'CREATE',
          resourceType: 'project'
        })
      );
    });

    it('should limit maximum results per page', async () => {
      mockAuditService.getLogs.mockResolvedValue({
        logs: [],
        total: 0,
        page: 1,
        limit: 500
      });

      const response = await request(app)
        .get('/api/admin/audit-logs')
        .query({ limit: 1000 });

      expect(response.status).toBe(200);
      expect(mockAuditService.getLogs).toHaveBeenCalledWith(
        expect.objectContaining({
          limit: 500
        })
      );
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuditService.getLogs.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/admin/audit-logs');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Erro ao buscar logs de auditoria');
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /api/admin/audit-logs/:id', () => {
    it('should get log by id successfully', async () => {
      const log = { id: 1, userId: 1, action: 'CREATE', resourceType: 'project' };
      mockAuditService.getLogById.mockResolvedValue(log);

      const response = await request(app)
        .get('/api/admin/audit-logs/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(log);
      expect(mockAuditService.getLogById).toHaveBeenCalledWith(1);
    });

    it('should return 404 when log not found', async () => {
      mockAuditService.getLogById.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/admin/audit-logs/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Log não encontrado');
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuditService.getLogById.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/admin/audit-logs/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('GET /api/admin/audit-logs/user/:userId', () => {
    it('should get logs by user id successfully', async () => {
      const logs = [
        { id: 1, userId: 1, action: 'CREATE' },
        { id: 2, userId: 1, action: 'UPDATE' }
      ];
      mockAuditService.getLogsByUserId.mockResolvedValue(logs);

      const response = await request(app)
        .get('/api/admin/audit-logs/user/1')
        .query({ limit: 50 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(logs);
      expect(response.body.count).toBe(2);
      expect(mockAuditService.getLogsByUserId).toHaveBeenCalledWith(1, 50);
    });

    it('should use default limit when not provided', async () => {
      const logs = [];
      mockAuditService.getLogsByUserId.mockResolvedValue(logs);

      const response = await request(app)
        .get('/api/admin/audit-logs/user/1');

      expect(mockAuditService.getLogsByUserId).toHaveBeenCalledWith(1, 50);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockAuditService.getLogsByUserId.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/admin/audit-logs/user/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      
      consoleErrorSpy.mockRestore();
    });
  });
});


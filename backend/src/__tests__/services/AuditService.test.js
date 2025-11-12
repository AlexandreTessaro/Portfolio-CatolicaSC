import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditService } from '../../services/AuditService.js';
import { AuditRepository } from '../../repositories/AuditRepository.js';

vi.mock('../../repositories/AuditRepository.js');

describe('AuditService', () => {
  let auditService;
  let mockAuditRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockAuditRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findById: vi.fn(),
      findByUserId: vi.fn(),
      count: vi.fn()
    };

    vi.mocked(AuditRepository).mockImplementation(() => mockAuditRepository);
    
    auditService = new AuditService();
  });

  describe('logAction', () => {
    it('should log action successfully', async () => {
      const logData = {
        userId: 1,
        action: 'CREATE',
        resourceType: 'project',
        resourceId: 1,
        details: { name: 'Test Project' }
      };

      const createdLog = { id: 1, ...logData };
      mockAuditRepository.create.mockResolvedValue(createdLog);

      const result = await auditService.logAction(logData);

      expect(result).toEqual(createdLog);
      expect(mockAuditRepository.create).toHaveBeenCalledWith(logData);
    });

    it('should return null and log error when creation fails', async () => {
      const logData = { userId: 1, action: 'CREATE' };
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockAuditRepository.create.mockRejectedValue(new Error('Database error'));

      const result = await auditService.logAction(logData);

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getLogs', () => {
    it('should get logs with filters successfully', async () => {
      const filters = { userId: 1, limit: 10, offset: 0 };
      const logs = [{ id: 1, userId: 1 }, { id: 2, userId: 1 }];
      
      mockAuditRepository.findAll.mockResolvedValue(logs);
      mockAuditRepository.count.mockResolvedValue(2);

      const result = await auditService.getLogs(filters);

      expect(result.logs).toEqual(logs);
      expect(result.total).toBe(2);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(mockAuditRepository.findAll).toHaveBeenCalledWith(filters);
      expect(mockAuditRepository.count).toHaveBeenCalledWith(filters);
    });

    it('should use default limit when not provided', async () => {
      const filters = {};
      mockAuditRepository.findAll.mockResolvedValue([]);
      mockAuditRepository.count.mockResolvedValue(0);

      const result = await auditService.getLogs(filters);

      expect(result.limit).toBe(100);
    });

    it('should calculate page correctly', async () => {
      const filters = { limit: 20, offset: 40 };
      mockAuditRepository.findAll.mockResolvedValue([]);
      mockAuditRepository.count.mockResolvedValue(0);

      const result = await auditService.getLogs(filters);

      expect(result.page).toBe(3); // (40 / 20) + 1
    });

    it('should throw error when fetch fails', async () => {
      mockAuditRepository.findAll.mockRejectedValue(new Error('Database error'));

      await expect(
        auditService.getLogs({})
      ).rejects.toThrow('Erro ao buscar logs: Database error');
    });
  });

  describe('getLogById', () => {
    it('should get log by id successfully', async () => {
      const log = { id: 1, userId: 1, action: 'CREATE' };
      mockAuditRepository.findById.mockResolvedValue(log);

      const result = await auditService.getLogById(1);

      expect(result).toEqual(log);
      expect(mockAuditRepository.findById).toHaveBeenCalledWith(1);
    });

    it('should return null when log not found', async () => {
      mockAuditRepository.findById.mockResolvedValue(null);

      const result = await auditService.getLogById(999);

      expect(result).toBeNull();
    });

    it('should throw error when fetch fails', async () => {
      mockAuditRepository.findById.mockRejectedValue(new Error('Database error'));

      await expect(
        auditService.getLogById(1)
      ).rejects.toThrow('Erro ao buscar log: Database error');
    });
  });

  describe('getLogsByUserId', () => {
    it('should get logs by user id successfully', async () => {
      const logs = [{ id: 1, userId: 1 }, { id: 2, userId: 1 }];
      mockAuditRepository.findByUserId.mockResolvedValue(logs);

      const result = await auditService.getLogsByUserId(1, 50);

      expect(result).toEqual(logs);
      expect(mockAuditRepository.findByUserId).toHaveBeenCalledWith(1, 50);
    });

    it('should use default limit when not provided', async () => {
      const logs = [];
      mockAuditRepository.findByUserId.mockResolvedValue(logs);

      const result = await auditService.getLogsByUserId(1);

      expect(mockAuditRepository.findByUserId).toHaveBeenCalledWith(1, 50);
    });

    it('should throw error when fetch fails', async () => {
      mockAuditRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      await expect(
        auditService.getLogsByUserId(1)
      ).rejects.toThrow('Erro ao buscar logs do usuário: Database error');
    });
  });
});


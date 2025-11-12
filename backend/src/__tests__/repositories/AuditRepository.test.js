import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AuditRepository } from '../../repositories/AuditRepository.js';

describe('AuditRepository', () => {
  let auditRepository;
  let mockClient;
  let mockPool;

  beforeEach(() => {
    mockClient = {
      query: vi.fn(),
      release: vi.fn()
    };

    mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient)
    };

    auditRepository = new AuditRepository(mockPool);
  });

  describe('create', () => {
    it('should create an audit log successfully', async () => {
      const logData = {
        userId: 1,
        action: 'user.login',
        resourceType: 'user',
        resourceId: 1,
        details: { ip: '127.0.0.1' },
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0'
      };

      const expectedLog = {
        id: 1,
        user_id: 1,
        action: 'user.login',
        resource_type: 'user',
        resource_id: 1,
        details: JSON.stringify({ ip: '127.0.0.1' }),
        ip_address: '127.0.0.1',
        user_agent: 'Mozilla/5.0',
        created_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [expectedLog] });

      const result = await auditRepository.create(logData);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining([
          1,
          'user.login',
          'user',
          1,
          JSON.stringify({ ip: '127.0.0.1' }),
          '127.0.0.1',
          'Mozilla/5.0',
          expect.any(Date)
        ])
      );
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(expectedLog);
    });

    it('should create audit log with null values for optional fields', async () => {
      const logData = {
        action: 'system.event'
      };

      const expectedLog = {
        id: 1,
        user_id: null,
        action: 'system.event',
        resource_type: null,
        resource_id: null,
        details: '{}',
        ip_address: null,
        user_agent: null,
        created_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [expectedLog] });

      const result = await auditRepository.create(logData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO audit_logs'),
        expect.arrayContaining([
          null,
          'system.event',
          null,
          null,
          '{}',
          null,
          null,
          expect.any(Date)
        ])
      );
      expect(result).toEqual(expectedLog);
    });
  });

  describe('findAll', () => {
    it('should find all audit logs without filters', async () => {
      const logs = [
        { id: 1, action: 'user.login', user_id: 1 },
        { id: 2, action: 'project.create', user_id: 2 }
      ];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll();

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM audit_logs'),
        expect.arrayContaining([100, 0])
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with userId filter', async () => {
      const logs = [{ id: 1, action: 'user.login', user_id: 1 }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll({ userId: 1 });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('user_id = $1'),
        expect.arrayContaining([1, 100, 0])
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with action filter', async () => {
      const logs = [{ id: 1, action: 'user.login', user_id: 1 }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll({ action: 'user.login' });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('action = $'),
        expect.arrayContaining(['user.login', 100, 0])
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with resourceType filter', async () => {
      const logs = [{ id: 1, action: 'project.create', resource_type: 'project' }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll({ resourceType: 'project' });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('resource_type = $'),
        expect.arrayContaining(['project', 100, 0])
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with date range filters', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');
      const logs = [{ id: 1, action: 'user.login', created_at: startDate }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll({ startDate, endDate });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('created_at >= $'),
        expect.arrayContaining([startDate, endDate, 100, 0])
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with custom limit and offset', async () => {
      const logs = [{ id: 1, action: 'user.login' }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findAll({ limit: 50, offset: 10 });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $'),
        expect.arrayContaining([50, 10])
      );
      expect(result).toEqual(logs);
    });
  });

  describe('count', () => {
    it('should count audit logs without filters', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ count: '10' }] });

      const result = await auditRepository.count();

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) FROM audit_logs'),
        []
      );
      expect(result).toBe(10);
    });

    it('should count audit logs with userId filter', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ count: '5' }] });

      const result = await auditRepository.count({ userId: 1 });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('user_id = $1'),
        [1]
      );
      expect(result).toBe(5);
    });

    it('should count audit logs with multiple filters', async () => {
      const startDate = new Date('2024-01-01');
      mockClient.query.mockResolvedValue({ rows: [{ count: '3' }] });

      const result = await auditRepository.count({
        userId: 1,
        action: 'user.login',
        startDate
      });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('user_id = $1'),
        expect.arrayContaining([1, 'user.login', startDate])
      );
      expect(result).toBe(3);
    });
  });

  describe('findById', () => {
    it('should find audit log by id', async () => {
      const log = { id: 1, action: 'user.login', user_id: 1 };

      mockClient.query.mockResolvedValue({ rows: [log] });

      const result = await auditRepository.findById(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM audit_logs WHERE id = $1',
        [1]
      );
      expect(result).toEqual(log);
    });

    it('should return null when log not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await auditRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find audit logs by user id', async () => {
      const logs = [
        { id: 1, action: 'user.login', user_id: 1 },
        { id: 2, action: 'project.create', user_id: 1 }
      ];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findByUserId(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1'),
        [1, 50]
      );
      expect(result).toEqual(logs);
    });

    it('should find audit logs with custom limit', async () => {
      const logs = [{ id: 1, action: 'user.login', user_id: 1 }];

      mockClient.query.mockResolvedValue({ rows: logs });

      const result = await auditRepository.findByUserId(1, 10);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $2'),
        [1, 10]
      );
      expect(result).toEqual(logs);
    });
  });
});


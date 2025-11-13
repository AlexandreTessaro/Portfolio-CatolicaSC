import { describe, it, expect, beforeEach, vi } from 'vitest';
import { monitoringMiddleware, errorTrackingMiddleware, trackOperation } from '../../middleware/monitoring.js';
import monitoringService from '../../config/monitoring.js';

// Mock do monitoringService
vi.mock('../../config/monitoring.js', () => ({
  default: {
    requestTrackingMiddleware: vi.fn(() => (req, res, next) => next()),
    trackException: vi.fn(),
    trackMetric: vi.fn(),
    startTrace: vi.fn((name, callback) => callback())
  }
}));

describe('Monitoring Middleware', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('monitoringMiddleware', () => {
    it('should be a function', () => {
      expect(typeof monitoringMiddleware).toBe('function');
    });

    it('should call requestTrackingMiddleware', () => {
      const req = {};
      const res = {};
      const next = vi.fn();
      
      monitoringMiddleware(req, res, next);
      
      expect(monitoringService.requestTrackingMiddleware).toHaveBeenCalled();
    });
  });

  describe('errorTrackingMiddleware', () => {
    it('should track exception', () => {
      const err = new Error('Test error');
      const req = { method: 'GET', path: '/test', user: { userId: 1 } };
      const res = { statusCode: 500 };
      const next = vi.fn();
      
      errorTrackingMiddleware(err, req, res, next);
      
      expect(monitoringService.trackException).toHaveBeenCalledWith(
        err,
        expect.objectContaining({
          method: 'GET',
          path: '/test',
          status_code: 500
        })
      );
      expect(monitoringService.trackMetric).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
    });

    it('should handle request without user', () => {
      const err = new Error('Test error');
      const req = { method: 'GET', path: '/test' };
      const res = { statusCode: 500 };
      const next = vi.fn();
      
      errorTrackingMiddleware(err, req, res, next);
      
      expect(monitoringService.trackException).toHaveBeenCalled();
      expect(next).toHaveBeenCalledWith(err);
    });
  });

  describe('trackOperation', () => {
    it('should execute operation successfully', async () => {
      const operation = vi.fn().mockResolvedValue('result');
      
      const result = await trackOperation('test.operation', operation, { tag: 'value' });
      
      expect(operation).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should track error when operation fails', async () => {
      const error = new Error('Operation failed');
      const operation = vi.fn().mockRejectedValue(error);
      
      await expect(
        trackOperation('test.operation', operation)
      ).rejects.toThrow('Operation failed');
      
      expect(operation).toHaveBeenCalled();
    });
  });
});

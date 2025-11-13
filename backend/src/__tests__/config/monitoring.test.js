import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import monitoringService from '../../config/monitoring.js';

describe('MonitoringService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset do serviço
    monitoringService.initialized = false;
    monitoringService.client = null;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('initialize', () => {
    it('should initialize with no provider', async () => {
      process.env.MONITORING_PROVIDER = 'none';
      
      await monitoringService.initialize();
      
      expect(monitoringService.initialized).toBe(true);
      expect(monitoringService.client).toBeNull();
    });

    it('should handle missing provider gracefully', async () => {
      delete process.env.MONITORING_PROVIDER;
      
      await monitoringService.initialize();
      
      expect(monitoringService.initialized).toBe(true);
    });
  });

  describe('trackMetric', () => {
    it('should not track if not initialized', () => {
      monitoringService.initialized = false;
      
      expect(() => {
        monitoringService.trackMetric('test.metric', 100);
      }).not.toThrow();
    });

    it('should track metric when initialized', () => {
      monitoringService.initialized = true;
      monitoringService.client = {
        trackMetric: vi.fn()
      };
      
      monitoringService.trackMetric('test.metric', 100, { tag: 'value' });
      
      expect(monitoringService.client.trackMetric).toHaveBeenCalled();
    });
  });

  describe('trackEvent', () => {
    it('should not track if not initialized', () => {
      monitoringService.initialized = false;
      
      expect(() => {
        monitoringService.trackEvent('test.event', {});
      }).not.toThrow();
    });

    it('should track event when initialized', () => {
      monitoringService.initialized = true;
      monitoringService.client = {
        trackEvent: vi.fn()
      };
      
      monitoringService.trackEvent('test.event', { prop: 'value' });
      
      expect(monitoringService.client.trackEvent).toHaveBeenCalled();
    });
  });

  describe('trackException', () => {
    it('should not track if not initialized', () => {
      monitoringService.initialized = false;
      const error = new Error('Test error');
      
      expect(() => {
        monitoringService.trackException(error, {});
      }).not.toThrow();
    });

    it('should track exception when initialized', () => {
      monitoringService.initialized = true;
      monitoringService.client = {
        trackException: vi.fn()
      };
      const error = new Error('Test error');
      
      monitoringService.trackException(error, { context: 'test' });
      
      expect(monitoringService.client.trackException).toHaveBeenCalled();
    });
  });

  describe('startTrace', () => {
    it('should execute callback if not initialized', async () => {
      monitoringService.initialized = false;
      const callback = vi.fn().mockResolvedValue('result');
      
      const result = await monitoringService.startTrace('test.trace', callback);
      
      expect(callback).toHaveBeenCalled();
      expect(result).toBe('result');
    });

    it('should execute callback when initialized', async () => {
      monitoringService.initialized = true;
      monitoringService.client = null;
      const callback = vi.fn().mockResolvedValue('result');
      
      const result = await monitoringService.startTrace('test.trace', callback);
      
      expect(callback).toHaveBeenCalled();
      expect(result).toBe('result');
    });
  });

  describe('requestTrackingMiddleware', () => {
    it('should return middleware function', () => {
      const middleware = monitoringService.requestTrackingMiddleware();
      
      expect(typeof middleware).toBe('function');
    });

    it('should call next if not initialized', () => {
      monitoringService.initialized = false;
      const middleware = monitoringService.requestTrackingMiddleware();
      const req = { method: 'GET', path: '/test' };
      const res = { send: vi.fn() };
      const next = vi.fn();
      
      middleware(req, res, next);
      
      expect(next).toHaveBeenCalled();
    });
  });
});

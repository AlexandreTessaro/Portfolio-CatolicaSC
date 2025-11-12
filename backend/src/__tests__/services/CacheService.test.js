import { describe, it, expect, beforeEach, vi } from 'vitest';
import { CacheService } from '../../services/CacheService.js';
import redisClient from '../../config/redis.js';

vi.mock('../../config/redis.js', () => ({
  default: {
    isOpen: true,
    get: vi.fn(),
    set: vi.fn(),
    del: vi.fn(),
    info: vi.fn()
  }
}));

describe('CacheService', () => {
  let cacheService;
  let mockRedisClient;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRedisClient = redisClient;
    mockRedisClient.isOpen = true;
    cacheService = new CacheService();
  });

  describe('_getKey', () => {
    it('should generate correct cache key', () => {
      const key = cacheService._getKey('project', 1);
      expect(key).toBe('cache:project:1');
    });
  });

  describe('get', () => {
    it('should get value from cache successfully', async () => {
      const cachedValue = JSON.stringify({ id: 1, name: 'Test' });
      mockRedisClient.get.mockResolvedValue(cachedValue);

      const result = await cacheService.get('test-key');

      expect(result).toEqual({ id: 1, name: 'Test' });
      expect(mockRedisClient.get).toHaveBeenCalledWith('test-key');
    });

    it('should return null when key not found', async () => {
      mockRedisClient.get.mockResolvedValue(null);

      const result = await cacheService.get('non-existent');

      expect(result).toBeNull();
    });

    it('should return null when Redis is not open', async () => {
      mockRedisClient.isOpen = false;

      const result = await cacheService.get('test-key');

      expect(result).toBeNull();
      expect(mockRedisClient.get).not.toHaveBeenCalled();
    });

    it('should return null and log error when get fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockRedisClient.get.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.get('test-key');

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('set', () => {
    it('should set value in cache successfully', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.set('test-key', { id: 1 }, 3600);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ id: 1 }),
        { EX: 3600 }
      );
    });

    it('should use default TTL when not provided', async () => {
      mockRedisClient.set.mockResolvedValue('OK');

      await cacheService.set('test-key', { id: 1 });

      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'test-key',
        JSON.stringify({ id: 1 }),
        { EX: 3600 }
      );
    });

    it('should return false when Redis is not open', async () => {
      mockRedisClient.isOpen = false;

      const result = await cacheService.set('test-key', { id: 1 });

      expect(result).toBe(false);
      expect(mockRedisClient.set).not.toHaveBeenCalled();
    });

    it('should return false and log error when set fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockRedisClient.set.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.set('test-key', { id: 1 });

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('delete', () => {
    it('should delete key from cache successfully', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      const result = await cacheService.delete('test-key');

      expect(result).toBe(true);
      expect(mockRedisClient.del).toHaveBeenCalledWith('test-key');
    });

    it('should return false when Redis is not open', async () => {
      mockRedisClient.isOpen = false;

      const result = await cacheService.delete('test-key');

      expect(result).toBe(false);
      expect(mockRedisClient.del).not.toHaveBeenCalled();
    });

    it('should return false and log error when delete fails', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockRedisClient.del.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.delete('test-key');

      expect(result).toBe(false);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('deletePattern', () => {
    it('should return true (placeholder implementation)', async () => {
      const result = await cacheService.deletePattern('pattern:*');

      expect(result).toBe(true);
    });

    it('should return false when Redis is not open', async () => {
      mockRedisClient.isOpen = false;

      const result = await cacheService.deletePattern('pattern:*');

      expect(result).toBe(false);
    });
  });

  describe('Project cache methods', () => {
    it('should get project from cache', async () => {
      const project = { id: 1, title: 'Test Project' };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(project));

      const result = await cacheService.getProject(1);

      expect(result).toEqual(project);
      expect(mockRedisClient.get).toHaveBeenCalledWith('cache:project:1');
    });

    it('should set project in cache', async () => {
      const project = { id: 1, title: 'Test Project' };
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setProject(1, project, 1800);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'cache:project:1',
        JSON.stringify(project),
        { EX: 1800 }
      );
    });

    it('should invalidate project cache', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await cacheService.invalidateProject(1);

      expect(mockRedisClient.del).toHaveBeenCalledWith('cache:project:1');
      expect(mockRedisClient.del).toHaveBeenCalledWith('cache:projects:list');
      expect(mockRedisClient.del).toHaveBeenCalledWith('cache:projects:popular');
    });
  });

  describe('Projects list cache methods', () => {
    it('should get projects list from cache', async () => {
      const filters = { status: 'active' };
      const projects = [{ id: 1 }, { id: 2 }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(projects));

      const result = await cacheService.getProjectsList(filters);

      expect(result).toEqual(projects);
    });

    it('should set projects list in cache', async () => {
      const filters = { status: 'active' };
      const projects = [{ id: 1 }, { id: 2 }];
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setProjectsList(filters, projects, 600);

      expect(result).toBe(true);
    });
  });

  describe('Popular projects cache methods', () => {
    it('should get popular projects from cache', async () => {
      const projects = [{ id: 1 }, { id: 2 }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(projects));

      const result = await cacheService.getPopularProjects(10);

      expect(result).toEqual(projects);
      expect(mockRedisClient.get).toHaveBeenCalledWith('cache:projects:popular:10');
    });

    it('should set popular projects in cache', async () => {
      const projects = [{ id: 1 }, { id: 2 }];
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setPopularProjects(10, projects, 300);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'cache:projects:popular:10',
        JSON.stringify(projects),
        { EX: 300 }
      );
    });
  });

  describe('User cache methods', () => {
    it('should get user from cache', async () => {
      const user = { id: 1, name: 'Test User' };
      mockRedisClient.get.mockResolvedValue(JSON.stringify(user));

      const result = await cacheService.getUser(1);

      expect(result).toEqual(user);
      expect(mockRedisClient.get).toHaveBeenCalledWith('cache:user:1');
    });

    it('should set user in cache', async () => {
      const user = { id: 1, name: 'Test User' };
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setUser(1, user, 1800);

      expect(result).toBe(true);
      expect(mockRedisClient.set).toHaveBeenCalledWith(
        'cache:user:1',
        JSON.stringify(user),
        { EX: 1800 }
      );
    });

    it('should invalidate user cache', async () => {
      mockRedisClient.del.mockResolvedValue(1);

      await cacheService.invalidateUser(1);

      expect(mockRedisClient.del).toHaveBeenCalledWith('cache:user:1');
    });
  });

  describe('Recommendations cache methods', () => {
    it('should get project recommendations from cache', async () => {
      const recommendations = [{ id: 1 }, { id: 2 }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(recommendations));

      const result = await cacheService.getProjectRecommendations(1, 10);

      expect(result).toEqual(recommendations);
      expect(mockRedisClient.get).toHaveBeenCalledWith('cache:recommendations:projects:1:10');
    });

    it('should set project recommendations in cache', async () => {
      const recommendations = [{ id: 1 }, { id: 2 }];
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setProjectRecommendations(1, 10, recommendations, 600);

      expect(result).toBe(true);
    });

    it('should get user recommendations from cache', async () => {
      const recommendations = [{ id: 1 }, { id: 2 }];
      mockRedisClient.get.mockResolvedValue(JSON.stringify(recommendations));

      const result = await cacheService.getUserRecommendations(1, 10);

      expect(result).toEqual(recommendations);
      expect(mockRedisClient.get).toHaveBeenCalledWith('cache:recommendations:users:1:10');
    });

    it('should set user recommendations in cache', async () => {
      const recommendations = [{ id: 1 }, { id: 2 }];
      mockRedisClient.set.mockResolvedValue('OK');

      const result = await cacheService.setUserRecommendations(1, 10, recommendations, 600);

      expect(result).toBe(true);
    });
  });

  describe('getStats', () => {
    it('should get stats when Redis is open', async () => {
      mockRedisClient.isOpen = true;
      mockRedisClient.info.mockResolvedValue('redis_version:7.0.0');

      const result = await cacheService.getStats();

      expect(result.enabled).toBe(true);
      expect(result.info).toBe('redis_version:7.0.0');
      expect(mockRedisClient.info).toHaveBeenCalledWith('stats');
    });

    it('should return disabled when Redis is not open', async () => {
      mockRedisClient.isOpen = false;

      const result = await cacheService.getStats();

      expect(result.enabled).toBe(false);
      expect(result.message).toBe('Redis não está conectado');
      expect(mockRedisClient.info).not.toHaveBeenCalled();
    });

    it('should return error when info fails', async () => {
      mockRedisClient.isOpen = true;
      mockRedisClient.info.mockRejectedValue(new Error('Redis error'));

      const result = await cacheService.getStats();

      expect(result.enabled).toBe(false);
      expect(result.error).toBe('Redis error');
    });
  });
});


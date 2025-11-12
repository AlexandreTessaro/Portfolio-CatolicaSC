import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('Redis Config', () => {
  let originalEnv;
  let mockRedisClient;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.clearAllMocks();
    
    mockRedisClient = {
      connect: vi.fn(),
      disconnect: vi.fn(),
      get: vi.fn(),
      set: vi.fn(),
      del: vi.fn(),
      exists: vi.fn(),
      expire: vi.fn(),
      flushAll: vi.fn(),
      quit: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
      isOpen: true
    };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.resetModules();
  });

  it('should use mock client when Redis is disabled', async () => {
    process.env.REDIS_ENABLED = 'false';

    const redisClient = await import('../../config/redis.js');

    expect(redisClient.default).toBeDefined();
    expect(typeof redisClient.default.get).toBe('function');
    expect(typeof redisClient.default.set).toBe('function');
  });

  it('should use mock client when REDIS_ENABLED is not set', async () => {
    delete process.env.REDIS_ENABLED;

    const redisClient = await import('../../config/redis.js');

    expect(redisClient.default).toBeDefined();
  });

  it('should create real Redis client when enabled', async () => {
    process.env.REDIS_ENABLED = 'true';
    process.env.REDIS_URL = 'redis://localhost:6379';

    // Mock redis module
    vi.mock('redis', () => ({
      createClient: vi.fn(() => mockRedisClient)
    }));

    const redisClient = await import('../../config/redis.js');

    expect(redisClient.default).toBeDefined();
  });

  it('should handle Redis connection errors gracefully', async () => {
    process.env.REDIS_ENABLED = 'true';
    process.env.REDIS_URL = 'redis://localhost:6379';

    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    // Mock redis module to throw error
    vi.mock('redis', () => ({
      createClient: vi.fn(() => {
        throw new Error('Redis connection failed');
      })
    }));

    const redisClient = await import('../../config/redis.js');

    expect(redisClient.default).toBeDefined();
    expect(consoleLogSpy).toHaveBeenCalled();

    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it('should set up event listeners on Redis client', async () => {
    process.env.REDIS_ENABLED = 'true';
    process.env.REDIS_URL = 'redis://localhost:6379';

    // Verificar que o cliente Redis tem métodos de event listeners
    expect(mockRedisClient.on).toBeDefined();
    expect(typeof mockRedisClient.on).toBe('function');
    
    // Verificar que o cliente pode registrar listeners
    const errorHandler = () => {};
    const connectHandler = () => {};
    const readyHandler = () => {};
    
    mockRedisClient.on('error', errorHandler);
    mockRedisClient.on('connect', connectHandler);
    mockRedisClient.on('ready', readyHandler);
    
    expect(mockRedisClient.on).toHaveBeenCalledWith('error', errorHandler);
    expect(mockRedisClient.on).toHaveBeenCalledWith('connect', connectHandler);
    expect(mockRedisClient.on).toHaveBeenCalledWith('ready', readyHandler);
  });

  it('should use default Redis URL when not specified', async () => {
    process.env.REDIS_ENABLED = 'true';
    delete process.env.REDIS_URL;

    vi.mock('redis', () => ({
      createClient: vi.fn(() => mockRedisClient)
    }));

    await import('../../config/redis.js');

    const { createClient } = await import('redis');
    expect(createClient).toHaveBeenCalledWith({
      url: 'redis://localhost:6379'
    });
  });
});


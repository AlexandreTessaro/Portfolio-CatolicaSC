import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock usando vi.hoisted para garantir que seja aplicado antes da importação
const { mockCreateNotification, mockEmitNotification } = vi.hoisted(() => {
  const mockCreateNotification = vi.fn();
  const mockEmitNotification = vi.fn();
  return { mockCreateNotification, mockEmitNotification };
});

vi.mock('../../services/NotificationService.js', () => ({
  NotificationService: vi.fn().mockImplementation(() => ({
    createNotification: mockCreateNotification
  }))
}));

vi.mock('../../config/socket.js', () => ({
  emitNotification: mockEmitNotification
}));

import { createAndEmitNotification, getIO } from '../../utils/notificationHelper.js';

describe('notificationHelper', () => {
  let mockIO;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockCreateNotification.mockResolvedValue(null);
    mockEmitNotification.mockImplementation(() => {});

    mockIO = {
      to: vi.fn().mockReturnThis(),
      emit: vi.fn()
    };
  });

  describe('createAndEmitNotification', () => {
    it('should create notification and emit via socket', async () => {
      const userId = 1;
      const type = 'match_request';
      const title = 'New Match Request';
      const message = 'You have a new match request';
      const data = { projectId: 123 };

      const mockNotification = {
        id: 1,
        type,
        title,
        message,
        data: JSON.stringify(data),
        is_read: false,
        created_at: new Date()
      };

      mockCreateNotification.mockResolvedValue(mockNotification);

      const result = await createAndEmitNotification(
        mockIO,
        userId,
        type,
        title,
        message,
        data
      );

      expect(mockCreateNotification).toHaveBeenCalledWith(
        userId,
        type,
        title,
        message,
        data
      );
      expect(mockEmitNotification).toHaveBeenCalledWith(
        mockIO,
        userId,
        expect.objectContaining({
          id: 1,
          type,
          title,
          message,
          data,
          is_read: false
        })
      );
      expect(result).toEqual(mockNotification);
    });

    it('should handle notification data as object', async () => {
      const userId = 1;
      const data = { projectId: 123 };

      const mockNotification = {
        id: 1,
        type: 'match_request',
        title: 'Test',
        message: 'Test message',
        data: data, // Already an object
        is_read: false,
        created_at: new Date()
      };

      mockCreateNotification.mockResolvedValue(mockNotification);

      await createAndEmitNotification(mockIO, userId, 'match_request', 'Test', 'Test message', data);

      expect(mockEmitNotification).toHaveBeenCalledWith(
        mockIO,
        userId,
        expect.objectContaining({
          data
        })
      );
    });

    it('should handle notification data as string', async () => {
      const userId = 1;
      const data = { projectId: 123 };

      const mockNotification = {
        id: 1,
        type: 'match_request',
        title: 'Test',
        message: 'Test message',
        data: JSON.stringify(data),
        is_read: false,
        created_at: new Date()
      };

      mockCreateNotification.mockResolvedValue(mockNotification);

      await createAndEmitNotification(mockIO, userId, 'match_request', 'Test', 'Test message', data);

      expect(mockEmitNotification).toHaveBeenCalledWith(
        mockIO,
        userId,
        expect.objectContaining({
          data
        })
      );
    });

    it('should return null if io is not provided', async () => {
      const userId = 1;
      const mockNotification = {
        id: 1,
        type: 'match_request',
        title: 'Test',
        message: 'Test message',
        data: {},
        is_read: false,
        created_at: new Date()
      };

      mockCreateNotification.mockResolvedValue(mockNotification);

      const result = await createAndEmitNotification(
        null,
        userId,
        'match_request',
        'Test',
        'Test message'
      );

      expect(mockCreateNotification).toHaveBeenCalled();
      expect(mockEmitNotification).not.toHaveBeenCalled();
      expect(result).toEqual(mockNotification);
    });

    it('should handle errors gracefully', async () => {
      const userId = 1;
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      mockCreateNotification.mockRejectedValue(new Error('Database error'));

      const result = await createAndEmitNotification(
        mockIO,
        userId,
        'match_request',
        'Test',
        'Test message'
      );

      expect(result).toBeNull();
      expect(consoleErrorSpy).toHaveBeenCalled();
      consoleErrorSpy.mockRestore();
    });
  });

  describe('getIO', () => {
    it('should get io from app', () => {
      const mockIO = { emit: vi.fn() };
      const req = {
        app: {
          get: vi.fn().mockReturnValue(mockIO)
        }
      };

      const result = getIO(req);

      expect(req.app.get).toHaveBeenCalledWith('io');
      expect(result).toEqual(mockIO);
    });

    it('should return null if io is not set', () => {
      const req = {
        app: {
          get: vi.fn().mockReturnValue(null)
        }
      };

      const result = getIO(req);

      expect(result).toBeNull();
    });
  });
});


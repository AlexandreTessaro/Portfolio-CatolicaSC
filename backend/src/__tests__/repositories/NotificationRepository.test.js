import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationRepository } from '../../repositories/NotificationRepository.js';

describe('NotificationRepository', () => {
  let notificationRepository;
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

    notificationRepository = new NotificationRepository(mockPool);
  });

  describe('create', () => {
    it('should create a notification successfully', async () => {
      const notificationData = {
        userId: 1,
        type: 'match_request',
        title: 'New Match Request',
        message: 'You have a new match request',
        data: { matchId: 1 }
      };

      const expectedNotification = {
        id: 1,
        user_id: 1,
        type: 'match_request',
        title: 'New Match Request',
        message: 'You have a new match request',
        data: JSON.stringify({ matchId: 1 }),
        is_read: false,
        created_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [expectedNotification] });

      const result = await notificationRepository.create(notificationData);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        expect.arrayContaining([
          1,
          'match_request',
          'New Match Request',
          'You have a new match request',
          JSON.stringify({ matchId: 1 }),
          false,
          expect.any(Date)
        ])
      );
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toEqual(expectedNotification);
    });

    it('should create notification with empty data object', async () => {
      const notificationData = {
        userId: 1,
        type: 'info',
        title: 'Info',
        message: 'Info message'
      };

      const expectedNotification = {
        id: 1,
        user_id: 1,
        type: 'info',
        title: 'Info',
        message: 'Info message',
        data: '{}',
        is_read: false,
        created_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [expectedNotification] });

      const result = await notificationRepository.create(notificationData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO notifications'),
        expect.arrayContaining([
          1,
          'info',
          'Info',
          'Info message',
          '{}',
          false,
          expect.any(Date)
        ])
      );
      expect(result).toEqual(expectedNotification);
    });
  });

  describe('findByUserId', () => {
    it('should find notifications by user id', async () => {
      const notifications = [
        { id: 1, user_id: 1, type: 'match_request', is_read: false },
        { id: 2, user_id: 1, type: 'match_accepted', is_read: true }
      ];

      mockClient.query.mockResolvedValue({ rows: notifications });

      const result = await notificationRepository.findByUserId(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE user_id = $1'),
        [1, 50, 0]
      );
      expect(result).toEqual(notifications);
    });

    it('should find unread notifications only', async () => {
      const notifications = [
        { id: 1, user_id: 1, type: 'match_request', is_read: false }
      ];

      mockClient.query.mockResolvedValue({ rows: notifications });

      const result = await notificationRepository.findByUserId(1, { unreadOnly: true });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('AND is_read = false'),
        [1, 50, 0]
      );
      expect(result).toEqual(notifications);
    });

    it('should find notifications with custom limit and offset', async () => {
      const notifications = [{ id: 1, user_id: 1, type: 'match_request' }];

      mockClient.query.mockResolvedValue({ rows: notifications });

      const result = await notificationRepository.findByUserId(1, {
        limit: 20,
        offset: 10
      });

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $2 OFFSET $3'),
        [1, 20, 10]
      );
      expect(result).toEqual(notifications);
    });
  });

  describe('countUnread', () => {
    it('should count unread notifications', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ count: '5' }] });

      const result = await notificationRepository.countUnread(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('COUNT(*) as count'),
        [1]
      );
      expect(result).toBe(5);
    });

    it('should return 0 when no unread notifications', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ count: '0' }] });

      const result = await notificationRepository.countUnread(1);

      expect(result).toBe(0);
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read', async () => {
      const notification = {
        id: 1,
        user_id: 1,
        type: 'match_request',
        is_read: true
      };

      mockClient.query.mockResolvedValue({ rows: [notification] });

      const result = await notificationRepository.markAsRead(1, 1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE notifications'),
        [1, 1]
      );
      expect(result).toEqual(notification);
    });

    it('should return undefined when notification not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await notificationRepository.markAsRead(999, 1);

      expect(result).toBeUndefined();
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read', async () => {
      const notifications = [
        { id: 1, user_id: 1, is_read: true },
        { id: 2, user_id: 1, is_read: true }
      ];

      mockClient.query.mockResolvedValue({ rows: notifications });

      const result = await notificationRepository.markAllAsRead(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE notifications'),
        [1]
      );
      expect(result).toEqual(notifications);
    });

    it('should return empty array when no unread notifications', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await notificationRepository.markAllAsRead(1);

      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete notification successfully', async () => {
      const notification = {
        id: 1,
        user_id: 1,
        type: 'match_request'
      };

      mockClient.query.mockResolvedValue({ rows: [notification] });

      const result = await notificationRepository.delete(1, 1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM notifications'),
        [1, 1]
      );
      expect(result).toEqual(notification);
    });

    it('should return undefined when notification not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await notificationRepository.delete(999, 1);

      expect(result).toBeUndefined();
    });
  });

  describe('findById', () => {
    it('should find notification by id', async () => {
      const notification = {
        id: 1,
        user_id: 1,
        type: 'match_request',
        title: 'New Match Request'
      };

      mockClient.query.mockResolvedValue({ rows: [notification] });

      const result = await notificationRepository.findById(1, 1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE id = $1 AND user_id = $2'),
        [1, 1]
      );
      expect(result).toEqual(notification);
    });

    it('should return null when notification not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await notificationRepository.findById(999, 1);

      expect(result).toBeNull();
    });
  });
});


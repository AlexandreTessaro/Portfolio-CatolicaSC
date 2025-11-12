import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { NotificationService } from '../../services/NotificationService.js';
import { NotificationController } from '../../controllers/NotificationController.js';

vi.mock('../../services/NotificationService.js');

describe('NotificationController', () => {
  let app;
  let notificationController;
  let mockNotificationService;
  let mockAuth;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockNotificationService = {
      getUserNotifications: vi.fn(),
      getUnreadCount: vi.fn(),
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      deleteNotification: vi.fn()
    };

    vi.mocked(NotificationService).mockImplementation(() => mockNotificationService);
    
    // Criar nova instância da classe
    notificationController = new NotificationController();
    notificationController.notificationService = mockNotificationService;
    
    mockAuth = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    app = express();
    app.use(express.json());
    
    app.get('/api/notifications', mockAuth, (req, res) => notificationController.list(req, res));
    app.get('/api/notifications/unread-count', mockAuth, (req, res) => notificationController.getUnreadCount(req, res));
    app.put('/api/notifications/:id/read', mockAuth, (req, res) => notificationController.markAsRead(req, res));
    app.put('/api/notifications/read-all', mockAuth, (req, res) => notificationController.markAllAsRead(req, res));
    app.delete('/api/notifications/:id', mockAuth, (req, res) => notificationController.delete(req, res));
  });

  describe('GET /api/notifications', () => {
    it('should list notifications successfully', async () => {
      const notifications = [
        { id: 1, userId: 1, title: 'Test', message: 'Test message' },
        { id: 2, userId: 1, title: 'Test 2', message: 'Test message 2' }
      ];
      mockNotificationService.getUserNotifications.mockResolvedValue(notifications);

      const response = await request(app)
        .get('/api/notifications')
        .query({ limit: 50, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(notifications);
      expect(mockNotificationService.getUserNotifications).toHaveBeenCalledWith(1, {
        limit: 50,
        offset: 0,
        unreadOnly: false
      });
    });

    it('should handle unreadOnly query parameter', async () => {
      const notifications = [{ id: 1, userId: 1, is_read: false }];
      mockNotificationService.getUserNotifications.mockResolvedValue(notifications);

      const response = await request(app)
        .get('/api/notifications')
        .query({ unreadOnly: 'true' });

      expect(response.status).toBe(200);
      expect(mockNotificationService.getUserNotifications).toHaveBeenCalledWith(1, {
        limit: 50,
        offset: 0,
        unreadOnly: true
      });
    });

    it('should handle errors', async () => {
      mockNotificationService.getUserNotifications.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/notifications');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Database error');
    });
  });

  describe('GET /api/notifications/unread-count', () => {
    it('should get unread count successfully', async () => {
      mockNotificationService.getUnreadCount.mockResolvedValue(5);

      const response = await request(app)
        .get('/api/notifications/unread-count');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(5);
      expect(mockNotificationService.getUnreadCount).toHaveBeenCalledWith(1);
    });

    it('should handle errors', async () => {
      mockNotificationService.getUnreadCount.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/notifications/unread-count');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/notifications/:id/read', () => {
    it('should mark notification as read successfully', async () => {
      const notification = { id: 1, userId: 1, is_read: true };
      mockNotificationService.markAsRead.mockResolvedValue(notification);

      const response = await request(app)
        .put('/api/notifications/1/read');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(notification);
      expect(mockNotificationService.markAsRead).toHaveBeenCalledWith('1', 1);
    });

    it('should handle notification not found', async () => {
      mockNotificationService.markAsRead.mockRejectedValue(new Error('Notificação não encontrada'));

      const response = await request(app)
        .put('/api/notifications/999/read');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/notifications/read-all', () => {
    it('should mark all notifications as read successfully', async () => {
      const notifications = [{ id: 1 }, { id: 2 }];
      mockNotificationService.markAllAsRead.mockResolvedValue(notifications);

      const response = await request(app)
        .put('/api/notifications/read-all');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.count).toBe(2);
      expect(mockNotificationService.markAllAsRead).toHaveBeenCalledWith(1);
    });

    it('should handle errors', async () => {
      mockNotificationService.markAllAsRead.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .put('/api/notifications/read-all');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('DELETE /api/notifications/:id', () => {
    it('should delete notification successfully', async () => {
      mockNotificationService.deleteNotification.mockResolvedValue(true);

      const response = await request(app)
        .delete('/api/notifications/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Notificação deletada com sucesso');
      expect(mockNotificationService.deleteNotification).toHaveBeenCalledWith('1', 1);
    });

    it('should handle notification not found', async () => {
      mockNotificationService.deleteNotification.mockRejectedValue(new Error('Notificação não encontrada'));

      const response = await request(app)
        .delete('/api/notifications/999');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });
});


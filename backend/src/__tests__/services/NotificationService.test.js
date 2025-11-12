import { describe, it, expect, beforeEach, vi } from 'vitest';
import { NotificationService } from '../../services/NotificationService.js';
import { NotificationRepository } from '../../repositories/NotificationRepository.js';

vi.mock('../../repositories/NotificationRepository.js');

describe('NotificationService', () => {
  let notificationService;
  let mockNotificationRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockNotificationRepository = {
      create: vi.fn(),
      findByUserId: vi.fn(),
      countUnread: vi.fn(),
      findById: vi.fn(),
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      delete: vi.fn()
    };

    vi.mocked(NotificationRepository).mockImplementation(() => mockNotificationRepository);
    
    notificationService = new NotificationService();
  });

  describe('createNotification', () => {
    it('should create a notification successfully', async () => {
      const notificationData = {
        id: 1,
        userId: 1,
        type: 'match_request',
        title: 'Test',
        message: 'Test message',
        data: {}
      };

      mockNotificationRepository.create.mockResolvedValue(notificationData);

      const result = await notificationService.createNotification(
        1,
        'match_request',
        'Test',
        'Test message',
        {}
      );

      expect(result).toEqual(notificationData);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 1,
        type: 'match_request',
        title: 'Test',
        message: 'Test message',
        data: {}
      });
    });

    it('should throw error when creation fails', async () => {
      mockNotificationRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.createNotification(1, 'match_request', 'Test', 'Message')
      ).rejects.toThrow('Erro ao criar notificação: Database error');
    });
  });

  describe('getUserNotifications', () => {
    it('should get user notifications successfully', async () => {
      const notifications = [
        { id: 1, userId: 1, data: '{"key":"value"}' },
        { id: 2, userId: 1, data: { key: 'value' } }
      ];

      mockNotificationRepository.findByUserId.mockResolvedValue(notifications);

      const result = await notificationService.getUserNotifications(1, { limit: 10 });

      expect(result).toHaveLength(2);
      expect(result[0].data).toEqual({ key: 'value' });
      expect(result[1].data).toEqual({ key: 'value' });
      expect(mockNotificationRepository.findByUserId).toHaveBeenCalledWith(1, { limit: 10 });
    });

    it('should throw error when fetch fails', async () => {
      mockNotificationRepository.findByUserId.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.getUserNotifications(1)
      ).rejects.toThrow('Erro ao buscar notificações: Database error');
    });
  });

  describe('getUnreadCount', () => {
    it('should get unread count successfully', async () => {
      mockNotificationRepository.countUnread.mockResolvedValue(5);

      const result = await notificationService.getUnreadCount(1);

      expect(result).toBe(5);
      expect(mockNotificationRepository.countUnread).toHaveBeenCalledWith(1);
    });

    it('should throw error when count fails', async () => {
      mockNotificationRepository.countUnread.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.getUnreadCount(1)
      ).rejects.toThrow('Erro ao contar notificações não lidas: Database error');
    });
  });

  describe('markAsRead', () => {
    it('should mark notification as read successfully', async () => {
      const notification = { id: 1, userId: 1, is_read: false };
      const updatedNotification = { ...notification, is_read: true };

      mockNotificationRepository.findById.mockResolvedValue(notification);
      mockNotificationRepository.markAsRead.mockResolvedValue(updatedNotification);

      const result = await notificationService.markAsRead(1, 1);

      expect(result).toEqual(updatedNotification);
      expect(mockNotificationRepository.markAsRead).toHaveBeenCalledWith(1, 1);
    });

    it('should return notification if already read', async () => {
      const notification = { id: 1, userId: 1, is_read: true };

      mockNotificationRepository.findById.mockResolvedValue(notification);

      const result = await notificationService.markAsRead(1, 1);

      expect(result).toEqual(notification);
      expect(mockNotificationRepository.markAsRead).not.toHaveBeenCalled();
    });

    it('should throw error when notification not found', async () => {
      mockNotificationRepository.findById.mockResolvedValue(null);

      await expect(
        notificationService.markAsRead(1, 1)
      ).rejects.toThrow('Erro ao marcar notificação como lida: Notificação não encontrada');
    });

    it('should throw error when mark fails', async () => {
      mockNotificationRepository.findById.mockResolvedValue({ id: 1, is_read: false });
      mockNotificationRepository.markAsRead.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.markAsRead(1, 1)
      ).rejects.toThrow('Erro ao marcar notificação como lida: Database error');
    });
  });

  describe('markAllAsRead', () => {
    it('should mark all notifications as read successfully', async () => {
      const notifications = [{ id: 1 }, { id: 2 }];
      mockNotificationRepository.markAllAsRead.mockResolvedValue(notifications);

      const result = await notificationService.markAllAsRead(1);

      expect(result).toEqual(notifications);
      expect(mockNotificationRepository.markAllAsRead).toHaveBeenCalledWith(1);
    });

    it('should throw error when mark all fails', async () => {
      mockNotificationRepository.markAllAsRead.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.markAllAsRead(1)
      ).rejects.toThrow('Erro ao marcar todas as notificações como lidas: Database error');
    });
  });

  describe('deleteNotification', () => {
    it('should delete notification successfully', async () => {
      const notification = { id: 1, userId: 1 };
      mockNotificationRepository.findById.mockResolvedValue(notification);
      mockNotificationRepository.delete.mockResolvedValue(true);

      const result = await notificationService.deleteNotification(1, 1);

      expect(result).toBe(true);
      expect(mockNotificationRepository.delete).toHaveBeenCalledWith(1, 1);
    });

    it('should throw error when notification not found', async () => {
      mockNotificationRepository.findById.mockResolvedValue(null);

      await expect(
        notificationService.deleteNotification(1, 1)
      ).rejects.toThrow('Erro ao deletar notificação: Notificação não encontrada');
    });

    it('should throw error when delete fails', async () => {
      mockNotificationRepository.findById.mockResolvedValue({ id: 1 });
      mockNotificationRepository.delete.mockRejectedValue(new Error('Database error'));

      await expect(
        notificationService.deleteNotification(1, 1)
      ).rejects.toThrow('Erro ao deletar notificação: Database error');
    });
  });

  describe('notifyMatchRequest', () => {
    it('should create match request notification', async () => {
      const notification = { id: 1, type: 'match_request' };
      mockNotificationRepository.create.mockResolvedValue(notification);

      const result = await notificationService.notifyMatchRequest(1, 'John', 'Project', 1);

      expect(result).toEqual(notification);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 1,
        type: 'match_request',
        title: 'Nova solicitação de colaboração',
        message: 'John quer colaborar no projeto "Project"',
        data: { projectId: 1, senderName: 'John' }
      });
    });
  });

  describe('notifyMatchAccepted', () => {
    it('should create match accepted notification', async () => {
      const notification = { id: 1, type: 'match_accepted' };
      mockNotificationRepository.create.mockResolvedValue(notification);

      const result = await notificationService.notifyMatchAccepted(1, 'Project', 1);

      expect(result).toEqual(notification);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 1,
        type: 'match_accepted',
        title: 'Solicitação aceita!',
        message: 'Sua solicitação para colaborar no projeto "Project" foi aceita!',
        data: { projectId: 1, projectTitle: 'Project' }
      });
    });
  });

  describe('notifyMatchRejected', () => {
    it('should create match rejected notification', async () => {
      const notification = { id: 1, type: 'match_rejected' };
      mockNotificationRepository.create.mockResolvedValue(notification);

      const result = await notificationService.notifyMatchRejected(1, 'Project', 1);

      expect(result).toEqual(notification);
      expect(mockNotificationRepository.create).toHaveBeenCalledWith({
        userId: 1,
        type: 'match_rejected',
        title: 'Solicitação recusada',
        message: 'Sua solicitação para colaborar no projeto "Project" foi recusada.',
        data: { projectId: 1, projectTitle: 'Project' }
      });
    });
  });

  describe('NotificationTypes', () => {
    it('should have correct notification types', () => {
      expect(NotificationService.NotificationTypes.MATCH_REQUEST).toBe('match_request');
      expect(NotificationService.NotificationTypes.MATCH_ACCEPTED).toBe('match_accepted');
      expect(NotificationService.NotificationTypes.MATCH_REJECTED).toBe('match_rejected');
      expect(NotificationService.NotificationTypes.PROJECT_INVITATION).toBe('project_invitation');
      expect(NotificationService.NotificationTypes.PROJECT_UPDATE).toBe('project_update');
      expect(NotificationService.NotificationTypes.COMMENT).toBe('comment');
      expect(NotificationService.NotificationTypes.SYSTEM).toBe('system');
    });
  });
});


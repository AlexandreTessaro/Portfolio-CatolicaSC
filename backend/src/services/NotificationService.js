import { NotificationRepository } from '../repositories/NotificationRepository.js';

export class NotificationService {
  constructor() {
    this.notificationRepository = new NotificationRepository();
  }

  /**
   * Criar notificação
   */
  async createNotification(userId, type, title, message, data = {}) {
    try {
      const notification = await this.notificationRepository.create({
        userId,
        type,
        title,
        message,
        data
      });
      
      return notification;
    } catch (error) {
      throw new Error(`Erro ao criar notificação: ${error.message}`);
    }
  }

  /**
   * Buscar notificações do usuário
   */
  async getUserNotifications(userId, options = {}) {
    try {
      const notifications = await this.notificationRepository.findByUserId(userId, options);
      
      // Parse JSON data field
      return notifications.map(notif => ({
        ...notif,
        data: typeof notif.data === 'string' ? JSON.parse(notif.data) : notif.data
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar notificações: ${error.message}`);
    }
  }

  /**
   * Contar notificações não lidas
   */
  async getUnreadCount(userId) {
    try {
      return await this.notificationRepository.countUnread(userId);
    } catch (error) {
      throw new Error(`Erro ao contar notificações não lidas: ${error.message}`);
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId, userId) {
    try {
      const notification = await this.notificationRepository.findById(notificationId, userId);
      
      if (!notification) {
        throw new Error('Notificação não encontrada');
      }
      
      if (notification.is_read) {
        return notification; // Já está lida
      }
      
      return await this.notificationRepository.markAsRead(notificationId, userId);
    } catch (error) {
      throw new Error(`Erro ao marcar notificação como lida: ${error.message}`);
    }
  }

  /**
   * Marcar todas como lidas
   */
  async markAllAsRead(userId) {
    try {
      return await this.notificationRepository.markAllAsRead(userId);
    } catch (error) {
      throw new Error(`Erro ao marcar todas as notificações como lidas: ${error.message}`);
    }
  }

  /**
   * Deletar notificação
   */
  async deleteNotification(notificationId, userId) {
    try {
      const notification = await this.notificationRepository.findById(notificationId, userId);
      
      if (!notification) {
        throw new Error('Notificação não encontrada');
      }
      
      return await this.notificationRepository.delete(notificationId, userId);
    } catch (error) {
      throw new Error(`Erro ao deletar notificação: ${error.message}`);
    }
  }

  /**
   * Tipos de notificação pré-definidos
   */
  static NotificationTypes = {
    MATCH_REQUEST: 'match_request',
    MATCH_ACCEPTED: 'match_accepted',
    MATCH_REJECTED: 'match_rejected',
    PROJECT_INVITATION: 'project_invitation',
    PROJECT_UPDATE: 'project_update',
    COMMENT: 'comment',
    SYSTEM: 'system'
  };

  /**
   * Helper para criar notificação de match request
   */
  async notifyMatchRequest(recipientId, senderName, projectTitle, projectId) {
    return this.createNotification(
      recipientId,
      NotificationService.NotificationTypes.MATCH_REQUEST,
      'Nova solicitação de colaboração',
      `${senderName} quer colaborar no projeto "${projectTitle}"`,
      { projectId, senderName }
    );
  }

  /**
   * Helper para criar notificação de match aceito
   */
  async notifyMatchAccepted(recipientId, projectTitle, projectId) {
    return this.createNotification(
      recipientId,
      NotificationService.NotificationTypes.MATCH_ACCEPTED,
      'Solicitação aceita!',
      `Sua solicitação para colaborar no projeto "${projectTitle}" foi aceita!`,
      { projectId, projectTitle }
    );
  }

  /**
   * Helper para criar notificação de match rejeitado
   */
  async notifyMatchRejected(recipientId, projectTitle, projectId) {
    return this.createNotification(
      recipientId,
      NotificationService.NotificationTypes.MATCH_REJECTED,
      'Solicitação recusada',
      `Sua solicitação para colaborar no projeto "${projectTitle}" foi recusada.`,
      { projectId, projectTitle }
    );
  }
}


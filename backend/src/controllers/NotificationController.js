import { NotificationService } from '../services/NotificationService.js';

export class NotificationController {
  constructor() {
    this.notificationService = new NotificationService();
  }

  /**
   * Listar notificações do usuário
   * GET /api/notifications
   */
  async list(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50, offset = 0, unreadOnly = false } = req.query;
      
      const notifications = await this.notificationService.getUserNotifications(userId, {
        limit: parseInt(limit, 10),
        offset: parseInt(offset, 10),
        unreadOnly: unreadOnly === 'true'
      });
      
      res.status(200).json({
        success: true,
        data: notifications
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Contar notificações não lidas
   * GET /api/notifications/unread-count
   */
  async getUnreadCount(req, res) {
    try {
      const userId = req.user.userId;
      const count = await this.notificationService.getUnreadCount(userId);
      
      res.status(200).json({
        success: true,
        data: { count }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Marcar notificação como lida
   * PUT /api/notifications/:id/read
   */
  async markAsRead(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      const notification = await this.notificationService.markAsRead(id, userId);
      
      res.status(200).json({
        success: true,
        data: notification
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Marcar todas as notificações como lidas
   * PUT /api/notifications/read-all
   */
  async markAllAsRead(req, res) {
    try {
      const userId = req.user.userId;
      const notifications = await this.notificationService.markAllAsRead(userId);
      
      res.status(200).json({
        success: true,
        data: { count: notifications.length }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  /**
   * Deletar notificação
   * DELETE /api/notifications/:id
   */
  async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user.userId;
      
      await this.notificationService.deleteNotification(id, userId);
      
      res.status(200).json({
        success: true,
        message: 'Notificação deletada com sucesso'
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default new NotificationController();


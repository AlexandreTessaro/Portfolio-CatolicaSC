import { NotificationService } from '../services/NotificationService.js';
import { emitNotification } from '../config/socket.js';

const notificationService = new NotificationService();

/**
 * Helper para criar e emitir notificação
 */
export async function createAndEmitNotification(io, userId, type, title, message, data = {}) {
  try {
    // Criar notificação no banco
    const notification = await notificationService.createNotification(
      userId,
      type,
      title,
      message,
      data
    );

    // Emitir via Socket.io em tempo real
    if (io) {
      emitNotification(io, userId, {
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        data: typeof notification.data === 'string' 
          ? JSON.parse(notification.data) 
          : notification.data,
        is_read: notification.is_read,
        created_at: notification.created_at
      });
    }

    return notification;
  } catch (error) {
    console.error('Erro ao criar/emitir notificação:', error);
    // Não falhar o processo principal se notificação falhar
    return null;
  }
}

/**
 * Obter instância do Socket.io do app
 */
export function getIO(req) {
  // Socket.io é armazenado no app Express
  const app = req.app;
  return app.get('io') || null;
}


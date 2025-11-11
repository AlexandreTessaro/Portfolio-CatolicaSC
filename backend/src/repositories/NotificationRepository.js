import pool from '../config/database.js';

export class NotificationRepository {
  constructor(database = null) {
    this.db = database || pool;
  }

  /**
   * Criar uma nova notificação
   */
  async create(notificationData) {
    const client = await this.db.connect();
    try {
      const { userId, type, title, message, data = {} } = notificationData;
      
      const query = `
        INSERT INTO notifications (user_id, type, title, message, data, is_read, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `;
      
      const values = [
        userId,
        type,
        title,
        message,
        JSON.stringify(data),
        false,
        new Date()
      ];
      
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Buscar notificações de um usuário
   */
  async findByUserId(userId, options = {}) {
    const client = await this.db.connect();
    try {
      const { limit = 50, offset = 0, unreadOnly = false } = options;
      
      let query = `
        SELECT * FROM notifications
        WHERE user_id = $1
      `;
      
      const values = [userId];
      
      if (unreadOnly) {
        query += ' AND is_read = false';
      }
      
      query += ' ORDER BY created_at DESC LIMIT $2 OFFSET $3';
      values.push(limit, offset);
      
      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Contar notificações não lidas de um usuário
   */
  async countUnread(userId) {
    const client = await this.db.connect();
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM notifications
        WHERE user_id = $1 AND is_read = false
      `;
      
      const result = await client.query(query, [userId]);
      return parseInt(result.rows[0].count, 10);
    } finally {
      client.release();
    }
  }

  /**
   * Marcar notificação como lida
   */
  async markAsRead(notificationId, userId) {
    const client = await this.db.connect();
    try {
      const query = `
        UPDATE notifications
        SET is_read = true
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      
      const result = await client.query(query, [notificationId, userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Marcar todas as notificações como lidas
   */
  async markAllAsRead(userId) {
    const client = await this.db.connect();
    try {
      const query = `
        UPDATE notifications
        SET is_read = true
        WHERE user_id = $1 AND is_read = false
        RETURNING *
      `;
      
      const result = await client.query(query, [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Deletar notificação
   */
  async delete(notificationId, userId) {
    const client = await this.db.connect();
    try {
      const query = `
        DELETE FROM notifications
        WHERE id = $1 AND user_id = $2
        RETURNING *
      `;
      
      const result = await client.query(query, [notificationId, userId]);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Buscar notificação por ID
   */
  async findById(notificationId, userId) {
    const client = await this.db.connect();
    try {
      const query = `
        SELECT * FROM notifications
        WHERE id = $1 AND user_id = $2
      `;
      
      const result = await client.query(query, [notificationId, userId]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }
}


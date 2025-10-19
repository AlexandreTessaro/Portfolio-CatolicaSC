import pool from '../config/database.js';
import { UserConnection } from '../domain/UserConnection.js';

export class UserConnectionRepository {
  constructor() {
    this.pool = pool;
  }

  // Criar uma nova conexão
  async create(connectionData) {
    const client = await this.pool.connect();
    try {
      const { requesterId, receiverId, status = 'pending', message = null } = connectionData;
      
      const query = `
        INSERT INTO user_connections (requester_id, receiver_id, status, message)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;
      
      const result = await client.query(query, [requesterId, receiverId, status, message]);
      const row = result.rows[0];
      
      return new UserConnection({
        id: row.id,
        requesterId: row.requester_id,
        receiverId: row.receiver_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }

  // Buscar conexão por ID
  async findById(id) {
    const client = await this.pool.connect();
    try {
      const query = 'SELECT * FROM user_connections WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new UserConnection({
        id: row.id,
        requesterId: row.requester_id,
        receiverId: row.receiver_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }

  // Verificar se já existe conexão entre dois usuários
  async existsBetweenUsers(userId1, userId2) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT id FROM user_connections 
        WHERE (requester_id = $1 AND receiver_id = $2) 
           OR (requester_id = $2 AND receiver_id = $1)
      `;
      const result = await client.query(query, [userId1, userId2]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  // Buscar conexões recebidas por um usuário
  async findReceivedConnections(userId, status = null) {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT uc.*, u.name as requester_name, u.email as requester_email, u.bio as requester_bio, u.skills as requester_skills
        FROM user_connections uc
        JOIN users u ON uc.requester_id = u.id
        WHERE uc.receiver_id = $1
      `;
      const params = [userId];
      
      if (status) {
        query += ' AND uc.status = $2';
        params.push(status);
      }
      
      query += ' ORDER BY uc.created_at DESC';
      
      const result = await client.query(query, params);
      return result.rows.map(row => ({
        ...new UserConnection({
          id: row.id,
          requesterId: row.requester_id,
          receiverId: row.receiver_id,
          status: row.status,
          message: row.message,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }).toJSON(),
        requester: {
          id: row.requester_id,
          name: row.requester_name,
          email: row.requester_email,
          bio: row.requester_bio,
          skills: row.requester_skills
        }
      }));
    } finally {
      client.release();
    }
  }

  // Buscar conexões enviadas por um usuário
  async findSentConnections(userId, status = null) {
    const client = await this.pool.connect();
    try {
      let query = `
        SELECT uc.*, u.name as receiver_name, u.email as receiver_email, u.bio as receiver_bio, u.skills as receiver_skills
        FROM user_connections uc
        JOIN users u ON uc.receiver_id = u.id
        WHERE uc.requester_id = $1
      `;
      const params = [userId];
      
      if (status) {
        query += ' AND uc.status = $2';
        params.push(status);
      }
      
      query += ' ORDER BY uc.created_at DESC';
      
      const result = await client.query(query, params);
      return result.rows.map(row => ({
        ...new UserConnection({
          id: row.id,
          requesterId: row.requester_id,
          receiverId: row.receiver_id,
          status: row.status,
          message: row.message,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }).toJSON(),
        receiver: {
          id: row.receiver_id,
          name: row.receiver_name,
          email: row.receiver_email,
          bio: row.receiver_bio,
          skills: row.receiver_skills
        }
      }));
    } finally {
      client.release();
    }
  }

  // Atualizar status da conexão
  async updateStatus(id, status) {
    const client = await this.pool.connect();
    try {
      const query = `
        UPDATE user_connections 
        SET status = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `;
      
      const result = await client.query(query, [status, id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new UserConnection({
        id: row.id,
        requesterId: row.requester_id,
        receiverId: row.receiver_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }

  // Buscar conexões aceitas de um usuário
  async findAcceptedConnections(userId) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT uc.*, 
               CASE 
                 WHEN uc.requester_id = $1 THEN u2.name
                 ELSE u1.name
               END as connected_user_name,
               CASE 
                 WHEN uc.requester_id = $1 THEN u2.email
                 ELSE u1.email
               END as connected_user_email,
               CASE 
                 WHEN uc.requester_id = $1 THEN u2.bio
                 ELSE u1.bio
               END as connected_user_bio,
               CASE 
                 WHEN uc.requester_id = $1 THEN u2.skills
                 ELSE u1.skills
               END as connected_user_skills
        FROM user_connections uc
        JOIN users u1 ON uc.requester_id = u1.id
        JOIN users u2 ON uc.receiver_id = u2.id
        WHERE (uc.requester_id = $1 OR uc.receiver_id = $1) 
          AND uc.status = 'accepted'
        ORDER BY uc.updated_at DESC
      `;
      
      const result = await client.query(query, [userId]);
      return result.rows.map(row => ({
        ...new UserConnection({
          id: row.id,
          requesterId: row.requester_id,
          receiverId: row.receiver_id,
          status: row.status,
          message: row.message,
          createdAt: row.created_at,
          updatedAt: row.updated_at
        }).toJSON(),
        connectedUser: {
          name: row.connected_user_name,
          email: row.connected_user_email,
          bio: row.connected_user_bio,
          skills: row.connected_user_skills
        }
      }));
    } finally {
      client.release();
    }
  }

  // Buscar conexão entre dois usuários específicos
  async findByRequesterAndReceiver(userId1, userId2) {
    const client = await this.pool.connect();
    try {
      const query = `
        SELECT * FROM user_connections 
        WHERE (requester_id = $1 AND receiver_id = $2) 
           OR (requester_id = $2 AND receiver_id = $1)
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const result = await client.query(query, [userId1, userId2]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new UserConnection({
        id: row.id,
        requesterId: row.requester_id,
        receiverId: row.receiver_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }

  // Deletar conexão
  async delete(id) {
    const client = await this.pool.connect();
    try {
      const query = 'DELETE FROM user_connections WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      return new UserConnection({
        id: row.id,
        requesterId: row.requester_id,
        receiverId: row.receiver_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at
      });
    } finally {
      client.release();
    }
  }
}

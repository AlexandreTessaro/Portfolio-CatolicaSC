import pool from '../config/database.js';

export class AuditRepository {
  constructor(database = null) {
    this.db = database || pool;
  }

  /**
   * Cria um novo log de auditoria
   * @param {Object} logData - Dados do log
   * @param {number|null} logData.userId - ID do usuário (null se ação anônima)
   * @param {string} logData.action - Ação realizada (ex: 'user.login', 'project.create')
   * @param {string|null} logData.resourceType - Tipo de recurso (ex: 'user', 'project', 'match')
   * @param {number|null} logData.resourceId - ID do recurso afetado
   * @param {Object} logData.details - Detalhes adicionais (JSON)
   * @param {string|null} logData.ipAddress - Endereço IP
   * @param {string|null} logData.userAgent - User Agent do navegador
   * @returns {Promise<Object>} Log criado
   */
  async create(logData) {
    const client = await this.db.connect();
    try {
      const {
        userId,
        action,
        resourceType,
        resourceId,
        details = {},
        ipAddress,
        userAgent
      } = logData;

      const query = `
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *
      `;

      const values = [
        userId || null,
        action,
        resourceType || null,
        resourceId || null,
        JSON.stringify(details),
        ipAddress || null,
        userAgent || null,
        new Date()
      ];

      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Busca logs de auditoria com filtros
   * @param {Object} filters - Filtros de busca
   * @param {number|null} filters.userId - Filtrar por usuário
   * @param {string|null} filters.action - Filtrar por ação
   * @param {string|null} filters.resourceType - Filtrar por tipo de recurso
   * @param {Date|null} filters.startDate - Data inicial
   * @param {Date|null} filters.endDate - Data final
   * @param {number} filters.limit - Limite de resultados
   * @param {number} filters.offset - Offset para paginação
   * @returns {Promise<Array>} Lista de logs
   */
  async findAll(filters = {}) {
    const client = await this.db.connect();
    try {
      const {
        userId,
        action,
        resourceType,
        startDate,
        endDate,
        limit = 100,
        offset = 0
      } = filters;

      let query = 'SELECT * FROM audit_logs WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      if (userId !== undefined && userId !== null) {
        query += ` AND user_id = $${paramIndex}`;
        values.push(userId);
        paramIndex++;
      }

      if (action) {
        query += ` AND action = $${paramIndex}`;
        values.push(action);
        paramIndex++;
      }

      if (resourceType) {
        query += ` AND resource_type = $${paramIndex}`;
        values.push(resourceType);
        paramIndex++;
      }

      if (startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        values.push(endDate);
        paramIndex++;
      }

      query += ` ORDER BY created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
      values.push(limit, offset);

      const result = await client.query(query, values);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Conta o total de logs que correspondem aos filtros
   * @param {Object} filters - Mesmos filtros de findAll
   * @returns {Promise<number>} Total de logs
   */
  async count(filters = {}) {
    const client = await this.db.connect();
    try {
      const {
        userId,
        action,
        resourceType,
        startDate,
        endDate
      } = filters;

      let query = 'SELECT COUNT(*) FROM audit_logs WHERE 1=1';
      const values = [];
      let paramIndex = 1;

      if (userId !== undefined && userId !== null) {
        query += ` AND user_id = $${paramIndex}`;
        values.push(userId);
        paramIndex++;
      }

      if (action) {
        query += ` AND action = $${paramIndex}`;
        values.push(action);
        paramIndex++;
      }

      if (resourceType) {
        query += ` AND resource_type = $${paramIndex}`;
        values.push(resourceType);
        paramIndex++;
      }

      if (startDate) {
        query += ` AND created_at >= $${paramIndex}`;
        values.push(startDate);
        paramIndex++;
      }

      if (endDate) {
        query += ` AND created_at <= $${paramIndex}`;
        values.push(endDate);
        paramIndex++;
      }

      const result = await client.query(query, values);
      return parseInt(result.rows[0].count, 10);
    } finally {
      client.release();
    }
  }

  /**
   * Busca um log específico por ID
   * @param {number} id - ID do log
   * @returns {Promise<Object|null>} Log encontrado ou null
   */
  async findById(id) {
    const client = await this.db.connect();
    try {
      const query = 'SELECT * FROM audit_logs WHERE id = $1';
      const result = await client.query(query, [id]);
      return result.rows[0] || null;
    } finally {
      client.release();
    }
  }

  /**
   * Busca logs de um usuário específico
   * @param {number} userId - ID do usuário
   * @param {number} limit - Limite de resultados
   * @returns {Promise<Array>} Lista de logs do usuário
   */
  async findByUserId(userId, limit = 50) {
    const client = await this.db.connect();
    try {
      const query = `
        SELECT * FROM audit_logs 
        WHERE user_id = $1 
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      const result = await client.query(query, [userId, limit]);
      return result.rows;
    } finally {
      client.release();
    }
  }
}

export default AuditRepository;


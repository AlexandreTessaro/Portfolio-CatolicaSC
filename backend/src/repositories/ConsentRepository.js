import pool from '../config/database.js';

export class ConsentRepository {
  constructor() {
    this.db = pool;
  }

  /**
   * Registrar consentimento do usuário
   */
  async createConsent(userId, consentData) {
    const client = await this.db.connect();
    try {
      const {
        consentType = 'privacy_policy',
        consentVersion = '1.0',
        accepted = true,
        ipAddress = null,
        userAgent = null
      } = consentData;

      const query = `
        INSERT INTO user_consents (user_id, consent_type, consent_version, accepted, ip_address, user_agent)
        VALUES ($1, $2, $3, $4, $5, $6)
        ON CONFLICT (user_id, consent_type, consent_version) 
        DO UPDATE SET 
          accepted = EXCLUDED.accepted,
          updated_at = CURRENT_TIMESTAMP,
          ip_address = EXCLUDED.ip_address,
          user_agent = EXCLUDED.user_agent
        RETURNING *
      `;

      const result = await client.query(query, [
        userId,
        consentType,
        consentVersion,
        accepted,
        ipAddress,
        userAgent
      ]);

      return result.rows[0];
    } finally {
      client.release();
    }
  }

  /**
   * Buscar consentimentos de um usuário
   */
  async findByUserId(userId) {
    const client = await this.db.connect();
    try {
      const query = `
        SELECT * FROM user_consents
        WHERE user_id = $1
        ORDER BY created_at DESC
      `;
      const result = await client.query(query, [userId]);
      return result.rows;
    } finally {
      client.release();
    }
  }

  /**
   * Verificar se usuário tem consentimento ativo
   */
  async hasActiveConsent(userId, consentType = 'privacy_policy') {
    const client = await this.db.connect();
    try {
      const query = `
        SELECT * FROM user_consents
        WHERE user_id = $1 
          AND consent_type = $2 
          AND accepted = TRUE
        ORDER BY created_at DESC
        LIMIT 1
      `;
      const result = await client.query(query, [userId, consentType]);
      return result.rows.length > 0;
    } finally {
      client.release();
    }
  }

  /**
   * Revogar consentimento
   */
  async revokeConsent(userId, consentType) {
    const client = await this.db.connect();
    try {
      const query = `
        UPDATE user_consents
        SET accepted = FALSE, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $1 AND consent_type = $2
        RETURNING *
      `;
      const result = await client.query(query, [userId, consentType]);
      return result.rows;
    } finally {
      client.release();
    }
  }
}


import { AuditRepository } from '../repositories/AuditRepository.js';

export class AuditService {
  constructor() {
    this.auditRepository = new AuditRepository();
  }

  /**
   * Registra uma ação de auditoria
   * @param {Object} logData - Dados do log
   * @returns {Promise<Object>} Log criado
   */
  async logAction(logData) {
    try {
      const log = await this.auditRepository.create(logData);
      return log;
    } catch (error) {
      // Não lançar erro para não quebrar o fluxo principal
      // Apenas logar o erro
      console.error('Erro ao registrar log de auditoria:', error);
      return null;
    }
  }

  /**
   * Busca logs com filtros e paginação
   * @param {Object} filters - Filtros de busca
   * @returns {Promise<Object>} Objeto com logs e total
   */
  async getLogs(filters = {}) {
    try {
      const logs = await this.auditRepository.findAll(filters);
      const total = await this.auditRepository.count(filters);

      return {
        logs,
        total,
        page: Math.floor((filters.offset || 0) / (filters.limit || 100)) + 1,
        limit: filters.limit || 100
      };
    } catch (error) {
      throw new Error(`Erro ao buscar logs: ${error.message}`);
    }
  }

  /**
   * Busca um log específico
   * @param {number} id - ID do log
   * @returns {Promise<Object|null>} Log encontrado
   */
  async getLogById(id) {
    try {
      return await this.auditRepository.findById(id);
    } catch (error) {
      throw new Error(`Erro ao buscar log: ${error.message}`);
    }
  }

  /**
   * Busca logs de um usuário específico
   * @param {number} userId - ID do usuário
   * @param {number} limit - Limite de resultados
   * @returns {Promise<Array>} Lista de logs
   */
  async getLogsByUserId(userId, limit = 50) {
    try {
      return await this.auditRepository.findByUserId(userId, limit);
    } catch (error) {
      throw new Error(`Erro ao buscar logs do usuário: ${error.message}`);
    }
  }
}

export default AuditService;


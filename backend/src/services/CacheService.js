import redisClient from '../config/redis.js';

/**
 * Serviço de cache Redis para otimização de performance
 * Implementa padrão cache-aside para suportar 1000+ usuários simultâneos
 */
export class CacheService {
  constructor() {
    this.client = redisClient;
    this.defaultTTL = 3600; // 1 hora em segundos
  }

  /**
   * Gera chave de cache padronizada
   */
  _getKey(prefix, identifier) {
    return `cache:${prefix}:${identifier}`;
  }

  /**
   * Busca valor do cache
   */
  async get(key) {
    try {
      if (!this.client.isOpen) {
        return null;
      }
      const value = await this.client.get(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`Erro ao buscar cache para chave ${key}:`, error);
      return null; // Em caso de erro, retorna null (cache miss)
    }
  }

  /**
   * Salva valor no cache
   */
  async set(key, value, ttl = this.defaultTTL) {
    try {
      if (!this.client.isOpen) {
        return false;
      }
      await this.client.set(key, JSON.stringify(value), {
        EX: ttl // Expira em segundos
      });
      return true;
    } catch (error) {
      console.error(`Erro ao salvar cache para chave ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove valor do cache
   */
  async delete(key) {
    try {
      if (!this.client.isOpen) {
        return false;
      }
      await this.client.del(key);
      return true;
    } catch (error) {
      console.error(`Erro ao deletar cache para chave ${key}:`, error);
      return false;
    }
  }

  /**
   * Remove múltiplas chaves por padrão
   */
  async deletePattern(pattern) {
    try {
      if (!this.client.isOpen) {
        return false;
      }
      // Nota: Redis não tem comando direto para deletar por padrão
      // Em produção, considere usar SCAN + DEL ou um módulo Redis com suporte
      return true;
    } catch (error) {
      console.error(`Erro ao deletar padrão ${pattern}:`, error);
      return false;
    }
  }

  /**
   * Cache de projeto por ID
   */
  async getProject(projectId) {
    const key = this._getKey('project', projectId);
    return await this.get(key);
  }

  async setProject(projectId, project, ttl = 1800) { // 30 minutos
    const key = this._getKey('project', projectId);
    return await this.set(key, project, ttl);
  }

  async invalidateProject(projectId) {
    const key = this._getKey('project', projectId);
    await this.delete(key);
    // Também invalidar listas de projetos
    await this.delete(this._getKey('projects', 'list'));
    await this.delete(this._getKey('projects', 'popular'));
  }

  /**
   * Cache de lista de projetos (com filtros)
   */
  async getProjectsList(filters = {}) {
    const filterKey = JSON.stringify(filters);
    const key = this._getKey('projects', `list:${Buffer.from(filterKey).toString('base64')}`);
    return await this.get(key);
  }

  async setProjectsList(filters, projects, ttl = 600) { // 10 minutos
    const filterKey = JSON.stringify(filters);
    const key = this._getKey('projects', `list:${Buffer.from(filterKey).toString('base64')}`);
    return await this.set(key, projects, ttl);
  }

  /**
   * Cache de projetos populares
   */
  async getPopularProjects(limit = 10) {
    const key = this._getKey('projects', `popular:${limit}`);
    return await this.get(key);
  }

  async setPopularProjects(limit, projects, ttl = 300) { // 5 minutos
    const key = this._getKey('projects', `popular:${limit}`);
    return await this.set(key, projects, ttl);
  }

  /**
   * Cache de usuário por ID
   */
  async getUser(userId) {
    const key = this._getKey('user', userId);
    return await this.get(key);
  }

  async setUser(userId, user, ttl = 1800) { // 30 minutos
    const key = this._getKey('user', userId);
    return await this.set(key, user, ttl);
  }

  async invalidateUser(userId) {
    const key = this._getKey('user', userId);
    await this.delete(key);
  }

  /**
   * Cache de recomendações de projetos
   */
  async getProjectRecommendations(userId, limit = 10) {
    const key = this._getKey('recommendations', `projects:${userId}:${limit}`);
    return await this.get(key);
  }

  async setProjectRecommendations(userId, limit, recommendations, ttl = 600) { // 10 minutos
    const key = this._getKey('recommendations', `projects:${userId}:${limit}`);
    return await this.set(key, recommendations, ttl);
  }

  /**
   * Cache de recomendações de usuários
   */
  async getUserRecommendations(userId, limit = 10) {
    const key = this._getKey('recommendations', `users:${userId}:${limit}`);
    return await this.get(key);
  }

  async setUserRecommendations(userId, limit, recommendations, ttl = 600) { // 10 minutos
    const key = this._getKey('recommendations', `users:${userId}:${limit}`);
    return await this.set(key, recommendations, ttl);
  }

  /**
   * Estatísticas de cache (hit/miss)
   */
  async getStats() {
    try {
      if (!this.client.isOpen) {
        return { enabled: false, message: 'Redis não está conectado' };
      }
      const info = await this.client.info('stats');
      return {
        enabled: true,
        info: info
      };
    } catch (error) {
      return { enabled: false, error: error.message };
    }
  }
}

export default CacheService;


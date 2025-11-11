import { AuditService } from '../services/AuditService.js';

export class AuditController {
  constructor() {
    this.auditService = new AuditService();
  }

  /**
   * GET /api/admin/audit-logs
   * Lista logs de auditoria (apenas admin)
   */
  getLogs = async (req, res) => {
    try {
      const {
        userId,
        action,
        resourceType,
        startDate,
        endDate,
        page = 1,
        limit = 100
      } = req.query;

      const filters = {
        userId: userId ? parseInt(userId, 10) : undefined,
        action,
        resourceType,
        startDate: startDate ? new Date(startDate) : undefined,
        endDate: endDate ? new Date(endDate) : undefined,
        limit: Math.min(parseInt(limit, 10) || 100, 500), // Máximo 500 por página
        offset: (parseInt(page, 10) - 1) * (parseInt(limit, 10) || 100)
      };

      const result = await this.auditService.getLogs(filters);

      res.json({
        success: true,
        data: result.logs,
        pagination: {
          page: result.page,
          limit: result.limit,
          total: result.total,
          totalPages: Math.ceil(result.total / result.limit)
        }
      });
    } catch (error) {
      console.error('Erro ao buscar logs de auditoria:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar logs de auditoria',
        error: error.message
      });
    }
  };

  /**
   * GET /api/admin/audit-logs/:id
   * Busca um log específico (apenas admin)
   */
  getLogById = async (req, res) => {
    try {
      const { id } = req.params;
      const log = await this.auditService.getLogById(parseInt(id, 10));

      if (!log) {
        return res.status(404).json({
          success: false,
          message: 'Log não encontrado'
        });
      }

      res.json({
        success: true,
        data: log
      });
    } catch (error) {
      console.error('Erro ao buscar log:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar log',
        error: error.message
      });
    }
  };

  /**
   * GET /api/admin/audit-logs/user/:userId
   * Busca logs de um usuário específico (apenas admin)
   */
  getLogsByUserId = async (req, res) => {
    try {
      const { userId } = req.params;
      const { limit = 50 } = req.query;

      const logs = await this.auditService.getLogsByUserId(
        parseInt(userId, 10),
        parseInt(limit, 10)
      );

      res.json({
        success: true,
        data: logs,
        count: logs.length
      });
    } catch (error) {
      console.error('Erro ao buscar logs do usuário:', error);
      res.status(500).json({
        success: false,
        message: 'Erro ao buscar logs do usuário',
        error: error.message
      });
    }
  };
}

export default AuditController;


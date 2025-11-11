import { AuditService } from '../services/AuditService.js';

const auditService = new AuditService();

/**
 * Helper para registrar logs de auditoria
 * Extrai informações do request e registra a ação
 * 
 * @param {Object} req - Request do Express
 * @param {string} action - Ação realizada (ex: 'user.login', 'project.create')
 * @param {string|null} resourceType - Tipo de recurso (ex: 'user', 'project')
 * @param {number|null} resourceId - ID do recurso afetado
 * @param {Object} details - Detalhes adicionais
 */
export async function logAudit(req, action, resourceType = null, resourceId = null, details = {}) {
  try {
    const userId = req.user?.userId || null;
    const ipAddress = req.ip || req.connection?.remoteAddress || null;
    const userAgent = req.get('user-agent') || null;

    await auditService.logAction({
      userId,
      action,
      resourceType,
      resourceId,
      details,
      ipAddress,
      userAgent
    });
  } catch (error) {
    // Não lançar erro para não quebrar o fluxo principal
    console.error('Erro ao registrar log de auditoria:', error);
  }
}

/**
 * Middleware para registrar automaticamente ações em rotas
 * 
 * @param {string} action - Ação a ser registrada
 * @param {Function} getResourceInfo - Função para extrair resourceType e resourceId do request
 */
export function auditMiddleware(action, getResourceInfo = null) {
  return async (req, res, next) => {
    // Executar a rota primeiro
    const originalJson = res.json.bind(res);
    res.json = function(data) {
      // Registrar log após a resposta
      setImmediate(async () => {
        try {
          let resourceType = null;
          let resourceId = null;
          let details = {};

          if (getResourceInfo) {
            const info = getResourceInfo(req, data);
            resourceType = info.resourceType;
            resourceId = info.resourceId;
            details = info.details || {};
          } else {
            // Tentar inferir do request
            if (req.params.id) {
              resourceId = parseInt(req.params.id, 10);
            }
            if (req.route?.path.includes('users')) {
              resourceType = 'user';
            } else if (req.route?.path.includes('projects')) {
              resourceType = 'project';
            } else if (req.route?.path.includes('matches')) {
              resourceType = 'match';
            }
          }

          // Adicionar status da resposta aos detalhes
          details.statusCode = res.statusCode;
          details.success = res.statusCode < 400;

          await logAudit(req, action, resourceType, resourceId, details);
        } catch (error) {
          console.error('Erro no middleware de auditoria:', error);
        }
      });

      return originalJson(data);
    };

    next();
  };
}

export default { logAudit, auditMiddleware };


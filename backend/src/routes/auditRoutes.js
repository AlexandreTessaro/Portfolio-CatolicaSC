import express from 'express';
import { AuditController } from '../controllers/AuditController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const auditController = new AuditController();

// Todas as rotas de auditoria requerem autenticação e permissão de admin
router.use(authenticateToken);
router.use(requireAdmin);

// GET /api/admin/audit-logs - Lista logs com filtros
router.get('/', auditController.getLogs);

// GET /api/admin/audit-logs/:id - Busca um log específico
router.get('/:id', auditController.getLogById);

// GET /api/admin/audit-logs/user/:userId - Busca logs de um usuário
router.get('/user/:userId', auditController.getLogsByUserId);

export default router;


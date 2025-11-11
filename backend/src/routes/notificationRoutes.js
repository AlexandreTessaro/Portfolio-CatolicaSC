import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import notificationController from '../controllers/NotificationController.js';

const router = express.Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Listar notificações
router.get('/', (req, res) => notificationController.list(req, res));

// Contar notificações não lidas
router.get('/unread-count', (req, res) => notificationController.getUnreadCount(req, res));

// Marcar notificação como lida
router.put('/:id/read', (req, res) => notificationController.markAsRead(req, res));

// Marcar todas como lidas
router.put('/read-all', (req, res) => notificationController.markAllAsRead(req, res));

// Deletar notificação
router.delete('/:id', (req, res) => notificationController.delete(req, res));

export default router;


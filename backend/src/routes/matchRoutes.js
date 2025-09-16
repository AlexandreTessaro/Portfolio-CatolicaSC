import express from 'express';
import matchController from '../controllers/MatchController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Aplicar middleware de autenticação em todas as rotas
router.use(authMiddleware);

// Criar uma nova solicitação de match
router.post('/', matchController.createMatch);

// Buscar matches recebidos (para criadores de projeto)
router.get('/received', matchController.getReceivedMatches);

// Buscar matches enviados (para usuários que solicitaram)
router.get('/sent', matchController.getSentMatches);

// Obter estatísticas de matches
router.get('/stats', matchController.getMatchStats);

// Verificar se pode solicitar participação em um projeto
router.get('/can-request/:projectId', matchController.canRequestParticipation);

// Buscar match específico por ID
router.get('/:matchId', matchController.getMatchById);

// Aceitar um match
router.patch('/:matchId/accept', matchController.acceptMatch);

// Rejeitar um match
router.patch('/:matchId/reject', matchController.rejectMatch);

// Bloquear um match
router.patch('/:matchId/block', matchController.blockMatch);

// Cancelar um match
router.delete('/:matchId', matchController.cancelMatch);

export default router;

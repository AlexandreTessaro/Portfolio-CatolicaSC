import express from 'express';
import MatchController from '../controllers/MatchController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const matchController = new MatchController();

// Aplicar middleware de autenticação em todas as rotas
router.use(authenticateToken);

// Criar uma nova solicitação de match
router.post('/', (req, res) => {
  return matchController.createMatch(req, res);
});

// Buscar matches recebidos (para criadores de projeto)
router.get('/received', (req, res) => matchController.getReceivedMatches(req, res));

// Buscar matches enviados (para usuários que solicitaram)
router.get('/sent', (req, res) => matchController.getSentMatches(req, res));

// Obter estatísticas de matches
router.get('/stats', (req, res) => matchController.getMatchStats(req, res));

// Verificar se pode solicitar participação em um projeto
router.get('/can-request/:projectId', (req, res) => {
  return matchController.canRequestParticipation(req, res);
});

// Buscar match específico por ID (deve vir por último para não capturar outras rotas)
router.get('/:matchId', (req, res) => matchController.getMatchById(req, res));

// Aceitar um match
router.patch('/:matchId/accept', (req, res) => matchController.acceptMatch(req, res));

// Rejeitar um match
router.patch('/:matchId/reject', (req, res) => matchController.rejectMatch(req, res));

// Bloquear um match
router.patch('/:matchId/block', (req, res) => matchController.blockMatch(req, res));

// Cancelar um match
router.delete('/:matchId', (req, res) => matchController.cancelMatch(req, res));

export default router;

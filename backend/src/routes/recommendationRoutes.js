import express from 'express';
import RecommendationController from '../controllers/RecommendationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();
const recommendationController = new RecommendationController();

// Middleware de autenticação para todas as rotas
router.use(authenticateToken);

// GET /api/recommendations/projects - Buscar projetos com scores de recomendação
router.get('/projects', (req, res) => {
  recommendationController.getProjectsWithScores(req, res);
});

// GET /api/recommendations/score/:projectId - Calcular score para um projeto específico
router.get('/score/:projectId', (req, res) => {
  recommendationController.getRecommendationScore(req, res);
});

// POST /api/recommendations/scores - Calcular scores para múltiplos projetos
router.post('/scores', (req, res) => {
  recommendationController.getMultipleScores(req, res);
});

export default router;

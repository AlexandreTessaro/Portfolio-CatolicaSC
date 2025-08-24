import express from 'express';
import { ProjectController } from '../controllers/ProjectController.js';
import { authenticateToken, optionalAuth } from '../middleware/auth.js';

const router = express.Router();
const projectController = new ProjectController();

// Rotas públicas (com autenticação opcional)
router.get('/', optionalAuth, projectController.searchProjects);
router.get('/search', optionalAuth, projectController.searchProjectsByText);
router.get('/:projectId', optionalAuth, projectController.getProject);
router.get('/user/:userId', optionalAuth, projectController.getUserProjects);

// Rotas protegidas
router.post('/', authenticateToken, projectController.validateCreateProject(), projectController.createProject);
router.put('/:projectId', authenticateToken, projectController.validateUpdateProject(), projectController.updateProject);
router.delete('/:projectId', authenticateToken, projectController.deleteProject);

// Gerenciamento de equipe
router.post('/:projectId/team', authenticateToken, projectController.addTeamMember);
router.delete('/:projectId/team/:memberId', authenticateToken, projectController.removeTeamMember);

// Projetos recomendados
router.get('/recommended', authenticateToken, projectController.getRecommendedProjects);

export default router;

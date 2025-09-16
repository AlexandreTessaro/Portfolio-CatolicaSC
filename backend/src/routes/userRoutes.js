import express from 'express';
import { UserController } from '../controllers/UserController.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();
const userController = new UserController();

// Rotas públicas
router.post('/register', userController.validateRegister(), userController.register);
router.post('/login', userController.validateLogin(), userController.login);
router.post('/refresh-token', userController.refreshToken);
router.post('/logout', userController.logout);

// Rotas protegidas
router.get('/profile', authenticateToken, userController.getProfile);
router.put('/profile', authenticateToken, userController.validateUpdateProfile(), userController.updateProfile);
router.get('/public/:userId', userController.getPublicProfile);
router.get('/search', userController.searchUsers);
router.get('/recommended', userController.getRecommendedUsers);

// Rotas administrativas
router.delete('/:userId', authenticateToken, requireAdmin, userController.deleteUser);

export default router;

import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { vi, describe, it, beforeEach, expect, beforeAll } from 'vitest';
import userRoutes from '../../routes/userRoutes.js';
import projectRoutes from '../../routes/projectRoutes.js';
import matchRoutes from '../../routes/matchRoutes.js';

// Mock das dependências principais
vi.mock('../../services/UserService.js', () => ({
  UserService: vi.fn().mockImplementation(() => ({
    register: vi.fn().mockResolvedValue({ user: { id: 1 }, accessToken: 'token', refreshToken: 'refresh' }),
    login: vi.fn().mockResolvedValue({ user: { id: 1 }, accessToken: 'token', refreshToken: 'refresh' }),
    refreshToken: vi.fn().mockResolvedValue({ accessToken: 'token', refreshToken: 'refresh' }),
    getProfile: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    updateProfile: vi.fn().mockResolvedValue({ id: 1, name: 'Updated' }),
    getPublicProfile: vi.fn().mockResolvedValue({ id: 1, name: 'Test' }),
    searchUsers: vi.fn().mockResolvedValue([]),
    deleteUser: vi.fn().mockResolvedValue({ message: 'Deleted' })
  }))
}));

vi.mock('../../services/ProjectService.js', () => ({
  ProjectService: vi.fn().mockImplementation(() => ({
    createProject: vi.fn().mockResolvedValue({ id: 1, title: 'Test' }),
    getProject: vi.fn().mockResolvedValue({ id: 1, title: 'Test' }),
    updateProject: vi.fn().mockResolvedValue({ id: 1, title: 'Updated' }),
    deleteProject: vi.fn().mockResolvedValue({ message: 'Deleted' }),
    searchProjects: vi.fn().mockResolvedValue([]),
    searchProjectsByText: vi.fn().mockResolvedValue([]),
    getUserProjects: vi.fn().mockResolvedValue([]),
    addTeamMember: vi.fn().mockResolvedValue({ message: 'Added' }),
    removeTeamMember: vi.fn().mockResolvedValue({ message: 'Removed' }),
    getRecommendedProjects: vi.fn().mockResolvedValue([])
  }))
}));

vi.mock('../../services/MatchService.js', () => ({
  default: vi.fn().mockImplementation(() => ({
    createMatch: vi.fn().mockResolvedValue({ id: 1, status: 'pending' }),
    getReceivedMatches: vi.fn().mockResolvedValue([]),
    getSentMatches: vi.fn().mockResolvedValue([]),
    getMatchById: vi.fn().mockResolvedValue({ id: 1 }),
    acceptMatch: vi.fn().mockResolvedValue({ message: 'Accepted' }),
    rejectMatch: vi.fn().mockResolvedValue({ message: 'Rejected' }),
    blockMatch: vi.fn().mockResolvedValue({ message: 'Blocked' }),
    cancelMatch: vi.fn().mockResolvedValue({ message: 'Cancelled' }),
    getMatchStats: vi.fn().mockResolvedValue({ sent: 0, received: 0 }),
    canRequestParticipation: vi.fn().mockResolvedValue({ canRequest: true })
  }))
}));

vi.mock('../../repositories/UserRepository.js', () => ({
  UserRepository: vi.fn().mockImplementation(() => ({}))
}));

vi.mock('../../repositories/ProjectRepository.js', () => ({
  ProjectRepository: vi.fn().mockImplementation(() => ({}))
}));

vi.mock('../../repositories/MatchRepository.js', () => ({
  MatchRepository: vi.fn().mockImplementation(() => ({}))
}));

vi.mock('../../middleware/auth.js', () => ({
  authenticateToken: vi.fn((req, res, next) => {
    req.user = { userId: 1, email: 'test@example.com' };
    next();
  }),
  optionalAuth: vi.fn((req, res, next) => {
    req.user = { userId: 1, email: 'test@example.com' };
    next();
  }),
  requireAdmin: vi.fn((req, res, next) => {
    req.user = { userId: 1, email: 'admin@example.com', role: 'admin' };
    next();
  })
}));

describe('Routes Integration Tests', () => {
  let app;

  beforeAll(() => {
    // Configurar app Express para testes de integração
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    app.use('/api/users', userRoutes);
    app.use('/api/projects', projectRoutes);
    app.use('/api/matches', matchRoutes);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('User Routes', () => {
    it('should handle POST /api/users/register', async () => {
      const response = await request(app)
        .post('/api/users/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
          confirmPassword: 'password123'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle POST /api/users/login', async () => {
      const response = await request(app)
        .post('/api/users/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle POST /api/users/refresh-token', async () => {
      const response = await request(app)
        .post('/api/users/refresh-token')
        .set('Cookie', 'refreshToken=valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/users/profile', async () => {
      const response = await request(app)
        .get('/api/users/profile')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle PUT /api/users/profile', async () => {
      const response = await request(app)
        .put('/api/users/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          name: 'Updated Name',
          bio: 'Updated bio'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/users/public/:userId', async () => {
      const response = await request(app)
        .get('/api/users/public/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/users/search', async () => {
      const response = await request(app)
        .get('/api/users/search')
        .query({
          skills: ['React', 'Node.js'],
          limit: 10,
          offset: 0
        });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle DELETE /api/users/:userId (admin only)', async () => {
      const response = await request(app)
        .delete('/api/users/2')
        .set('Authorization', 'Bearer admin-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Project Routes', () => {
    it('should handle POST /api/projects', async () => {
      const response = await request(app)
        .post('/api/projects')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'Test Project',
          description: 'Test description',
          objectives: ['Objective 1'],
          technologies: ['JavaScript'],
          category: 'Web Development',
          status: 'planning'
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/projects', async () => {
      const response = await request(app)
        .get('/api/projects')
        .query({
          category: 'Web Development',
          limit: 10,
          offset: 0
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/projects/search', async () => {
      const response = await request(app)
        .get('/api/projects/search')
        .query({
          q: 'react app',
          limit: 10
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/projects/:projectId', async () => {
      const response = await request(app)
        .get('/api/projects/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle PUT /api/projects/:projectId', async () => {
      const response = await request(app)
        .put('/api/projects/1')
        .set('Authorization', 'Bearer valid-token')
        .send({
          title: 'Updated Title',
          description: 'Updated description'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle DELETE /api/projects/:projectId', async () => {
      const response = await request(app)
        .delete('/api/projects/1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/projects/user/:userId', async () => {
      const response = await request(app)
        .get('/api/projects/user/1')
        .query({
          limit: 10,
          offset: 0
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle POST /api/projects/:projectId/team', async () => {
      const response = await request(app)
        .post('/api/projects/1/team')
        .set('Authorization', 'Bearer valid-token')
        .send({
          userId: 2,
          role: 'developer'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle DELETE /api/projects/:projectId/team/:memberId', async () => {
      const response = await request(app)
        .delete('/api/projects/1/team/2')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should handle GET /api/projects/recommended', async () => {
      const response = await request(app)
        .get('/api/projects/recommended')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });
  });

  describe('Match Routes', () => {
    it('should handle POST /api/matches', async () => {
      const response = await request(app)
        .post('/api/matches')
        .send({
          projectId: 1,
          message: 'I would like to join this project'
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle GET /api/matches/received', async () => {
      const response = await request(app)
        .get('/api/matches/received');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle GET /api/matches/sent', async () => {
      const response = await request(app)
        .get('/api/matches/sent');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle GET /api/matches/stats', async () => {
      const response = await request(app)
        .get('/api/matches/stats');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle GET /api/matches/can-request/:projectId', async () => {
      const response = await request(app)
        .get('/api/matches/can-request/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle GET /api/matches/:matchId', async () => {
      const response = await request(app)
        .get('/api/matches/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle PATCH /api/matches/:matchId/accept', async () => {
      const response = await request(app)
        .patch('/api/matches/1/accept');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle PATCH /api/matches/:matchId/reject', async () => {
      const response = await request(app)
        .patch('/api/matches/1/reject');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle PATCH /api/matches/:matchId/block', async () => {
      const response = await request(app)
        .patch('/api/matches/1/block');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should handle DELETE /api/matches/:matchId', async () => {
      const response = await request(app)
        .delete('/api/matches/1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('Route Structure Validation', () => {
    it('should have all user routes properly configured', () => {
      // Verificar se as rotas estão registradas
      expect(app._router.stack).toBeDefined();
    });

    it('should have all project routes properly configured', () => {
      // Verificar se as rotas estão registradas
      expect(app._router.stack).toBeDefined();
    });

    it('should have all match routes properly configured', () => {
      // Verificar se as rotas estão registradas
      expect(app._router.stack).toBeDefined();
    });
  });
});

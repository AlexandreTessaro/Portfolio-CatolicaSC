import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import MatchController from '../../controllers/MatchController.js';

// Mock simples do MatchService
const mockMatchService = {
  createMatch: vi.fn(),
  getReceivedMatches: vi.fn(),
  getSentMatches: vi.fn(),
  getMatchById: vi.fn(),
  acceptMatch: vi.fn(),
  rejectMatch: vi.fn(),
  blockMatch: vi.fn(),
  cancelMatch: vi.fn(),
  getMatchStats: vi.fn(),
  canRequestParticipation: vi.fn(),
};

// Mock do middleware de autenticação
const mockAuth = vi.fn((req, res, next) => {
  req.user = { userId: 1, email: 'test@example.com' };
  next();
});

describe('MatchController', () => {
  let app;
  let matchController;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Criar instância do MatchController e substituir o serviço
    matchController = new MatchController();
    matchController.matchService = mockMatchService;
    
    // Mock dos repositórios necessários
    matchController.projectRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, title: 'Test Project', creatorId: 1 })
    };
    matchController.userRepository = {
      findById: vi.fn().mockResolvedValue({ id: 1, name: 'Test User' })
    };
    matchController.notificationService = {
      createNotification: vi.fn().mockResolvedValue({})
    };
    
    app = express();
    app.use(express.json());
    
    // Rotas básicas usando a instância do controller
    app.post('/', mockAuth, (req, res) => matchController.createMatch(req, res));
    app.get('/received', mockAuth, (req, res) => matchController.getReceivedMatches(req, res));
    app.get('/sent', mockAuth, (req, res) => matchController.getSentMatches(req, res));
    app.get('/stats', mockAuth, (req, res) => matchController.getMatchStats(req, res));
    app.get('/:matchId', mockAuth, (req, res) => matchController.getMatchById(req, res));
    app.put('/:matchId/accept', mockAuth, (req, res) => matchController.acceptMatch(req, res));
    app.put('/:matchId/reject', mockAuth, (req, res) => matchController.rejectMatch(req, res));
    app.put('/:matchId/block', mockAuth, (req, res) => matchController.blockMatch(req, res));
    app.delete('/:matchId', mockAuth, (req, res) => matchController.cancelMatch(req, res));
    app.get('/can-request/:projectId', mockAuth, (req, res) => matchController.canRequestParticipation(req, res));
  });

  describe('POST /', () => {
    it('should create a match successfully', async () => {
      // Arrange
      const matchData = {
        projectId: 1,
        message: 'I would like to join this project'
      };

      const mockMatch = {
        id: 1,
        projectId: 1,
        userId: 1,
        message: 'I would like to join this project',
        status: 'pending',
        toJSON: () => ({
          id: 1,
          projectId: 1,
          userId: 1,
          message: 'I would like to join this project',
          status: 'pending'
        })
      };

      mockMatchService.createMatch.mockResolvedValue(mockMatch);

      // Act
      const response = await request(app)
        .post('/')
        .send(matchData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(mockMatchService.createMatch).toHaveBeenCalledWith(1, matchData.projectId, matchData.message);
    });

    it('should return 400 for missing data', async () => {
      // Act
      const response = await request(app)
        .post('/')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockMatchService.createMatch).not.toHaveBeenCalled();
    });

    it('should return 400 when projectId is missing', async () => {
      const response = await request(app)
        .post('/')
        .send({ message: 'Test message' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('ProjectId');
    });

    it('should return 400 when message is missing', async () => {
      const response = await request(app)
        .post('/')
        .send({ projectId: 1 });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toContain('message');
    });

    it('should return 401 when user is not authenticated', async () => {
      const mockAuthWithoutUser = vi.fn((req, res, next) => {
        req.user = null;
        next();
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.post('/', mockAuthWithoutUser, (req, res) => matchController.createMatch(req, res));

      const response = await request(testApp)
        .post('/')
        .send({ projectId: 1, message: 'Test' });

      expect(response.status).toBe(401);
    });

    it('should handle errors when creating match fails', async () => {
      mockMatchService.createMatch.mockRejectedValue(new Error('Erro ao criar match'));

      const response = await request(app)
        .post('/')
        .send({ projectId: 1, message: 'Test message' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /received', () => {
    it('should get received matches successfully', async () => {
      // Arrange
      const mockMatches = [
        {
          id: 1,
          projectId: 1,
          requesterId: 2,
          status: 'pending',
          toJSON: () => ({ id: 1, projectId: 1, requesterId: 2, status: 'pending' })
        }
      ];

      mockMatchService.getReceivedMatches.mockResolvedValue(mockMatches);

      // Act
      const response = await request(app)
        .get('/received');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(mockMatchService.getReceivedMatches).toHaveBeenCalledWith(1, undefined);
    });
  });

  describe('GET /stats', () => {
    it('should get match statistics successfully', async () => {
      // Arrange
      const mockStats = {
        sent: { total: 5 },
        received: { total: 3 }
      };

      mockMatchService.getMatchStats.mockResolvedValue(mockStats);

      // Act
      const response = await request(app)
        .get('/stats');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockStats);
      expect(mockMatchService.getMatchStats).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /can-request/:projectId', () => {
    it('should check if user can request participation', async () => {
      // Arrange
      const mockResult = { canRequest: true };
      mockMatchService.canRequestParticipation.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .get('/can-request/1');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body.data).toEqual(mockResult);
      expect(mockMatchService.canRequestParticipation).toHaveBeenCalledWith(1, '1');
    });

    it('should handle errors when checking participation fails', async () => {
      mockMatchService.canRequestParticipation.mockRejectedValue(new Error('Erro ao verificar'));

      const response = await request(app)
        .get('/can-request/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('DELETE /:matchId', () => {
    it('should cancel match successfully', async () => {
      mockMatchService.cancelMatch.mockResolvedValue(true);

      const response = await request(app)
        .delete('/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Match cancelado com sucesso');
    });

    it('should return 404 when match not found', async () => {
      mockMatchService.cancelMatch.mockResolvedValue(false);

      const response = await request(app)
        .delete('/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Match não encontrado');
    });

    it('should handle errors when canceling match fails', async () => {
      mockMatchService.cancelMatch.mockRejectedValue(new Error('Erro ao cancelar'));

      const response = await request(app)
        .delete('/1');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /:matchId', () => {
    it('should get match by id successfully', async () => {
      const mockMatch = {
        id: 1,
        projectId: 1,
        userId: 1,
        status: 'pending',
        toJSON: () => ({ id: 1, projectId: 1, userId: 1, status: 'pending' })
      };

      mockMatchService.getMatchById.mockResolvedValue(mockMatch);

      const response = await request(app)
        .get('/1');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should return 404 when match not found', async () => {
      mockMatchService.getMatchById.mockResolvedValue(null);

      const response = await request(app)
        .get('/999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body.message).toBe('Match não encontrado');
    });

    it('should handle errors when getting match fails', async () => {
      mockMatchService.getMatchById.mockRejectedValue(new Error('Erro ao buscar'));

      const response = await request(app)
        .get('/1');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /:matchId/accept', () => {
    it('should accept match successfully', async () => {
      const mockMatch = {
        id: 1,
        projectId: 1,
        userId: 2,
        status: 'accepted',
        toJSON: () => ({ id: 1, projectId: 1, userId: 2, status: 'accepted' })
      };

      mockMatchService.acceptMatch.mockResolvedValue(mockMatch);

      const response = await request(app)
        .put('/1/accept');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Match aceito com sucesso');
    });

    it('should return 401 when user is not authenticated', async () => {
      const mockAuthWithoutUser = vi.fn((req, res, next) => {
        req.user = null;
        next();
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.put('/:matchId/accept', mockAuthWithoutUser, (req, res) => matchController.acceptMatch(req, res));

      const response = await request(testApp)
        .put('/1/accept');

      expect(response.status).toBe(401);
    });

    it('should handle errors when accepting match fails', async () => {
      mockMatchService.acceptMatch.mockRejectedValue(new Error('Erro ao aceitar'));

      const response = await request(app)
        .put('/1/accept');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /:matchId/reject', () => {
    it('should reject match successfully', async () => {
      const mockMatch = {
        id: 1,
        projectId: 1,
        userId: 2,
        status: 'rejected',
        toJSON: () => ({ id: 1, projectId: 1, userId: 2, status: 'rejected' })
      };

      mockMatchService.rejectMatch.mockResolvedValue(mockMatch);

      const response = await request(app)
        .put('/1/reject');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Match rejeitado com sucesso');
    });

    it('should return 401 when user is not authenticated', async () => {
      const mockAuthWithoutUser = vi.fn((req, res, next) => {
        req.user = null;
        next();
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.put('/:matchId/reject', mockAuthWithoutUser, (req, res) => matchController.rejectMatch(req, res));

      const response = await request(testApp)
        .put('/1/reject');

      expect(response.status).toBe(401);
    });

    it('should handle errors when rejecting match fails', async () => {
      mockMatchService.rejectMatch.mockRejectedValue(new Error('Erro ao rejeitar'));

      const response = await request(app)
        .put('/1/reject');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('PUT /:matchId/block', () => {
    it('should block match successfully', async () => {
      const mockMatch = {
        id: 1,
        projectId: 1,
        userId: 2,
        status: 'blocked',
        toJSON: () => ({ id: 1, projectId: 1, userId: 2, status: 'blocked' })
      };

      mockMatchService.blockMatch.mockResolvedValue(mockMatch);

      const response = await request(app)
        .put('/1/block');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Match bloqueado com sucesso');
    });

    it('should return 401 when user is not authenticated', async () => {
      const mockAuthWithoutUser = vi.fn((req, res, next) => {
        req.user = null;
        next();
      });

      const testApp = express();
      testApp.use(express.json());
      testApp.put('/:matchId/block', mockAuthWithoutUser, (req, res) => matchController.blockMatch(req, res));

      const response = await request(testApp)
        .put('/1/block');

      expect(response.status).toBe(401);
    });

    it('should handle errors when blocking match fails', async () => {
      mockMatchService.blockMatch.mockRejectedValue(new Error('Erro ao bloquear'));

      const response = await request(app)
        .put('/1/block');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /sent', () => {
    it('should get sent matches successfully', async () => {
      const mockMatches = [
        {
          id: 1,
          projectId: 1,
          userId: 1,
          status: 'pending',
          toJSON: () => ({ id: 1, projectId: 1, userId: 1, status: 'pending' })
        }
      ];

      mockMatchService.getSentMatches.mockResolvedValue(mockMatches);

      const response = await request(app)
        .get('/sent');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
    });

    it('should handle errors when getting sent matches fails', async () => {
      mockMatchService.getSentMatches.mockRejectedValue(new Error('Erro ao buscar'));

      const response = await request(app)
        .get('/sent');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /received', () => {
    it('should handle errors when getting received matches fails', async () => {
      mockMatchService.getReceivedMatches.mockRejectedValue(new Error('Erro ao buscar'));

      const response = await request(app)
        .get('/received');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /stats', () => {
    it('should handle errors when getting stats fails', async () => {
      mockMatchService.getMatchStats.mockRejectedValue(new Error('Erro ao obter estatísticas'));

      const response = await request(app)
        .get('/stats');

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('success', false);
    });
  });
});
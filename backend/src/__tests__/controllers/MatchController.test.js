import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import MatchController from '../../controllers/MatchController.js';
import MatchService from '../../services/MatchService.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock das dependências
vi.mock('../../services/MatchService.js', () => ({
  default: vi.fn().mockImplementation(() => ({
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
  }))
}));
vi.mock('../../middleware/auth.js');

describe('MatchController', () => {
  let app;
  let matchController;
  let mockMatchService;
  let mockAuthenticateToken;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instância mock do MatchService
    mockMatchService = {
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
    
    // Usar a instância singleton do controller
    matchController = MatchController;
    
    // Get the mocked service instance from the controller
    mockMatchService = matchController.matchService;
    
    // Configure default mock responses
    mockMatchService.createMatch.mockResolvedValue({ id: 1, projectId: 1, userId: 1, status: 'pending' });
    mockMatchService.getReceivedMatches.mockResolvedValue([]);
    mockMatchService.getSentMatches.mockResolvedValue([]);
    mockMatchService.getMatchById.mockResolvedValue(null);
    mockMatchService.acceptMatch.mockResolvedValue({ id: 1, status: 'accepted' });
    mockMatchService.rejectMatch.mockResolvedValue({ id: 1, status: 'rejected' });
    mockMatchService.blockMatch.mockResolvedValue({ id: 1, status: 'blocked' });
    mockMatchService.cancelMatch.mockResolvedValue({ success: true });
    mockMatchService.getMatchStats.mockResolvedValue({ sent: { total: 0 }, received: { total: 0 } });
    mockMatchService.canRequestParticipation.mockResolvedValue({ canRequest: true });
    
    // Mock do middleware de autenticação
    mockAuthenticateToken = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    vi.mocked(authenticateToken).mockImplementation(mockAuthenticateToken);
    
    // Configurar app Express para testes
    app = express();
    app.use(express.json());
    
    // Rotas de teste
    app.post('/', authenticateToken, matchController.createMatch);
    app.get('/received', authenticateToken, matchController.getReceivedMatches);
    app.get('/sent', authenticateToken, matchController.getSentMatches);
    app.get('/stats', authenticateToken, matchController.getMatchStats);
    app.get('/:matchId', authenticateToken, matchController.getMatchById);
    app.put('/:matchId/accept', authenticateToken, matchController.acceptMatch);
    app.put('/:matchId/reject', authenticateToken, matchController.rejectMatch);
    app.put('/:matchId/block', authenticateToken, matchController.blockMatch);
    app.delete('/:matchId', authenticateToken, matchController.cancelMatch);
    app.get('/can-request/:projectId', authenticateToken, matchController.canRequestParticipation);
  });

  describe('POST /', () => {
    it('should create a new match successfully', async () => {
      // Arrange
      const matchData = {
        projectId: 1,
        message: 'I would like to join this project',
        skills: ['JavaScript', 'React'],
        experience: '2 years'
      };

      const mockMatch = {
        id: 1,
        ...matchData,
        requesterId: 1,
        status: 'pending',
        createdAt: new Date()
      };

      mockMatchService.createMatch.mockResolvedValue(mockMatch);

      // Act
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid-token')
        .send(matchData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('projectId', matchData.projectId);
      expect(mockMatchService.createMatch).toHaveBeenCalledWith(matchData, 1);
    });

    it('should return 400 for invalid match data', async () => {
      // Arrange
      const invalidData = {
        projectId: '', // ID vazio
        message: '', // Mensagem vazia
        skills: [] // Skills vazias
      };

      // Act
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockMatchService.createMatch).not.toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      mockAuthenticateToken.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Token inválido' });
      });

      const matchData = {
        projectId: 1,
        message: 'I would like to join this project'
      };

      // Act
      const response = await request(app)
        .post('/')
        .send(matchData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(mockMatchService.createMatch).not.toHaveBeenCalled();
    });

    it('should return 409 if match already exists', async () => {
      // Arrange
      const matchData = {
        projectId: 1,
        message: 'I would like to join this project'
      };

      mockMatchService.createMatch.mockRejectedValue(new Error('Solicitação já existe'));

      // Act
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid-token')
        .send(matchData);

      // Assert
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Solicitação já existe');
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
          message: 'I would like to join this project',
          createdAt: new Date()
        },
        {
          id: 2,
          projectId: 2,
          requesterId: 3,
          status: 'pending',
          message: 'I have experience with React',
          createdAt: new Date()
        }
      ];

      mockMatchService.getReceivedMatches.mockResolvedValue(mockMatches);

      // Act
      const response = await request(app)
        .get('/received')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockMatches);
      expect(mockMatchService.getReceivedMatches).toHaveBeenCalledWith(1);
    });

    it('should return empty array when no matches found', async () => {
      // Arrange
      mockMatchService.getReceivedMatches.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/received')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /sent', () => {
    it('should get sent matches successfully', async () => {
      // Arrange
      const mockMatches = [
        {
          id: 1,
          projectId: 1,
          requesterId: 1,
          status: 'pending',
          message: 'I would like to join this project',
          createdAt: new Date()
        },
        {
          id: 2,
          projectId: 2,
          requesterId: 1,
          status: 'accepted',
          message: 'I have experience with Node.js',
          createdAt: new Date()
        }
      ];

      mockMatchService.getSentMatches.mockResolvedValue(mockMatches);

      // Act
      const response = await request(app)
        .get('/sent')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockMatches);
      expect(mockMatchService.getSentMatches).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /stats', () => {
    it('should get match statistics successfully', async () => {
      // Arrange
      const mockStats = {
        total: 10,
        pending: 3,
        accepted: 5,
        rejected: 2,
        blocked: 0
      };

      mockMatchService.getMatchStats.mockResolvedValue(mockStats);

      // Act
      const response = await request(app)
        .get('/stats')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockStats);
      expect(mockMatchService.getMatchStats).toHaveBeenCalledWith(1);
    });

    it('should return 403 if user not authorized', async () => {
      // Arrange
      mockMatchService.getMatchStats.mockRejectedValue(new Error('Acesso negado'));

      // Act
      const response = await request(app)
        .get('/stats')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Acesso negado');
    });
  });

  describe('GET /:matchId', () => {
    it('should get match by id successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending',
        message: 'I would like to join this project',
        createdAt: new Date()
      };

      mockMatchService.getMatchById.mockResolvedValue(mockMatch);

      // Act
      const response = await request(app)
        .get(`/${matchId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockMatch);
      expect(mockMatchService.getMatch).toHaveBeenCalledWith(matchId, 1);
    });

    it('should return 404 if match not found', async () => {
      // Arrange
      const matchId = 999;

      mockMatchService.getMatchById.mockResolvedValue(null);

      // Act
      const response = await request(app)
        .get(`/${matchId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Match não encontrado');
    });
  });

  describe('PUT /:matchId/accept', () => {
    it('should accept match successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockResult = {
        success: true,
        message: 'Solicitação aceita com sucesso'
      };

      mockMatchService.acceptMatch.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .put(`/${matchId}/accept`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Solicitação aceita com sucesso');
      expect(mockMatchService.acceptMatch).toHaveBeenCalledWith(matchId, 1);
    });

    it('should return 403 if user not authorized', async () => {
      // Arrange
      const matchId = 1;

      mockMatchService.acceptMatch.mockRejectedValue(new Error('Apenas o criador do projeto pode aceitar solicitações'));

      // Act
      const response = await request(app)
        .put(`/${matchId}/accept`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Apenas o criador do projeto pode aceitar solicitações');
    });
  });

  describe('PUT /:matchId/reject', () => {
    it('should reject match successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockResult = {
        success: true,
        message: 'Solicitação rejeitada com sucesso'
      };

      mockMatchService.rejectMatch.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .put(`/${matchId}/reject`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Solicitação rejeitada com sucesso');
      expect(mockMatchService.rejectMatch).toHaveBeenCalledWith(matchId, 1);
    });
  });

  describe('PUT /:matchId/block', () => {
    it('should block match successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockResult = {
        success: true,
        message: 'Usuário bloqueado com sucesso'
      };

      mockMatchService.blockMatch.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .put(`/${matchId}/block`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Usuário bloqueado com sucesso');
      expect(mockMatchService.blockMatch).toHaveBeenCalledWith(matchId, 1);
    });
  });

  describe('DELETE /:matchId', () => {
    it('should cancel match successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockResult = {
        success: true,
        message: 'Solicitação cancelada com sucesso'
      };

      mockMatchService.cancelMatch.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .delete(`/${matchId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Match cancelado com sucesso');
      expect(mockMatchService.cancelMatch).toHaveBeenCalledWith("1", 1);
    });

    it('should return 403 if user not authorized', async () => {
      // Arrange
      const matchId = 1;

      mockMatchService.cancelMatch.mockRejectedValue(new Error('Apenas o solicitante pode cancelar a solicitação'));

      // Act
      const response = await request(app)
        .delete(`/${matchId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Apenas o solicitante pode cancelar a solicitação');
    });
  });

  describe('GET /can-request/:projectId', () => {
    it('should check if user can request participation successfully', async () => {
      // Arrange
      const projectId = 1;
      const mockResult = {
        canRequest: true,
        reason: null
      };

      mockMatchService.canRequestParticipation.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .get(`/can-request/${projectId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockResult);
      expect(mockMatchService.canRequestParticipation).toHaveBeenCalledWith(1, "1");
    });

    it('should return false if user cannot request', async () => {
      // Arrange
      const projectId = 1;
      const mockResult = {
        canRequest: false,
        reason: 'Usuário já é membro do projeto'
      };

      mockMatchService.canRequestParticipation.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .get(`/can-request/${projectId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockResult);
    });
  });
});

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
  });
});
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

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Substituir o serviço do controller
    Object.defineProperty(MatchController, '_matchService', {
      value: mockMatchService,
      writable: true
    });
    
    app = express();
    app.use(express.json());
    
    // Rotas básicas
    app.post('/', mockAuth, MatchController.createMatch);
    app.get('/received', mockAuth, MatchController.getReceivedMatches);
    app.get('/sent', mockAuth, MatchController.getSentMatches);
    app.get('/stats', mockAuth, MatchController.getMatchStats);
    app.get('/:matchId', mockAuth, MatchController.getMatchById);
    app.put('/:matchId/accept', mockAuth, MatchController.acceptMatch);
    app.put('/:matchId/reject', mockAuth, MatchController.rejectMatch);
    app.put('/:matchId/block', mockAuth, MatchController.blockMatch);
    app.delete('/:matchId', mockAuth, MatchController.cancelMatch);
    app.get('/can-request/:projectId', mockAuth, MatchController.canRequestParticipation);
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
      expect(response.body).toHaveProperty('data');
      expect(mockMatchService.createMatch).toHaveBeenCalledWith(1, 1, 'I would like to join this project');
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
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockResult);
      expect(mockMatchService.canRequestParticipation).toHaveBeenCalledWith(1, '1');
    });
  });
});
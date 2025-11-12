import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import RecommendationController from '../../controllers/RecommendationController.js';
import RecommendationService from '../../services/RecommendationService.js';

vi.mock('../../services/RecommendationService.js');

describe('RecommendationController', () => {
  let app;
  let recommendationController;
  let mockRecommendationService;
  let mockAuth;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRecommendationService = {
      calculateRecommendationScore: vi.fn(),
      getProjectsWithRecommendationScores: vi.fn(),
      calculateRecommendationScores: vi.fn()
    };

    vi.mocked(RecommendationService).mockImplementation(() => mockRecommendationService);
    
    recommendationController = new RecommendationController();
    recommendationController.recommendationService = mockRecommendationService;
    
    mockAuth = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    app = express();
    app.use(express.json());
    
    app.get('/api/recommendations/score/:projectId', mockAuth, (req, res) => recommendationController.getRecommendationScore(req, res));
    app.get('/api/recommendations/projects', mockAuth, (req, res) => recommendationController.getProjectsWithScores(req, res));
    app.post('/api/recommendations/scores', mockAuth, (req, res) => recommendationController.getMultipleScores(req, res));
  });

  describe('GET /api/recommendations/score/:projectId', () => {
    it('should get recommendation score successfully', async () => {
      mockRecommendationService.calculateRecommendationScore.mockResolvedValue(85);

      const response = await request(app)
        .get('/api/recommendations/score/1');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.recommendationScore).toBe(85);
      expect(response.body.data.projectId).toBe(1);
      expect(response.body.data.userId).toBe(1);
    });

    it('should handle errors', async () => {
      mockRecommendationService.calculateRecommendationScore.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/recommendations/score/1');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/recommendations/projects', () => {
    it('should get projects with scores successfully', async () => {
      const projects = [
        {
          id: 1,
          title: 'Project 1',
          description: 'Description',
          objectives: JSON.stringify(['obj1']),
          technologies: JSON.stringify(['tech1']),
          status: 'active',
          category: 'web',
          creator_id: 1,
          team_members: JSON.stringify([]),
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date(),
          recommendationScore: 90
        }
      ];

      mockRecommendationService.getProjectsWithRecommendationScores.mockResolvedValue(projects);

      const response = await request(app)
        .get('/api/recommendations/projects')
        .query({ limit: 50, offset: 0 });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].recommendationScore).toBe(90);
    });

    it('should apply filters', async () => {
      mockRecommendationService.getProjectsWithRecommendationScores.mockResolvedValue([]);

      const response = await request(app)
        .get('/api/recommendations/projects')
        .query({ status: 'active', category: 'web', technologies: 'JavaScript,React' });

      expect(response.status).toBe(200);
      expect(mockRecommendationService.getProjectsWithRecommendationScores).toHaveBeenCalledWith(
        1,
        50,
        0,
        expect.objectContaining({
          status: 'active',
          category: 'web',
          technologies: ['JavaScript', 'React']
        })
      );
    });

    it('should handle errors', async () => {
      mockRecommendationService.getProjectsWithRecommendationScores.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .get('/api/recommendations/projects');

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/recommendations/scores', () => {
    it('should calculate multiple scores successfully', async () => {
      const scores = { 1: 85, 2: 70, 3: 90 };
      mockRecommendationService.calculateRecommendationScores.mockResolvedValue(scores);

      const response = await request(app)
        .post('/api/recommendations/scores')
        .send({ projectIds: [1, 2, 3] });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(scores);
    });

    it('should return 400 when projectIds is not an array', async () => {
      const response = await request(app)
        .post('/api/recommendations/scores')
        .send({ projectIds: 'not-an-array' });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('projectIds deve ser um array');
    });

    it('should handle errors', async () => {
      mockRecommendationService.calculateRecommendationScores.mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/recommendations/scores')
        .send({ projectIds: [1, 2] });

      expect(response.status).toBe(500);
      expect(response.body.success).toBe(false);
    });
  });
});


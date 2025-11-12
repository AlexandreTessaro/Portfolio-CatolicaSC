import { describe, it, expect, beforeEach, vi } from 'vitest';
import { RecommendationService } from '../../services/RecommendationService.js';
import pool from '../../config/database.js';

vi.mock('../../config/database.js', () => ({
  default: {
    connect: vi.fn()
  }
}));

describe('RecommendationService', () => {
  let recommendationService;
  let mockClient;
  let mockRelease;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockRelease = vi.fn();
    mockClient = {
      query: vi.fn(),
      release: mockRelease
    };

    pool.connect.mockResolvedValue(mockClient);
    recommendationService = new RecommendationService();
  });

  describe('calculateRecommendationScore', () => {
    it('should calculate score based on matching skills', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript', 'React', 'Node.js']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: JSON.stringify(['JavaScript', 'React']) }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        });

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(score).toBeLessThanOrEqual(100);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should return 0 when user not found', async () => {
      mockClient.query.mockResolvedValueOnce({ rows: [] });

      const score = await recommendationService.calculateRecommendationScore(999, 1);

      expect(score).toBe(0);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should return 0 when project not found', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({ rows: [] });

      const score = await recommendationService.calculateRecommendationScore(1, 999);

      expect(score).toBe(0);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should handle string skills and technologies', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: '["JavaScript", "React"]' }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: '["JavaScript", "React", "Node.js"]' }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        });

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should handle parse errors gracefully', async () => {
      const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: 'invalid json' }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        });

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBeGreaterThanOrEqual(0);
      expect(consoleWarnSpy).toHaveBeenCalled();
      
      consoleWarnSpy.mockRestore();
    });

    it('should add history bonus for similar projects', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript', 'React']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: JSON.stringify(['JavaScript', 'React']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ status: 'accepted', technologies: JSON.stringify(['JavaScript', 'React']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        });

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBeGreaterThan(0);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should add category bonus', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '1' }]
        });

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBeGreaterThan(0);
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should return 0 on error', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClient.query.mockRejectedValue(new Error('Database error'));

      const score = await recommendationService.calculateRecommendationScore(1, 1);

      expect(score).toBe(0);
      expect(consoleErrorSpy).toHaveBeenCalled();
      
      consoleErrorSpy.mockRestore();
    });
  });

  describe('calculateRecommendationScores', () => {
    it('should calculate scores for multiple projects', async () => {
      mockClient.query
        .mockResolvedValue({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        });

      const scores = await recommendationService.calculateRecommendationScores(1, [1, 2, 3]);

      expect(Object.keys(scores)).toHaveLength(3);
      expect(scores[1]).toBeDefined();
      expect(scores[2]).toBeDefined();
      expect(scores[3]).toBeDefined();
    });
  });

  describe('getProjectsWithRecommendationScores', () => {
    it('should get projects with recommendation scores', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [
            { id: 1, title: 'Project 1', technologies: JSON.stringify(['JavaScript']) },
            { id: 2, title: 'Project 2', technologies: JSON.stringify(['Python']) }
          ]
        })
        .mockResolvedValue({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValue({ rows: [] })
        .mockResolvedValue({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValue({
          rows: [{ count: '0' }]
        });

      const projects = await recommendationService.getProjectsWithRecommendationScores(1, 10, 0);

      expect(projects).toHaveLength(2);
      expect(projects[0]).toHaveProperty('recommendationScore');
      expect(mockRelease).toHaveBeenCalled();
    });

    it('should apply filters correctly', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [{ id: 1, title: 'Project 1', status: 'active' }]
        })
        .mockResolvedValue({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValue({ rows: [] })
        .mockResolvedValue({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValue({
          rows: [{ count: '0' }]
        });

      const filters = { status: 'active', category: 'web' };
      await recommendationService.getProjectsWithRecommendationScores(1, 10, 0, filters);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('status'),
        expect.arrayContaining(['active'])
      );
    });

    it('should sort projects by recommendation score', async () => {
      mockClient.query
        .mockResolvedValueOnce({
          rows: [
            { id: 1, technologies: JSON.stringify(['Python']) },
            { id: 2, technologies: JSON.stringify(['JavaScript']) }
          ]
        })
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        })
        .mockResolvedValueOnce({
          rows: [{ skills: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({
          rows: [{ technologies: JSON.stringify(['JavaScript']) }]
        })
        .mockResolvedValueOnce({ rows: [] })
        .mockResolvedValueOnce({
          rows: [{ category: 'web' }]
        })
        .mockResolvedValueOnce({
          rows: [{ count: '0' }]
        });

      const projects = await recommendationService.getProjectsWithRecommendationScores(1, 10, 0);

      expect(projects[0].recommendationScore).toBeGreaterThanOrEqual(projects[1].recommendationScore);
    });

    it('should handle errors', async () => {
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      mockClient.query.mockRejectedValue(new Error('Database error'));

      await expect(
        recommendationService.getProjectsWithRecommendationScores(1, 10, 0)
      ).rejects.toThrow('Database error');
      
      consoleErrorSpy.mockRestore();
    });
  });
});


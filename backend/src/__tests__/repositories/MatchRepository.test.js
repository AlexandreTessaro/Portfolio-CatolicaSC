import { describe, it, expect, beforeEach, vi } from 'vitest';
import MatchRepository from '../../repositories/MatchRepository.js';
import Match from '../../domain/Match.js';

describe('MatchRepository', () => {
  let matchRepository;
  let mockDatabase;

  beforeEach(() => {
    mockDatabase = {
      query: vi.fn(),
      connect: vi.fn()
    };
    matchRepository = new MatchRepository(mockDatabase);
  });

  describe('create', () => {
    it('should create a new match', async () => {
      const matchData = {
        projectId: 1,
        userId: 2,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockResult = {
        rows: [{
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'Test message',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockDatabase.query.mockResolvedValue(mockResult);

      const result = await matchRepository.create(matchData);

      expect(result).toBeInstanceOf(Match);
      expect(result.id).toBe(1);
      expect(result.projectId).toBe(1);
      expect(result.userId).toBe(2);
      expect(mockDatabase.query).toHaveBeenCalled();
    });

    it('should throw error on database failure', async () => {
      const matchData = {
        projectId: 1,
        userId: 2,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.create(matchData)).rejects.toThrow('Erro ao criar match');
    });
  });

  describe('findById', () => {
    it('should find match by id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'Test message',
          created_at: new Date(),
          updated_at: new Date(),
          project_title: 'Test Project',
          project_description: 'Test Description',
          project_status: 'active',
          project_technologies: ['React'],
          project_creator_id: 1,
          user_name: 'Test User',
          user_email: 'test@example.com',
          user_bio: 'Test bio',
          user_skills: ['JavaScript'],
          user_avatar: 'avatar.jpg'
        }]
      };

      mockDatabase.query.mockResolvedValue(mockResult);

      const result = await matchRepository.findById(1);

      expect(result).toBeInstanceOf(Match);
      expect(result.id).toBe(1);
      expect(result.project).toBeDefined();
      expect(result.user).toBeDefined();
    });

    it('should return null when match not found', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await matchRepository.findById(999);

      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.findById(1)).rejects.toThrow('Erro ao buscar match');
    });
  });

  describe('findByProjectId', () => {
    it('should find matches by project id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'Test message',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockDatabase.query.mockResolvedValue(mockResult);

      const result = await matchRepository.findByProjectId(1);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Match);
    });

    it('should filter by status when provided', async () => {
      const mockResult = { rows: [] };
      mockDatabase.query.mockResolvedValue(mockResult);

      await matchRepository.findByProjectId(1, 'accepted');

      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('AND m.status = $2'),
        [1, 'accepted']
      );
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.findByProjectId(1)).rejects.toThrow('Erro ao buscar matches do projeto');
    });
  });

  describe('findByUserId', () => {
    it('should find matches by user id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'Test message',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockDatabase.query.mockResolvedValue(mockResult);

      const result = await matchRepository.findByUserId(2);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Match);
    });

    it('should filter by status when provided', async () => {
      const mockResult = { rows: [] };
      mockDatabase.query.mockResolvedValue(mockResult);

      await matchRepository.findByUserId(2, 'rejected');

      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('AND m.status = $2'),
        [2, 'rejected']
      );
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.findByUserId(2)).rejects.toThrow('Erro ao buscar matches do usuário');
    });
  });

  describe('existsByUserAndProject', () => {
    it('should return true when match exists', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await matchRepository.existsByUserAndProject(2, 1);

      expect(result).toBe(true);
    });

    it('should return false when match does not exist', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await matchRepository.existsByUserAndProject(2, 1);

      expect(result).toBe(false);
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.existsByUserAndProject(2, 1)).rejects.toThrow('Erro ao verificar match existente');
    });
  });

  describe('updateStatus', () => {
    it('should update match status', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'accepted',
          message: 'Test message',
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockDatabase.query.mockResolvedValue(mockResult);

      const result = await matchRepository.updateStatus(1, 'accepted');

      expect(result).toBeInstanceOf(Match);
      expect(result.status).toBe('accepted');
    });

    it('should return null when match not found', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await matchRepository.updateStatus(999, 'accepted');

      expect(result).toBeNull();
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.updateStatus(1, 'accepted')).rejects.toThrow('Erro ao atualizar status do match');
    });
  });

  describe('delete', () => {
    it('should delete match', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await matchRepository.delete(1);

      expect(result).toBe(true);
    });

    it('should return false when match not found', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [] });

      const result = await matchRepository.delete(999);

      expect(result).toBe(false);
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.delete(1)).rejects.toThrow('Erro ao deletar match');
    });
  });

  describe('countByStatus', () => {
    it('should count matches by status', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ count: '5' }] });

      const result = await matchRepository.countByStatus('pending');

      expect(result).toBe(5);
    });

    it('should return 0 when no matches found', async () => {
      mockDatabase.query.mockResolvedValue({ rows: [{ count: '0' }] });

      const result = await matchRepository.countByStatus('pending');

      expect(result).toBe(0);
    });

    it('should throw error on database failure', async () => {
      mockDatabase.query.mockRejectedValue(new Error('Database error'));

      await expect(matchRepository.countByStatus('pending')).rejects.toThrow('Erro ao contar matches');
    });
  });
});


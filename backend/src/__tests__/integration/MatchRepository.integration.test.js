import { vi, describe, it, beforeEach, expect, beforeAll, afterAll } from 'vitest';
import MatchRepository from '../../repositories/MatchRepository.js';
import Match from '../../domain/Match.js';

// Mock do banco de dados
const mockDatabase = {
  query: vi.fn()
};

describe('MatchRepository Integration Tests', () => {
  let matchRepository;

  beforeAll(() => {
    matchRepository = new MatchRepository(mockDatabase);
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new match successfully', async () => {
      // Arrange
      const matchData = {
        projectId: 1,
        userId: 2,
        status: 'pending',
        message: 'I would like to join this project',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const mockDbMatch = {
        id: 1,
        project_id: 1,
        user_id: 2,
        status: 'pending',
        message: 'I would like to join this project',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockDatabase.query.mockResolvedValue({
        rows: [mockDbMatch]
      });

      // Act
      const result = await matchRepository.create(matchData);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO matches'),
        expect.arrayContaining([
          1, // projectId
          2, // userId
          'pending', // status
          'I would like to join this project', // message
          expect.any(Date), // createdAt
          expect.any(Date)  // updatedAt
        ])
      );
      expect(result).toBeInstanceOf(Match);
      expect(result.id).toBe(1);
      expect(result.projectId).toBe(1);
      expect(result.userId).toBe(2);
      expect(result.status).toBe('pending');
      expect(result.message).toBe('I would like to join this project');
    });

    it('should handle database errors during match creation', async () => {
      // Arrange
      const matchData = {
        projectId: 1,
        userId: 2,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockDatabase.query.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(matchRepository.create(matchData)).rejects.toThrow('Erro ao criar match: Database connection failed');
    });
  });

  describe('findById', () => {
    it('should find match by id successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockDbMatch = {
        id: 1,
        project_id: 1,
        user_id: 2,
        status: 'pending',
        message: 'I would like to join this project',
        created_at: new Date(),
        updated_at: new Date(),
        project_title: 'Test Project',
        project_description: 'Test description',
        project_status: 'active',
        project_technologies: JSON.stringify(['JavaScript', 'React']),
        project_creator_id: 1,
        user_name: 'Test User',
        user_email: 'test@example.com',
        user_bio: 'Test bio',
        user_skills: JSON.stringify(['JavaScript']),
        user_avatar: 'avatar.jpg'
      };

      mockDatabase.query.mockResolvedValue({
        rows: [mockDbMatch]
      });

      // Act
      const result = await matchRepository.findById(matchId);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.*'),
        [matchId]
      );
      expect(result).toBeInstanceOf(Match);
      expect(result.id).toBe(1);
      expect(result.projectId).toBe(1);
      expect(result.userId).toBe(2);
      expect(result.status).toBe('pending');
    });

    it('should return null when match not found', async () => {
      // Arrange
      const matchId = 999;
      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.findById(matchId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('findByUserId', () => {
    it('should find matches by user id successfully', async () => {
      // Arrange
      const userId = 2;
      const status = 'pending';

      const mockDbMatches = [
        {
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'I would like to join this project',
          created_at: new Date(),
          updated_at: new Date(),
          project_title: 'Project 1',
          project_description: 'Description 1',
          project_status: 'active',
          project_technologies: JSON.stringify(['JavaScript']),
          project_creator_id: 1,
          user_name: 'Test User',
          user_email: 'test@example.com',
          user_bio: 'Test bio',
          user_skills: JSON.stringify(['JavaScript']),
          user_avatar: 'avatar.jpg'
        },
        {
          id: 2,
          project_id: 2,
          user_id: 2,
          status: 'pending',
          message: 'I am interested in this project',
          created_at: new Date(),
          updated_at: new Date(),
          project_title: 'Project 2',
          project_description: 'Description 2',
          project_status: 'active',
          project_technologies: JSON.stringify(['React']),
          project_creator_id: 3,
          user_name: 'Test User',
          user_email: 'test@example.com',
          user_bio: 'Test bio',
          user_skills: JSON.stringify(['JavaScript']),
          user_avatar: 'avatar.jpg'
        }
      ];

      mockDatabase.query.mockResolvedValue({
        rows: mockDbMatches
      });

      // Act
      const result = await matchRepository.findByUserId(userId, status);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.*'),
        [userId, status]
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Match);
      expect(result[1]).toBeInstanceOf(Match);
      expect(result[0].userId).toBe(userId);
      expect(result[1].userId).toBe(userId);
    });

    it('should return empty array when no matches found for user', async () => {
      // Arrange
      const userId = 999;
      const status = 'pending';

      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.findByUserId(userId, status);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findByProjectId', () => {
    it('should find matches by project id successfully', async () => {
      // Arrange
      const projectId = 1;

      const mockDbMatches = [
        {
          id: 1,
          project_id: 1,
          user_id: 2,
          status: 'pending',
          message: 'I would like to join this project',
          created_at: new Date(),
          updated_at: new Date(),
          project_title: 'Test Project',
          project_description: 'Test description',
          project_status: 'active',
          project_technologies: JSON.stringify(['JavaScript']),
          project_creator_id: 1,
          user_name: 'User 1',
          user_email: 'user1@example.com',
          user_bio: 'Bio 1',
          user_skills: JSON.stringify(['JavaScript']),
          user_avatar: 'avatar1.jpg'
        },
        {
          id: 2,
          project_id: 1,
          user_id: 3,
          status: 'pending',
          message: 'I am interested in this project',
          created_at: new Date(),
          updated_at: new Date(),
          project_title: 'Test Project',
          project_description: 'Test description',
          project_status: 'active',
          project_technologies: JSON.stringify(['JavaScript']),
          project_creator_id: 1,
          user_name: 'User 2',
          user_email: 'user2@example.com',
          user_bio: 'Bio 2',
          user_skills: JSON.stringify(['React']),
          user_avatar: 'avatar2.jpg'
        }
      ];

      mockDatabase.query.mockResolvedValue({
        rows: mockDbMatches
      });

      // Act
      const result = await matchRepository.findByProjectId(projectId);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT m.*'),
        [projectId]
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Match);
      expect(result[1]).toBeInstanceOf(Match);
      expect(result[0].projectId).toBe(projectId);
      expect(result[1].projectId).toBe(projectId);
    });

    it('should return empty array when no matches found for project', async () => {
      // Arrange
      const projectId = 999;

      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.findByProjectId(projectId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('updateStatus', () => {
    it('should update match status successfully', async () => {
      // Arrange
      const matchId = 1;
      const newStatus = 'accepted';

      mockDatabase.query.mockResolvedValue({
        rows: [{ id: matchId, status: newStatus }]
      });

      // Act
      const result = await matchRepository.updateStatus(matchId, newStatus);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE matches'),
        [newStatus, expect.any(Date), matchId]
      );
      expect(result).toBeInstanceOf(Match);
      expect(result.id).toBe(matchId);
      expect(result.status).toBe(newStatus);
    });

    it('should return null when match not found for update', async () => {
      // Arrange
      const matchId = 999;
      const newStatus = 'accepted';

      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.updateStatus(matchId, newStatus);

      // Assert
      expect(result).toBe(null);
    });
  });

  describe('existsByUserAndProject', () => {
    it('should return true when match exists between user and project', async () => {
      // Arrange
      const userId = 2;
      const projectId = 1;

      mockDatabase.query.mockResolvedValue({
        rows: [{ count: '1' }]
      });

      // Act
      const result = await matchRepository.existsByUserAndProject(userId, projectId);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id FROM matches'),
        [userId, projectId]
      );
      expect(result).toBe(true);
    });

    it('should return false when no match exists between user and project', async () => {
      // Arrange
      const userId = 999;
      const projectId = 999;

      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.existsByUserAndProject(userId, projectId);

      // Assert
      expect(result).toBe(false);
    });
  });


  describe('delete', () => {
    it('should delete match successfully', async () => {
      // Arrange
      const matchId = 1;

      mockDatabase.query.mockResolvedValue({
        rows: [{ id: matchId }]
      });

      // Act
      const result = await matchRepository.delete(matchId);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM matches WHERE id = $1'),
        [matchId]
      );
      expect(result).toBe(true);
    });

    it('should return false when match not found for deletion', async () => {
      // Arrange
      const matchId = 999;

      mockDatabase.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await matchRepository.delete(matchId);

      // Assert
      expect(result).toBe(false);
    });
  });

  describe('countByStatus', () => {
    it('should count matches by status successfully', async () => {
      // Arrange
      const status = 'pending';

      mockDatabase.query.mockResolvedValue({
        rows: [{ count: '5' }]
      });

      // Act
      const result = await matchRepository.countByStatus(status);

      // Assert
      expect(mockDatabase.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT COUNT(*) as count FROM matches WHERE status = $1'),
        [status]
      );
      expect(result).toBe(5);
    });

    it('should return 0 when no matches exist with status', async () => {
      // Arrange
      const status = 'blocked';

      mockDatabase.query.mockResolvedValue({
        rows: [{ count: '0' }]
      });

      // Act
      const result = await matchRepository.countByStatus(status);

      // Assert
      expect(result).toBe(0);
    });
  });
});

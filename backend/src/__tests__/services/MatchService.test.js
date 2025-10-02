import { describe, it, expect, beforeEach, vi } from 'vitest';
import MatchService from '../../services/MatchService.js';
import MatchRepository from '../../repositories/MatchRepository.js';
import { ProjectRepository } from '../../repositories/ProjectRepository.js';
import { UserRepository } from '../../repositories/UserRepository.js';

// Mock das dependências
vi.mock('../../repositories/MatchRepository.js');
vi.mock('../../repositories/ProjectRepository.js');
vi.mock('../../repositories/UserRepository.js');

describe('MatchService', () => {
  let matchService;
  let mockMatchRepository;
  let mockProjectRepository;
  let mockUserRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instâncias mock dos repositories
    mockMatchRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByRequesterId: vi.fn(),
      findByProjectId: vi.fn(),
      findByUserId: vi.fn(),
      findByCreatorId: vi.fn(),
      update: vi.fn(),
      updateStatus: vi.fn(),
      delete: vi.fn(),
      getMatchStats: vi.fn(),
      findExistingMatch: vi.fn(),
      existsByUserAndProject: vi.fn(),
    };

    mockProjectRepository = {
      findById: vi.fn(),
      findByCreatorId: vi.fn(),
      addTeamMember: vi.fn(),
    };

    mockUserRepository = {
      findById: vi.fn(),
    };
    
    // Mock dos repositories
    vi.mocked(MatchRepository).mockImplementation(() => mockMatchRepository);
    vi.mocked(ProjectRepository).mockImplementation(() => mockProjectRepository);
    vi.mocked(UserRepository).mockImplementation(() => mockUserRepository);
    
    // Criar instância do MatchService
    matchService = new MatchService();
  });

  describe('createMatch', () => {
    it('should create a new match successfully', async () => {
      // Arrange
      const userId = 1;
      const projectId = 1;
      const message = 'I would like to join this project and contribute with my skills';
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2,
        teamMembers: []
      };

      const mockMatch = {
        id: 1,
        projectId: projectId,
        userId: userId,
        message: message,
        status: 'pending',
        createdAt: new Date(),
        canBeAccepted: vi.fn().mockReturnValue(true),
        canBeRejected: vi.fn().mockReturnValue(true),
        canBeBlocked: vi.fn().mockReturnValue(true),
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.existsByUserAndProject.mockResolvedValue(false);
      mockMatchRepository.findExistingMatch.mockResolvedValue(null);
      mockMatchRepository.create.mockResolvedValue(mockMatch);

      // Act
      const result = await matchService.createMatch(userId, projectId, message);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockMatchRepository.existsByUserAndProject).toHaveBeenCalledWith(userId, projectId);
      expect(mockMatchRepository.create).toHaveBeenCalledWith({
        projectId: projectId,
        userId: userId,
        status: 'pending',
        message: message,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date)
      });
      expect(result).toEqual(mockMatch);
    });

    it('should throw error if project not found', async () => {
      // Arrange
      const userId = 1;
      const projectId = 999;
      const message = 'I would like to join this project and contribute with my skills';

      // Mock do repository para simular projeto não encontrado
      mockProjectRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(matchService.createMatch(userId, projectId, message)).rejects.toThrow('Projeto não encontrado');
    });

    it('should throw error if user is the project creator', async () => {
      // Arrange
      const userId = 1;
      const projectId = 1;
      const message = 'I would like to join this project and contribute with my skills';
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 1 // Mesmo ID do requester
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.existsByUserAndProject.mockResolvedValue(false);

      // Act & Assert
      await expect(matchService.createMatch(userId, projectId, message)).rejects.toThrow('Você não pode solicitar participação no seu próprio projeto');
    });

    it('should throw error if match already exists', async () => {
      // Arrange
      const userId = 1;
      const projectId = 1;
      const message = 'I would like to join this project and contribute with my skills';
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2
      };

      const existingMatch = {
        id: 1,
        projectId: 1,
        userId: 1,
        status: 'pending'
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.existsByUserAndProject.mockResolvedValue(true);

      // Act & Assert
      await expect(matchService.createMatch(userId, projectId, message)).rejects.toThrow('Você já enviou uma solicitação para este projeto');
    });
  });

  describe('getReceivedMatches', () => {
    it('should return received matches successfully', async () => {
      // Arrange
      const userId = 1;
      const mockMatches = [
        {
          id: 1,
          projectId: 1,
          requesterId: 2,
          status: 'pending',
          message: 'I would like to join this project'
        },
        {
          id: 2,
          projectId: 2,
          requesterId: 3,
          status: 'pending',
          message: 'I have experience with React'
        }
      ];

      // Mock do repository
      const userProjects = [{ id: 1 }, { id: 2 }];
      mockProjectRepository.findByCreatorId.mockResolvedValue(userProjects);
      mockMatchRepository.findByProjectId.mockImplementation((projectId) => {
        if (projectId === 1) {
          return Promise.resolve([mockMatches[0]]);
        } else if (projectId === 2) {
          return Promise.resolve([mockMatches[1]]);
        }
        return Promise.resolve([]);
      });

      // Act
      const result = await matchService.getReceivedMatches(userId);

      // Assert
      expect(mockProjectRepository.findByCreatorId).toHaveBeenCalledWith(userId);
      expect(mockMatchRepository.findByProjectId).toHaveBeenCalledWith(1, null);
      expect(mockMatchRepository.findByProjectId).toHaveBeenCalledWith(2, null);
      expect(result).toEqual(mockMatches);
    });

    it('should return empty array when no matches found', async () => {
      // Arrange
      const userId = 1;

      // Mock do repository
      mockProjectRepository.findByCreatorId.mockResolvedValue([]);
      mockMatchRepository.findByProjectId.mockResolvedValue([]);

      // Act
      const result = await matchService.getReceivedMatches(userId);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getSentMatches', () => {
    it('should return sent matches successfully', async () => {
      // Arrange
      const userId = 1;
      const mockMatches = [
        {
          id: 1,
          projectId: 1,
          requesterId: 1,
          status: 'pending',
          message: 'I would like to join this project'
        },
        {
          id: 2,
          projectId: 2,
          requesterId: 1,
          status: 'accepted',
          message: 'I have experience with Node.js'
        }
      ];

      // Mock do repository
      mockMatchRepository.findByUserId.mockResolvedValue(mockMatches);

      // Act
      const result = await matchService.getSentMatches(userId);

      // Assert
      expect(mockMatchRepository.findByUserId).toHaveBeenCalledWith(userId, null);
      expect(result).toEqual(mockMatches);
    });
  });

  describe('getMatchById', () => {
    it('should return match by id successfully', async () => {
      // Arrange
      const matchId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending',
        message: 'I would like to join this project'
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      // Act
      const result = await matchService.getMatchById(matchId);

      // Assert
      expect(mockMatchRepository.findById).toHaveBeenCalledWith(matchId);
      expect(result).toEqual(mockMatch);
    });

    it('should return null if match not found', async () => {
      // Arrange
      const matchId = 999;

      // Mock do repository para simular match não encontrado
      mockMatchRepository.findById.mockResolvedValue(null);

      // Act
      const result = await matchService.getMatchById(matchId);

      // Assert
      expect(result).toBeNull();
    });
  });

  describe('acceptMatch', () => {
    it('should accept match successfully', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending',
        message: 'I would like to join this project',
        canBeAccepted: vi.fn().mockReturnValue(true),
        canBeRejected: vi.fn().mockReturnValue(true),
        canBeBlocked: vi.fn().mockReturnValue(true),
      };

      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: []
      };

      const updatedMatch = {
        ...mockMatch,
        status: 'accepted',
        updatedAt: new Date()
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockProjectRepository.addTeamMember.mockResolvedValue(true);
      mockMatchRepository.updateStatus.mockResolvedValue(updatedMatch);

      // Act
      const result = await matchService.acceptMatch(matchId, userId);

      // Assert
      expect(mockMatchRepository.findById).toHaveBeenCalledWith(matchId);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(mockMatch.projectId);
      expect(mockProjectRepository.addTeamMember).toHaveBeenCalledWith(mockMatch.projectId, mockMatch.userId);
      expect(mockMatchRepository.updateStatus).toHaveBeenCalledWith(matchId, 'accepted');
      expect(result).toEqual(updatedMatch);
    });

    it('should throw error if user is not the project creator', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending'
      };

      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2 // Diferente do userId
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act & Assert
      await expect(matchService.acceptMatch(matchId, userId)).rejects.toThrow('Você não tem permissão para aceitar este match');
    });

    it('should throw error if match is not pending', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'accepted', // Já aceito
        canBeAccepted: vi.fn().mockReturnValue(false),
        canBeRejected: vi.fn().mockReturnValue(true),
        canBeBlocked: vi.fn().mockReturnValue(true),
      };

      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: userId
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act & Assert
      await expect(matchService.acceptMatch(matchId, userId)).rejects.toThrow('Este match não pode ser aceito');
    });
  });

  describe('rejectMatch', () => {
    it('should reject match successfully', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending',
        canBeAccepted: vi.fn().mockReturnValue(true),
        canBeRejected: vi.fn().mockReturnValue(true),
        canBeBlocked: vi.fn().mockReturnValue(true),
      };

      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: userId
      };

      const updatedMatch = {
        ...mockMatch,
        status: 'rejected',
        updatedAt: new Date()
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.updateStatus.mockResolvedValue(updatedMatch);

      // Act
      const result = await matchService.rejectMatch(matchId, userId);

      // Assert
      expect(mockMatchRepository.findById).toHaveBeenCalledWith(matchId);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(mockMatch.projectId);
      expect(mockMatchRepository.updateStatus).toHaveBeenCalledWith(matchId, 'rejected');
      expect(result).toEqual(updatedMatch);
    });
  });

  describe('blockMatch', () => {
    it('should block match successfully', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        requesterId: 2,
        status: 'pending',
        canBeAccepted: vi.fn().mockReturnValue(true),
        canBeRejected: vi.fn().mockReturnValue(true),
        canBeBlocked: vi.fn().mockReturnValue(true),
      };

      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: userId
      };

      const updatedMatch = {
        ...mockMatch,
        status: 'blocked',
        updatedAt: new Date()
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.updateStatus.mockResolvedValue(updatedMatch);

      // Act
      const result = await matchService.blockMatch(matchId, userId);

      // Assert
      expect(mockMatchRepository.findById).toHaveBeenCalledWith(matchId);
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(mockMatch.projectId);
      expect(mockMatchRepository.updateStatus).toHaveBeenCalledWith(matchId, 'blocked');
      expect(result).toEqual(updatedMatch);
    });
  });

  describe('cancelMatch', () => {
    it('should cancel match successfully', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        userId: userId,
        requesterId: userId,
        status: 'pending',
        isPending: vi.fn().mockReturnValue(true),
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);
      mockMatchRepository.delete.mockResolvedValue(true);

      // Act
      const result = await matchService.cancelMatch(matchId, userId);

      // Assert
      expect(mockMatchRepository.findById).toHaveBeenCalledWith(matchId);
      expect(mockMatchRepository.delete).toHaveBeenCalledWith(matchId);
      expect(result).toBe(true);
    });

    it('should throw error if user is not the requester', async () => {
      // Arrange
      const matchId = 1;
      const userId = 1;
      const mockMatch = {
        id: matchId,
        projectId: 1,
        userId: 2, // Diferente do userId
        requesterId: 2, // Diferente do userId
        status: 'pending',
        isPending: vi.fn().mockReturnValue(true),
      };

      // Mock do repository
      mockMatchRepository.findById.mockResolvedValue(mockMatch);

      // Act & Assert
      await expect(matchService.cancelMatch(matchId, userId)).rejects.toThrow('Você não tem permissão para cancelar este match');
    });
  });

  describe('getMatchStats', () => {
    it('should return match statistics successfully', async () => {
      // Arrange
      const userId = 1;
      const mockStats = {
        total: 10,
        pending: 3,
        accepted: 5,
        rejected: 2,
        blocked: 0
      };

      // Mock do repository
      mockMatchRepository.findByUserId.mockResolvedValue([]);
      mockProjectRepository.findByCreatorId.mockResolvedValue([]);
      mockMatchRepository.findByProjectId.mockResolvedValue([]);

      // Act
      const result = await matchService.getMatchStats(userId);

      // Assert
      expect(mockMatchRepository.findByUserId).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('sent');
      expect(result).toHaveProperty('received');
    });
  });

  describe('canRequestParticipation', () => {
    it('should return true if user can request participation', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2,
        teamMembers: []
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.existsByUserAndProject.mockResolvedValue(false);

      // Act
      const result = await matchService.canRequestParticipation(userId, projectId);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockMatchRepository.existsByUserAndProject).toHaveBeenCalledWith(userId, projectId);
      expect(result).toEqual({
        canRequest: true
      });
    });

    it('should return false if user is the project creator', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: userId // Mesmo ID
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act
      const result = await matchService.canRequestParticipation(userId, projectId);

      // Assert
      expect(result).toEqual({
        canRequest: false,
        reason: 'Você não pode solicitar participação no seu próprio projeto'
      });
    });

    it('should return false if user is already a team member', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2,
        teamMembers: [{ userId: userId }] // Já é membro
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act
      const result = await matchService.canRequestParticipation(userId, projectId);

      // Assert
      expect(result).toEqual({
        canRequest: false,
        reason: 'Usuário já é membro do projeto'
      });
    });

    it('should return false if match already exists', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const mockProject = {
        id: 1,
        title: 'Test Project',
        creatorId: 2,
        teamMembers: []
      };

      const existingMatch = {
        id: 1,
        projectId: 1,
        requesterId: userId,
        status: 'pending'
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockMatchRepository.existsByUserAndProject.mockResolvedValue(true);

      // Act
      const result = await matchService.canRequestParticipation(userId, projectId);

      // Assert
      expect(result).toEqual({
        canRequest: false,
        reason: 'Você já enviou uma solicitação para este projeto'
      });
    });
  });
});

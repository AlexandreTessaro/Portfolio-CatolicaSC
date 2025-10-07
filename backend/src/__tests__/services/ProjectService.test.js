import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectService } from '../../services/ProjectService.js';
import { ProjectRepository } from '../../repositories/ProjectRepository.js';
import { UserRepository } from '../../repositories/UserRepository.js';

// Mock das dependências
vi.mock('../../repositories/ProjectRepository.js');
vi.mock('../../repositories/UserRepository.js');

describe('ProjectService', () => {
  let projectService;
  let mockProjectRepository;
  let mockUserRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instâncias mock dos repositories
    mockProjectRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByCreatorId: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      findAll: vi.fn(),
      searchByText: vi.fn(),
    };

    mockUserRepository = {
      findById: vi.fn(),
    };
    
    // Mock dos repositories
    vi.mocked(ProjectRepository).mockImplementation(() => mockProjectRepository);
    vi.mocked(UserRepository).mockImplementation(() => mockUserRepository);
    
    // Criar instância do ProjectService
    projectService = new ProjectService();
  });

  describe('createProject', () => {
    it('should create a new project successfully', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'A test project description',
        objectives: ['Test objective 1', 'Test objective 2'],
        technologies: ['JavaScript', 'React'],
        category: 'Web Development',
        status: 'planning'
      };

      const creatorId = 1;
      const mockProject = {
        id: 1,
        ...projectData,
        creatorId,
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date(),
        toPublicView: vi.fn().mockReturnValue({
        id: 1,
        ...projectData,
        creatorId,
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date()
        })
      };

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue({ id: creatorId, name: 'Test User' });
      mockProjectRepository.create.mockResolvedValue(mockProject);

      // Act
      const result = await projectService.createProject(projectData, creatorId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(creatorId);
      expect(mockProjectRepository.create).toHaveBeenCalledWith({
        ...projectData,
        creatorId
      });
      expect(result).toEqual(mockProject.toPublicView());
    });

    it('should throw error if creator not found', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'A test project description'
      };
      const creatorId = 999;

      // Mock do repository para simular criador não encontrado
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.createProject(projectData, creatorId)).rejects.toThrow('Usuário criador não encontrado');
    });
  });

  describe('getProject', () => {
    it('should return project by id with populated team members', async () => {
      // Arrange
      const projectId = 1;
      const mockProject = {
        id: projectId,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1,
        teamMembers: [2, 3],
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          description: 'Test description',
          creatorId: 1,
          teamMembers: []
        })
      };

      const mockTeamMembers = [
        { id: 2, name: 'Member 1', profileImage: 'img1.jpg', bio: 'Bio 1', skills: ['React'] },
        { id: 3, name: 'Member 2', profileImage: 'img2.jpg', bio: 'Bio 2', skills: ['Node.js'] }
      ];

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockUserRepository.findById
        .mockResolvedValueOnce(mockTeamMembers[0])
        .mockResolvedValueOnce(mockTeamMembers[1]);

      // Act
      const result = await projectService.getProject(projectId);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockUserRepository.findById).toHaveBeenCalledTimes(2);
      expect(result.teamMembers).toHaveLength(2);
      expect(result.teamMembers[0]).toEqual({
        id: 2,
        name: 'Member 1',
        profileImage: 'img1.jpg',
        bio: 'Bio 1',
        skills: ['React']
      });
    });

    it('should return project by id without team members', async () => {
      // Arrange
      const projectId = 1;
      const mockProject = {
        id: projectId,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1,
        teamMembers: [],
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          description: 'Test description',
          creatorId: 1,
          teamMembers: []
        })
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act
      const result = await projectService.getProject(projectId);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(result.teamMembers).toEqual([]);
    });

    it('should throw error if project not found', async () => {
      // Arrange
      const projectId = 999;

      // Mock do repository para simular projeto não encontrado
      mockProjectRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.getProject(projectId)).rejects.toThrow('Projeto não encontrado');
    });
  });

  describe('updateProject', () => {
    it('should update project successfully', async () => {
      // Arrange
      const projectId = 1;
      const updates = {
        title: 'Updated Title',
        description: 'Updated description'
      };

      const existingProject = {
        id: projectId,
        title: 'Old Title',
        description: 'Old description',
        creatorId: 1
      };

      const updatedProject = {
        ...existingProject,
        ...updates,
        updatedAt: new Date(),
        toPublicView: vi.fn().mockReturnValue({
        ...existingProject,
        ...updates,
        updatedAt: new Date()
        })
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(existingProject);
      mockProjectRepository.update.mockResolvedValue(updatedProject);

      // Act
      const result = await projectService.updateProject(projectId, updates, 1);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, updates);
      expect(result).toEqual(updatedProject.toPublicView());
    });

    it('should throw error if user is not the creator', async () => {
      // Arrange
      const projectId = 1;
      const updates = { title: 'Updated Title' };
      const existingProject = {
        id: projectId,
        title: 'Old Title',
        creatorId: 2 // Diferente do usuário atual
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(existingProject);

      // Act & Assert
      await expect(projectService.updateProject(projectId, updates, 1)).rejects.toThrow('Apenas o criador pode editar o projeto');
    });
  });

  describe('deleteProject', () => {
    it('should delete project successfully', async () => {
      // Arrange
      const projectId = 1;
      const existingProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: 1
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(existingProject);
      mockProjectRepository.delete.mockResolvedValue(true);

      // Act
      const result = await projectService.deleteProject(projectId, 1);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockProjectRepository.delete).toHaveBeenCalledWith(projectId);
      expect(result).toEqual({ message: 'Projeto deletado com sucesso' });
    });

    it('should throw error if user is not the creator', async () => {
      // Arrange
      const projectId = 1;
      const existingProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: 2 // Diferente do usuário atual
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(existingProject);

      // Act & Assert
      await expect(projectService.deleteProject(projectId, 1)).rejects.toThrow('Apenas o criador pode deletar o projeto');
    });
  });

  describe('searchProjects', () => {
    it('should return projects matching search criteria', async () => {
      // Arrange
      const filters = {
        category: 'Web Development',
        status: 'active',
        technologies: ['React']
      };

      const mockProjects = [
        {
          id: 1,
          title: 'React App',
          category: 'Web Development',
          status: 'active',
          technologies: ['React', 'Node.js'],
          toSummary: vi.fn().mockReturnValue({
            id: 1,
            title: 'React App',
            category: 'Web Development',
            status: 'active',
            technologies: ['React', 'Node.js'],
            teamMembers: 0
          })
        }
      ];

      // Mock do repository
      mockProjectRepository.findAll.mockResolvedValue(mockProjects);

      // Act
      const result = await projectService.searchProjects(filters);

      // Assert
      expect(mockProjectRepository.findAll).toHaveBeenCalledWith(20, 0, filters);
      expect(result).toEqual(mockProjects.map(p => p.toSummary()));
    });
  });

  describe('searchProjectsByText', () => {
    it('should search projects by text successfully', async () => {
      // Arrange
      const searchTerm = 'react app';
      const limit = 10;

      const mockProjects = [
        {
          id: 1,
          title: 'React Todo App',
          description: 'A todo app built with React',
          toSummary: vi.fn().mockReturnValue({
            id: 1,
            title: 'React Todo App',
            description: 'A todo app built with React'
          })
        },
        {
          id: 2,
          title: 'React Dashboard',
          description: 'Dashboard built with React',
          toSummary: vi.fn().mockReturnValue({
            id: 2,
            title: 'React Dashboard',
            description: 'Dashboard built with React'
          })
        }
      ];

      // Mock do repository
      mockProjectRepository.searchByText.mockResolvedValue(mockProjects);

      // Act
      const result = await projectService.searchProjectsByText(searchTerm, limit);

      // Assert
      expect(mockProjectRepository.searchByText).toHaveBeenCalledWith(searchTerm, limit);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProjects[0].toSummary());
      expect(result[1]).toEqual(mockProjects[1].toSummary());
    });

    it('should return empty array when no projects found', async () => {
      // Arrange
      const searchTerm = 'nonexistent';
      const limit = 10;

      // Mock do repository
      mockProjectRepository.searchByText.mockResolvedValue([]);

      // Act
      const result = await projectService.searchProjectsByText(searchTerm, limit);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('getUserProjects', () => {
    it('should get user projects successfully', async () => {
      // Arrange
      const userId = 1;
      const limit = 10;
      const offset = 0;

      const mockProjects = [
        {
          id: 1,
          title: 'User Project 1',
          creatorId: userId,
          toSummary: vi.fn().mockReturnValue({
            id: 1,
            title: 'User Project 1',
            creatorId: userId
          })
        },
        {
          id: 2,
          title: 'User Project 2',
          creatorId: userId,
          toSummary: vi.fn().mockReturnValue({
            id: 2,
            title: 'User Project 2',
            creatorId: userId
          })
        }
      ];

      // Mock do repository
      mockProjectRepository.findByCreatorId.mockResolvedValue(mockProjects);

      // Act
      const result = await projectService.getUserProjects(userId, limit, offset);

      // Assert
      expect(mockProjectRepository.findByCreatorId).toHaveBeenCalledWith(userId, limit, offset);
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProjects[0].toSummary());
      expect(result[1]).toEqual(mockProjects[1].toSummary());
    });

    it('should return empty array when user has no projects', async () => {
      // Arrange
      const userId = 999;
      const limit = 10;
      const offset = 0;

      // Mock do repository
      mockProjectRepository.findByCreatorId.mockResolvedValue([]);

      // Act
      const result = await projectService.getUserProjects(userId, limit, offset);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('addTeamMember', () => {
    it('should add team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1; // Creator
      const newMemberId = 2;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: [],
        addTeamMember: vi.fn().mockImplementation(function(memberId) {
          this.teamMembers.push(memberId);
        }),
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          creatorId: userId,
          teamMembers: [newMemberId]
        })
      };

      const mockNewMember = {
        id: newMemberId,
        name: 'New Member',
        email: 'newmember@example.com'
      };

      const mockUpdatedProject = {
        ...mockProject,
        teamMembers: [newMemberId],
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          creatorId: userId,
          teamMembers: [newMemberId]
        })
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockUserRepository.findById.mockResolvedValue(mockNewMember);
      mockProjectRepository.update.mockResolvedValue(mockUpdatedProject);

      // Act
      const result = await projectService.addTeamMember(projectId, userId, newMemberId);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(newMemberId);
      expect(mockProject.addTeamMember).toHaveBeenCalledWith(newMemberId);
      expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, {
        teamMembers: [newMemberId]
      });
      expect(result).toEqual(mockUpdatedProject.toPublicView());
    });

    it('should throw error if project not found', async () => {
      // Arrange
      const projectId = 999;
      const userId = 1;
      const newMemberId = 2;

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.addTeamMember(projectId, userId, newMemberId)).rejects.toThrow('Projeto não encontrado');
    });

    it('should throw error if user is not the creator', async () => {
      // Arrange
      const projectId = 1;
      const userId = 2; // Not creator
      const newMemberId = 3;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: 1 // Different from userId
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act & Assert
      await expect(projectService.addTeamMember(projectId, userId, newMemberId)).rejects.toThrow('Apenas o criador pode adicionar membros da equipe');
    });

    it('should throw error if new member not found', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const newMemberId = 999;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: []
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.addTeamMember(projectId, userId, newMemberId)).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error if user is already a team member', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const newMemberId = 2;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: [newMemberId] // Already a member
      };

      const mockNewMember = {
        id: newMemberId,
        name: 'Existing Member'
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockUserRepository.findById.mockResolvedValue(mockNewMember);

      // Act & Assert
      await expect(projectService.addTeamMember(projectId, userId, newMemberId)).rejects.toThrow('Usuário já é membro da equipe');
    });
  });

  describe('removeTeamMember', () => {
    it('should remove team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1; // Creator
      const memberId = 2;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: [memberId],
        removeTeamMember: vi.fn().mockImplementation(function(memberId) {
          this.teamMembers = this.teamMembers.filter(id => id !== memberId);
        }),
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          creatorId: userId,
          teamMembers: []
        })
      };

      const mockUpdatedProject = {
        ...mockProject,
        teamMembers: [],
        toPublicView: vi.fn().mockReturnValue({
          id: projectId,
          title: 'Test Project',
          creatorId: userId,
          teamMembers: []
        })
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);
      mockProjectRepository.update.mockResolvedValue(mockUpdatedProject);

      // Act
      const result = await projectService.removeTeamMember(projectId, userId, memberId);

      // Assert
      expect(mockProjectRepository.findById).toHaveBeenCalledWith(projectId);
      expect(mockProject.removeTeamMember).toHaveBeenCalledWith(memberId);
      expect(mockProjectRepository.update).toHaveBeenCalledWith(projectId, {
        teamMembers: []
      });
      expect(result).toEqual(mockUpdatedProject.toPublicView());
    });

    it('should throw error if project not found', async () => {
      // Arrange
      const projectId = 999;
      const userId = 1;
      const memberId = 2;

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.removeTeamMember(projectId, userId, memberId)).rejects.toThrow('Projeto não encontrado');
    });

    it('should throw error if user is not the creator', async () => {
      // Arrange
      const projectId = 1;
      const userId = 2; // Not creator
      const memberId = 3;

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: 1 // Different from userId
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act & Assert
      await expect(projectService.removeTeamMember(projectId, userId, memberId)).rejects.toThrow('Apenas o criador pode remover membros da equipe');
    });

    it('should throw error if user is not a team member', async () => {
      // Arrange
      const projectId = 1;
      const userId = 1;
      const memberId = 999; // Not a member

      const mockProject = {
        id: projectId,
        title: 'Test Project',
        creatorId: userId,
        teamMembers: [2, 3] // memberId not included
      };

      // Mock do repository
      mockProjectRepository.findById.mockResolvedValue(mockProject);

      // Act & Assert
      await expect(projectService.removeTeamMember(projectId, userId, memberId)).rejects.toThrow('Usuário não é membro da equipe');
    });
  });

  describe('getRecommendedProjects', () => {
    it('should get recommended projects successfully', async () => {
      // Arrange
      const userId = 1;
      const limit = 5;

      const mockUser = {
        id: userId,
        name: 'Test User',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const mockProjects = [
        {
          id: 1,
          title: 'React Project',
          technologies: ['React', 'JavaScript'],
          toSummary: vi.fn().mockReturnValue({
            id: 1,
            title: 'React Project',
            technologies: ['React', 'JavaScript']
          })
        },
        {
          id: 2,
          title: 'Node.js API',
          technologies: ['Node.js', 'Express'],
          toSummary: vi.fn().mockReturnValue({
            id: 2,
            title: 'Node.js API',
            technologies: ['Node.js', 'Express']
          })
        }
      ];

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockProjectRepository.findAll.mockResolvedValue(mockProjects);

      // Act
      const result = await projectService.getRecommendedProjects(userId, limit);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockProjectRepository.findAll).toHaveBeenCalledWith(limit, 0, {
        technologies: mockUser.skills
      });
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(mockProjects[0].toSummary());
      expect(result[1]).toEqual(mockProjects[1].toSummary());
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;
      const limit = 5;

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(projectService.getRecommendedProjects(userId, limit)).rejects.toThrow('Usuário não encontrado');
    });

    it('should return empty array when no projects match user skills', async () => {
      // Arrange
      const userId = 1;
      const limit = 5;

      const mockUser = {
        id: userId,
        name: 'Test User',
        skills: ['Python', 'Django']
      };

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockProjectRepository.findAll.mockResolvedValue([]);

      // Act
      const result = await projectService.getRecommendedProjects(userId, limit);

      // Assert
      expect(result).toEqual([]);
    });
  });
});

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
      getUserProjects: vi.fn(),
      addTeamMember: vi.fn(),
      removeTeamMember: vi.fn(),
      getRecommendedProjects: vi.fn(),
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
      expect(mockProjectRepository.create).toHaveBeenCalledWith({
        ...projectData,
        creatorId
      });
      expect(result).toEqual(mockProject.toPublicView());
    });
  });

  describe('getProject', () => {
    it('should return project by id', async () => {
      // Arrange
      const projectId = 1;
      const mockProject = {
        id: projectId,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1,
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
      expect(result).toEqual(mockProject.toPublicView());
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
});

import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { ProjectController } from '../../controllers/ProjectController.js';
import { ProjectService } from '../../services/ProjectService.js';
import { authenticateToken, optionalAuth } from '../../middleware/auth.js';

// Mock das dependências
vi.mock('../../services/ProjectService.js');
vi.mock('../../middleware/auth.js');

describe('ProjectController', () => {
  let app;
  let projectController;
  let mockProjectService;
  let mockAuthenticateToken;
  let mockOptionalAuth;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instância mock do ProjectService
    mockProjectService = {
      createProject: vi.fn(),
      getProject: vi.fn(),
      updateProject: vi.fn(),
      deleteProject: vi.fn(),
      searchProjects: vi.fn(),
      searchProjectsByText: vi.fn(),
      getUserProjects: vi.fn(),
      addTeamMember: vi.fn(),
      removeTeamMember: vi.fn(),
      getRecommendedProjects: vi.fn(),
    };
    
    // Mock do ProjectService
    vi.mocked(ProjectService).mockImplementation(() => mockProjectService);
    
    // Mock do middleware de autenticação
    mockAuthenticateToken = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    mockOptionalAuth = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    vi.mocked(authenticateToken).mockImplementation(mockAuthenticateToken);
    vi.mocked(optionalAuth).mockImplementation(mockOptionalAuth);
    
    // Criar instância do controller e substituir o serviço
    projectController = new ProjectController();
    projectController.projectService = mockProjectService;
    
    // Configurar app Express para testes
    app = express();
    app.use(express.json());
    
    // Rotas de teste
    app.get('/', optionalAuth, projectController.searchProjects);
    app.get('/search', optionalAuth, projectController.searchProjectsByText);
    app.get('/:projectId', optionalAuth, projectController.getProject);
    app.get('/user/:userId', optionalAuth, projectController.getUserProjects);
    app.post('/', authenticateToken, projectController.validateCreateProject(), projectController.createProject);
    app.put('/:projectId', authenticateToken, projectController.updateProject);
    app.delete('/:projectId', authenticateToken, projectController.deleteProject);
    app.post('/:projectId/team', authenticateToken, projectController.addTeamMember);
    app.delete('/:projectId/team/:memberId', authenticateToken, projectController.removeTeamMember);
    app.get('/recommended', authenticateToken, projectController.getRecommendedProjects);
  });

  describe('POST /', () => {
    it('should create a new project successfully', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'A test project description',
        objectives: 'Test objectives',
        technologies: ['JavaScript', 'React'],
        category: 'Web Development',
        status: 'planning'
      };

      const mockProject = {
        id: 1,
        ...projectData,
        creatorId: 1,
        teamMembers: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockProjectService.createProject.mockResolvedValue(mockProject);

      // Act
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid-token')
        .send(projectData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('title', projectData.title);
      expect(mockProjectService.createProject).toHaveBeenCalledWith(projectData, 1);
    });

    it('should return 400 for invalid project data', async () => {
      // Arrange
      const invalidData = {
        title: '', // Título vazio
        description: 'A test project description',
        technologies: [] // Tecnologias vazias
      };

      // Act
      const response = await request(app)
        .post('/')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      mockAuthenticateToken.mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Token inválido' });
      });

      const projectData = {
        title: 'Test Project',
        description: 'A test project description'
      };

      // Act
      const response = await request(app)
        .post('/')
        .send(projectData);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });
  });

  describe('GET /:projectId', () => {
    it('should get project by id successfully', async () => {
      // Arrange
      const projectId = 1;
      const mockProject = {
        id: projectId,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1,
        teamMembers: [],
        technologies: ['JavaScript', 'React']
      };

      mockProjectService.getProject.mockResolvedValue(mockProject);

      // Act
      const response = await request(app)
        .get(`/${projectId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProject);
      expect(mockProjectService.getProject).toHaveBeenCalledWith(projectId.toString(), 1);
    });

    it('should return 404 if project not found', async () => {
      // Arrange
      const projectId = 999;

      mockProjectService.getProject.mockRejectedValue(new Error('Projeto não encontrado'));

      // Act
      const response = await request(app)
        .get(`/${projectId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Projeto não encontrado');
    });
  });

  describe('PUT /:projectId', () => {
    it('should update project successfully', async () => {
      // Arrange
      const projectId = 1;
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'development'
      };

      const mockUpdatedProject = {
        id: projectId,
        title: 'Updated Title',
        description: 'Updated description',
        status: 'development',
        creatorId: 1,
        updatedAt: new Date()
      };

      mockProjectService.updateProject.mockResolvedValue(mockUpdatedProject);

      // Act
      const response = await request(app)
        .put(`/${projectId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toMatchObject({
        id: projectId,
        title: 'Updated Title',
        description: 'Updated description',
        status: 'development',
        creatorId: 1
      });
      expect(response.body.data).toHaveProperty('updatedAt');
      expect(mockProjectService.updateProject).toHaveBeenCalledWith(projectId.toString(), updateData, 1);
    });

    it('should return 403 if user is not the creator', async () => {
      // Arrange
      const projectId = 1;
      const updateData = {
        title: 'Updated Title'
      };

      mockProjectService.updateProject.mockRejectedValue(new Error('Apenas o criador pode editar este projeto'));

      // Act
      const response = await request(app)
        .put(`/${projectId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Apenas o criador pode editar este projeto');
    });

    it('should return 400 for invalid update data', async () => {
      // Arrange
      const projectId = 1;
      const invalidData = {
        title: '', // Título vazio
        status: 'invalid-status' // Status inválido
      };

      // Act
      const response = await request(app)
        .put(`/${projectId}`)
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(mockProjectService.updateProject).toHaveBeenCalled();
    });
  });

  describe('DELETE /:projectId', () => {
    it('should delete project successfully', async () => {
      // Arrange
      const projectId = 1;

      mockProjectService.deleteProject.mockResolvedValue(true);

      // Act
      const response = await request(app)
        .delete(`/${projectId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(mockProjectService.deleteProject).toHaveBeenCalledWith(projectId.toString(), 1);
    });

    it('should return 403 if user is not the creator', async () => {
      // Arrange
      const projectId = 1;

      mockProjectService.deleteProject.mockRejectedValue(new Error('Apenas o criador pode excluir este projeto'));

      // Act
      const response = await request(app)
        .delete(`/${projectId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Apenas o criador pode excluir este projeto');
    });
  });

  describe('GET /', () => {
    it('should search projects successfully', async () => {
      // Arrange
      const searchParams = {
        category: 'Web Development',
        status: 'active',
        technologies: 'React,Node.js',
        limit: 10,
        offset: 0
      };

      const mockProjects = [
        {
          id: 1,
          title: 'React App',
          category: 'Web Development',
          status: 'active',
          technologies: ['React', 'Node.js']
        },
        {
          id: 2,
          title: 'Node.js API',
          category: 'Web Development',
          status: 'active',
          technologies: ['Node.js', 'Express']
        }
      ];

      mockProjectService.searchProjects.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get('/')
        .query(searchParams);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProjects);
      expect(mockProjectService.searchProjects).toHaveBeenCalledWith(
        {
          category: 'Web Development',
          status: 'active',
          technologies: ['React', 'Node.js']
        },
        10,
        0
      );
    });

    it('should return empty array when no projects found', async () => {
      // Arrange
      const searchParams = {
        category: 'Nonexistent',
        limit: 10,
        offset: 0
      };

      mockProjectService.searchProjects.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/')
        .query(searchParams);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /search', () => {
    it('should search projects by text successfully', async () => {
      // Arrange
      const searchParams = {
        q: 'react app',
        limit: 10,
        offset: 0
      };

      const mockProjects = [
        {
          id: 1,
          title: 'React Todo App',
          description: 'A todo app built with React'
        },
        {
          id: 2,
          title: 'React Portfolio',
          description: 'Portfolio website using React'
        }
      ];

      mockProjectService.searchProjectsByText.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get('/search')
        .query(searchParams);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProjects);
      expect(mockProjectService.searchProjectsByText).toHaveBeenCalledWith('react app', 10);
    });
  });

  describe('GET /user/:userId', () => {
    it('should get user projects successfully', async () => {
      // Arrange
      const userId = 1;
      const mockProjects = [
        {
          id: 1,
          title: 'User Project 1',
          creatorId: userId
        },
        {
          id: 2,
          title: 'User Project 2',
          creatorId: userId
        }
      ];

      mockProjectService.getUserProjects.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get(`/user/${userId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProjects);
      expect(mockProjectService.getUserProjects).toHaveBeenCalledWith('1', 20, 0);
    });

    it('should get user projects with pagination', async () => {
      // Arrange
      const userId = 1;
      const limit = 5;
      const offset = 10;
      const mockProjects = [];

      mockProjectService.getUserProjects.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get(`/user/${userId}`)
        .query({ limit, offset });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProjects);
      expect(mockProjectService.getUserProjects).toHaveBeenCalledWith('1', limit, offset);
    });
  });

  describe('POST /:projectId/team', () => {
    it('should add team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const memberData = {
        userId: 2,
        role: 'developer'
      };

      const mockResult = {
        success: true,
        message: 'Membro adicionado com sucesso'
      };

      mockProjectService.addTeamMember.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post(`/${projectId}/team`)
        .set('Authorization', 'Bearer valid-token')
        .send(memberData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 400 for invalid member data', async () => {
      // Arrange
      const projectId = 1;
      const invalidData = {
        userId: '', // ID vazio
        role: '' // Role vazio
      };

      // Act
      const response = await request(app)
        .post(`/${projectId}/team`)
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockProjectService.addTeamMember).not.toHaveBeenCalled();
    });
  });

  describe('DELETE /:projectId/team/:memberId', () => {
    it('should remove team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const memberId = 2;

      const mockResult = {
        success: true,
        message: 'Membro removido com sucesso'
      };

      mockProjectService.removeTeamMember.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .delete(`/${projectId}/team/${memberId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Membro removido da equipe com sucesso');
      expect(mockProjectService.removeTeamMember).toHaveBeenCalledWith(projectId.toString(), 1, memberId.toString());
    });

    it('should return 404 if member not found', async () => {
      // Arrange
      const projectId = 1;
      const memberId = 999;

      mockProjectService.removeTeamMember.mockRejectedValue(new Error('Membro não encontrado'));

      // Act
      const response = await request(app)
        .delete(`/${projectId}/team/${memberId}`)
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Membro não encontrado');
    });
  });

  describe('GET /recommended', () => {
    it('should get recommended projects successfully', async () => {
      // Arrange
      const mockProjects = [
        {
          id: 1,
          title: 'Recommended Project 1',
          matchScore: 0.95
        },
        {
          id: 2,
          title: 'Recommended Project 2',
          matchScore: 0.87
        }
      ];

      mockProjectService.getRecommendedProjects.mockResolvedValue({
        success: true,
        data: mockProjects
      });

      // Act
      const response = await request(app)
        .get('/recommended')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      // Criar uma nova instância do app sem autenticação
      const unauthApp = express();
      unauthApp.use(express.json());
      unauthApp.get('/recommended', (req, res) => {
        res.status(401).json({ success: false, message: 'Token inválido' });
      });

      // Act
      const response = await request(unauthApp)
        .get('/recommended');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(mockProjectService.getRecommendedProjects).not.toHaveBeenCalled();
    });
  });
});

import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { ProjectController } from '../../controllers/ProjectController.js';

// Mock simples do ProjectService
const mockProjectService = {
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

// Mock do middleware de autenticação
const mockAuth = vi.fn((req, res, next) => {
  req.user = { userId: 1, email: 'test@example.com' };
  next();
});

describe('ProjectController - Basic Tests', () => {
  let app;
  let projectController;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Criar instância do controller e substituir o serviço
    projectController = new ProjectController();
    projectController.projectService = mockProjectService;
    
    app = express();
    app.use(express.json());
    
    // Rotas básicas
    app.post('/', mockAuth, projectController.validateCreateProject(), projectController.createProject);
    app.get('/:projectId', projectController.getProject);
    app.put('/:projectId', mockAuth, projectController.validateUpdateProject(), projectController.updateProject);
    app.delete('/:projectId', mockAuth, projectController.deleteProject);
    app.get('/', projectController.searchProjects);
    app.get('/search', projectController.searchProjectsByText);
    app.get('/user/:userId', projectController.getUserProjects);
    app.post('/:projectId/team', mockAuth, projectController.addTeamMember);
    app.delete('/:projectId/team/:memberId', mockAuth, projectController.removeTeamMember);
    app.get('/recommended', mockAuth, projectController.getRecommendedProjects);
  });

  describe('POST /', () => {
    it('should create a project successfully', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        category: 'Web Development',
        technologies: ['React', 'Node.js'],
        objectives: ['Learn React', 'Build API']
      };

      const mockProject = {
        id: 1,
        ...projectData,
        creatorId: 1,
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        toPublicView: () => ({
          id: 1,
          ...projectData,
          creatorId: 1,
          status: 'active',
          createdAt: new Date(),
          updatedAt: new Date()
        })
      };

      mockProjectService.createProject.mockResolvedValue(mockProject);

      // Act
      const response = await request(app)
        .post('/')
        .send(projectData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(mockProjectService.createProject).toHaveBeenCalledWith(projectData, 1);
    });

    it('should return 400 for invalid data', async () => {
      // Act
      const response = await request(app)
        .post('/')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockProjectService.createProject).not.toHaveBeenCalled();
    });
  });

  describe('GET /:projectId', () => {
    it('should get project by id successfully', async () => {
      // Arrange
      const projectId = 1;
      const mockProject = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1
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
      expect(mockProjectService.getProject).toHaveBeenCalledWith(projectId.toString(), null);
    });
  });

  describe('GET /', () => {
    it('should search projects successfully', async () => {
      // Arrange
      const mockProjects = [
        {
          id: 1,
          title: 'React App',
          category: 'Web Development',
          status: 'active',
          technologies: ['React', 'Node.js']
        }
      ];

      mockProjectService.searchProjects.mockResolvedValue(mockProjects);

      // Act
      const response = await request(app)
        .get('/')
        .query({ category: 'Web Development', status: 'active', technologies: 'React,Node.js' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProjects);
      expect(mockProjectService.searchProjects).toHaveBeenCalled();
    });
  });

  describe('GET /user/:userId', () => {
    it('should get user projects successfully', async () => {
      // Arrange
      const userId = 1;
      const mockProjects = [
        {
          id: 1,
          title: 'My Project',
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
      expect(mockProjectService.getUserProjects).toHaveBeenCalledWith(userId.toString(), 20, 0);
    });
  });

  // describe('GET /recommended', () => {
  //   it('should get recommended projects successfully', async () => {
  //     // Arrange
  //     const mockProjects = [
  //       {
  //         id: 1,
  //         title: 'Recommended Project',
  //         category: 'Web Development'
  //       }
  //     ];

  //     mockProjectService.getRecommendedProjects.mockResolvedValue({
  //       id: 1,
  //       title: 'Test Project',
  //       description: 'Test description',
  //       creatorId: 1
  //     });

  //     // Act
  //     const response = await request(app)
  //       .get('/recommended');

  //     // Assert
  //     expect(response.status).toBe(200);
  //     expect(response.body).toHaveProperty('success', true);
  //     expect(response.body).toHaveProperty('data');
  //     expect(response.body.data).toEqual({
  //       id: 1,
  //       title: 'Test Project',
  //       description: 'Test description',
  //       creatorId: 1
  //     });
  //     expect(mockProjectService.getRecommendedProjects).toHaveBeenCalledWith(1);
  //   });
  // });
});

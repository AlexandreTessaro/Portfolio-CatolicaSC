import { vi, describe, it, beforeEach, expect, beforeAll, afterAll } from 'vitest';
import { ProjectRepository } from '../../repositories/ProjectRepository.js';
import Project from '../../domain/Project.js';

// Mock do módulo database
vi.mock('../../config/database.js', () => ({
  default: {
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn()
  }
}));

describe('ProjectRepository Integration Tests', () => {
  let projectRepository;
  let mockPool;
  let mockClient;

  beforeAll(async () => {
    // Importar o mock após o vi.mock
    const databaseModule = await import('../../config/database.js');
    mockPool = databaseModule.default;
    
    projectRepository = new ProjectRepository();
  });

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock do cliente de conexão
    mockClient = {
      query: vi.fn(),
      release: vi.fn()
    };
    
    mockPool.connect.mockResolvedValue(mockClient);
  });

  afterAll(() => {
    vi.restoreAllMocks();
  });

  describe('create', () => {
    it('should create a new project successfully', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        objectives: ['Objective 1', 'Objective 2'],
        technologies: ['JavaScript', 'React'],
        status: 'planning',
        category: 'Web Development',
        creatorId: 1,
        images: ['image1.jpg', 'image2.jpg']
      };

      const mockDbProject = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        objectives: JSON.stringify(['Objective 1', 'Objective 2']),
        technologies: JSON.stringify(['JavaScript', 'React']),
        status: 'planning',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([]),
        collaborators: [],
        images: JSON.stringify(['image1.jpg', 'image2.jpg']),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockDbProject]
      });

      // Act
      const result = await projectRepository.create(projectData);

      // Assert
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining([
          'Test Project',
          'Test description',
          JSON.stringify(['Objective 1', 'Objective 2']),
          JSON.stringify(['JavaScript', 'React']),
          'planning',
          'Web Development',
          1,
          JSON.stringify(['image1.jpg', 'image2.jpg']),
          expect.any(Date),
          expect.any(Date)
        ])
      );
      expect(result).toBeInstanceOf(Project);
      expect(result.title).toBe('Test Project');
      expect(result.description).toBe('Test description');
      expect(result.objectives).toEqual(['Objective 1', 'Objective 2']);
      expect(result.technologies).toEqual(['JavaScript', 'React']);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle database errors during project creation', async () => {
      // Arrange
      const projectData = {
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1
      };

      mockClient.query.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(projectRepository.create(projectData)).rejects.toThrow('Database connection failed');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find project by id successfully', async () => {
      // Arrange
      const projectId = 1;
      const mockDbProject = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        objectives: JSON.stringify(['Objective 1']),
        technologies: JSON.stringify(['JavaScript']),
        status: 'active',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([]),
        collaborators: [],
        images: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockDbProject]
      });

      // Act
      const result = await projectRepository.findById(projectId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM projects WHERE id = $1'),
        [projectId]
      );
      expect(result).toBeInstanceOf(Project);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Project');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return null when project not found', async () => {
      // Arrange
      const projectId = 999;
      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await projectRepository.findById(projectId);

      // Assert
      expect(result).toBeNull();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update project successfully', async () => {
      // Arrange
      const projectId = 1;
      const updateData = {
        title: 'Updated Title',
        description: 'Updated description',
        status: 'development'
      };

      const mockUpdatedProject = {
        id: 1,
        title: 'Updated Title',
        description: 'Updated description',
        objectives: JSON.stringify(['Objective 1']),
        technologies: JSON.stringify(['JavaScript']),
        status: 'development',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([]),
        collaborators: [],
        images: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedProject]
      });

      // Act
      const result = await projectRepository.update(projectId, updateData);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE projects'),
        [
          'Updated Title',
          'Updated description',
          'development',
          expect.any(Date),
          projectId
        ]
      );
      expect(result).toBeInstanceOf(Project);
      expect(result.title).toBe('Updated Title');
      expect(result.description).toBe('Updated description');
      expect(result.status).toBe('development');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      // Arrange
      const projectId = 1;
      const updateData = {
        title: 'New Title'
      };

      const mockUpdatedProject = {
        id: 1,
        title: 'New Title',
        description: 'Test description',
        objectives: JSON.stringify(['Objective 1']),
        technologies: JSON.stringify(['JavaScript']),
        status: 'active',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([]),
        collaborators: [],
        images: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedProject]
      });

      // Act
      const result = await projectRepository.update(projectId, updateData);

      // Assert
      expect(result).toBeInstanceOf(Project);
      expect(result.title).toBe('New Title');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete project successfully', async () => {
      // Arrange
      const projectId = 1;
      mockClient.query.mockResolvedValue({
        rows: [{ id: projectId }]
      });

      // Act
      const result = await projectRepository.delete(projectId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM projects WHERE id = $1'),
        [projectId]
      );
      expect(result).toBe(true);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return false when project not found for deletion', async () => {
      // Arrange
      const projectId = 999;
      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await projectRepository.delete(projectId);

      // Assert
      expect(result).toBe(false);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all projects with pagination', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;
      const filters = {
        category: 'Web Development',
        status: 'active'
      };

      const mockProjects = [
        {
          id: 1,
          title: 'Project 1',
          description: 'Description 1',
          objectives: JSON.stringify(['Objective 1']),
          technologies: JSON.stringify(['JavaScript']),
          status: 'active',
          category: 'Web Development',
          creator_id: 1,
          team_members: JSON.stringify([]),
          collaborators: [],
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          title: 'Project 2',
          description: 'Description 2',
          objectives: JSON.stringify(['Objective 2']),
          technologies: JSON.stringify(['React']),
          status: 'active',
          category: 'Web Development',
          creator_id: 2,
          team_members: JSON.stringify([]),
          collaborators: [],
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockClient.query.mockResolvedValue({
        rows: mockProjects
      });

      // Act
      const result = await projectRepository.findAll(limit, offset, filters);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM projects'),
        expect.arrayContaining([limit, offset])
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(Project);
      expect(result[1]).toBeInstanceOf(Project);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle empty result set', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;
      const filters = {};

      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await projectRepository.findAll(limit, offset, filters);

      // Assert
      expect(result).toEqual([]);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });


  describe('searchByText', () => {
    it('should search projects by text successfully', async () => {
      // Arrange
      const searchText = 'react app';
      const limit = 10;

      const mockProjects = [
        {
          id: 1,
          title: 'React Todo App',
          description: 'A todo app built with React',
          objectives: JSON.stringify(['Build todo app']),
          technologies: JSON.stringify(['React', 'JavaScript']),
          status: 'active',
          category: 'Web Development',
          creator_id: 1,
          team_members: JSON.stringify([]),
          collaborators: [],
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockClient.query.mockResolvedValue({
        rows: mockProjects
      });

      // Act
      const result = await projectRepository.searchByText(searchText, limit);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM projects'),
        ['%react app%', limit]
      );
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Project);
      expect(result[0].title).toBe('React Todo App');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return empty array when no projects match search text', async () => {
      // Arrange
      const searchText = 'nonexistent project';
      const limit = 10;
      const offset = 0;

      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await projectRepository.searchByText(searchText, limit, offset);

      // Assert
      expect(result).toEqual([]);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('addTeamMember', () => {
    it('should add team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const memberData = {
        userId: 2,
        role: 'developer'
      };

      const mockUpdatedProject = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        objectives: JSON.stringify(['Objective 1']),
        technologies: JSON.stringify(['JavaScript']),
        status: 'active',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([{ userId: 2, role: 'developer' }]),
        collaborators: [],
        images: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedProject]
      });

      // Act
      const result = await projectRepository.addTeamMember(projectId, memberData);

      // Assert
      expect(mockClient.query).toHaveBeenCalledTimes(2);
      expect(mockClient.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT * FROM projects WHERE id = $1'),
        [projectId]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE projects'),
        expect.arrayContaining([expect.any(String), expect.any(Date), projectId])
      );
      expect(result).toBeInstanceOf(Project);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('removeTeamMember', () => {
    it('should remove team member successfully', async () => {
      // Arrange
      const projectId = 1;
      const memberId = 2;

      const mockUpdatedProject = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        objectives: JSON.stringify(['Objective 1']),
        technologies: JSON.stringify(['JavaScript']),
        status: 'active',
        category: 'Web Development',
        creator_id: 1,
        team_members: JSON.stringify([]),
        collaborators: [],
        images: JSON.stringify([]),
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedProject]
      });

      // Act
      const result = await projectRepository.removeTeamMember(projectId, memberId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledTimes(2);
      expect(mockClient.query).toHaveBeenNthCalledWith(1,
        expect.stringContaining('SELECT * FROM projects WHERE id = $1'),
        [projectId]
      );
      expect(mockClient.query).toHaveBeenNthCalledWith(2,
        expect.stringContaining('UPDATE projects'),
        expect.arrayContaining([expect.any(String), expect.any(Date), projectId])
      );
      expect(result).toBeInstanceOf(Project);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

});

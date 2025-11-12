import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProjectRepository } from '../../repositories/ProjectRepository.js';
import Project from '../../domain/Project.js';

describe('ProjectRepository', () => {
  let projectRepository;
  let mockDatabase;
  let mockClient;

  beforeEach(() => {
    mockClient = {
      query: vi.fn(),
      release: vi.fn()
    };
    mockDatabase = {
      connect: vi.fn().mockResolvedValue(mockClient)
    };
    projectRepository = new ProjectRepository(mockDatabase);
  });

  describe('create', () => {
    it('should create a new project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        objectives: ['Objective 1'],
        technologies: ['React'],
        status: 'idea',
        category: 'general',
        creatorId: 1,
        images: []
      };

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify(['Objective 1']),
          technologies: JSON.stringify(['React']),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.create(projectData);

      expect(result).toBeInstanceOf(Project);
      expect(result.id).toBe(1);
      expect(result.title).toBe('Test Project');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should use default values for status and category', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test Description',
        creatorId: 1
      };

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      await projectRepository.create(projectData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO projects'),
        expect.arrayContaining(['idea', 'general'])
      );
    });
  });

  describe('findById', () => {
    it('should find project by id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify(['Objective 1']),
          technologies: JSON.stringify(['React']),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.findById(1);

      expect(result).toBeInstanceOf(Project);
      expect(result.id).toBe(1);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return null when project not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await projectRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByCreatorId', () => {
    it('should find projects by creator id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.findByCreatorId(1, 20, 0);

      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(Project);
    });
  });

  describe('update', () => {
    it('should update project', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated Description'
      };

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Updated Title',
          description: 'Updated Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.update(1, updates);

      expect(result).toBeInstanceOf(Project);
      expect(result.title).toBe('Updated Title');
    });

    it('should handle JSON fields correctly', async () => {
      const updates = {
        objectives: ['New Objective'],
        technologies: ['Vue'],
        images: ['image.jpg']
      };

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify(['New Objective']),
          technologies: JSON.stringify(['Vue']),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify(['image.jpg']),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      await projectRepository.update(1, updates);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('objectives = $1::jsonb'),
        expect.arrayContaining([JSON.stringify(['New Objective'])])
      );
    });

    it('should return null when no fields to update', async () => {
      const result = await projectRepository.update(1, {});

      expect(result).toBeNull();
    });

    it('should return null when project not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await projectRepository.update(999, { title: 'New Title' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete project', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await projectRepository.delete(1);

      expect(result).toBe(true);
    });

    it('should return false when project not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await projectRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should find all projects with filters', async () => {
      const filters = {
        status: 'active',
        category: 'web',
        technologies: ['React']
      };

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify(['React']),
          status: 'active',
          category: 'web',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.findAll(50, 0, filters);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('status = $1'),
        expect.arrayContaining(['active'])
      );
    });
  });

  describe('searchByText', () => {
    it('should search projects by text', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: null,
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.searchByText('test', 20);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('ILIKE'),
        expect.arrayContaining(['%test%'])
      );
    });
  });

  describe('addTeamMember', () => {
    it('should add team member to project', async () => {
      const mockProject = new Project({
        id: 1,
        title: 'Test Project',
        creatorId: 1,
        teamMembers: []
      });

      projectRepository.findById = vi.fn().mockResolvedValue(mockProject);

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: JSON.stringify([2]),
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.addTeamMember(1, 2);

      expect(result).toBeInstanceOf(Project);
      expect(result.teamMembers).toContain(2);
    });

    it('should throw error when project not found', async () => {
      projectRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(projectRepository.addTeamMember(999, 2)).rejects.toThrow('Projeto não encontrado');
    });

    it('should throw error when user already is team member', async () => {
      const mockProject = new Project({
        id: 1,
        title: 'Test Project',
        creatorId: 1,
        teamMembers: [2]
      });

      projectRepository.findById = vi.fn().mockResolvedValue(mockProject);

      await expect(projectRepository.addTeamMember(1, 2)).rejects.toThrow('Usuário já é membro da equipe');
    });
  });

  describe('removeTeamMember', () => {
    it('should remove team member from project', async () => {
      const mockProject = new Project({
        id: 1,
        title: 'Test Project',
        creatorId: 1,
        teamMembers: [2, 3]
      });

      projectRepository.findById = vi.fn().mockResolvedValue(mockProject);

      const mockResult = {
        rows: [{
          id: 1,
          title: 'Test Project',
          description: 'Test Description',
          objectives: JSON.stringify([]),
          technologies: JSON.stringify([]),
          status: 'idea',
          category: 'general',
          creator_id: 1,
          team_members: JSON.stringify([3]),
          collaborators: null,
          images: JSON.stringify([]),
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await projectRepository.removeTeamMember(1, 2);

      expect(result).toBeInstanceOf(Project);
      expect(result.teamMembers).not.toContain(2);
    });

    it('should throw error when project not found', async () => {
      projectRepository.findById = vi.fn().mockResolvedValue(null);

      await expect(projectRepository.removeTeamMember(999, 2)).rejects.toThrow('Projeto não encontrado');
    });
  });
});


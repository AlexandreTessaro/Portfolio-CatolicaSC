import { describe, it, expect } from 'vitest';
import { Project } from '../../domain/Project.js';

describe('Project Domain Model', () => {
  describe('constructor', () => {
    it('should create project with all properties', () => {
      const projectData = {
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        objectives: ['Objective 1'],
        technologies: ['React', 'Node.js'],
        status: 'development',
        category: 'web',
        creatorId: 1,
        teamMembers: [1, 2],
        collaborators: [3],
        images: ['image1.jpg'],
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };

      const project = new Project(projectData);

      expect(project.id).toBe(1);
      expect(project.title).toBe('Test Project');
      expect(project.description).toBe('Test description');
      expect(project.objectives).toEqual(['Objective 1']);
      expect(project.technologies).toEqual(['React', 'Node.js']);
      expect(project.status).toBe('development');
      expect(project.category).toBe('web');
      expect(project.creatorId).toBe(1);
    });

    it('should use default values when not provided', () => {
      const project = new Project({
        id: 1,
        title: 'Test Project',
        description: 'Test description',
        creatorId: 1
      });

      expect(project.objectives).toEqual([]);
      expect(project.technologies).toEqual([]);
      expect(project.status).toBe('idea');
      expect(project.category).toBe('general');
      expect(project.teamMembers).toEqual([]);
      expect(project.collaborators).toEqual([]);
      expect(project.images).toEqual([]);
    });
  });

  describe('validate', () => {
    it('should return empty array for valid project', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Project',
        description: 'Valid description with enough characters',
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toEqual([]);
    });

    it('should return error for short title', () => {
      const project = new Project({
        id: 1,
        title: 'Ab',
        description: 'Valid description',
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Título deve ter pelo menos 3 caracteres');
    });

    it('should return error for long title', () => {
      const project = new Project({
        id: 1,
        title: 'a'.repeat(101),
        description: 'Valid description',
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Título deve ter no máximo 100 caracteres');
    });

    it('should return error for short description', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Title',
        description: 'Short',
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Descrição deve ter pelo menos 10 caracteres');
    });

    it('should return error for long description', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Title',
        description: 'a'.repeat(2001),
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Descrição deve ter no máximo 2000 caracteres');
    });

    it('should return error for too many technologies', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Title',
        description: 'Valid description',
        technologies: Array(16).fill('Tech'),
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Máximo de 15 tecnologias permitidas');
    });

    it('should return error for too many objectives', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Title',
        description: 'Valid description',
        objectives: Array(11).fill('Objective'),
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Máximo de 10 objetivos permitidos');
    });

    it('should return error for invalid status', () => {
      const project = new Project({
        id: 1,
        title: 'Valid Title',
        description: 'Valid description',
        status: 'invalid_status',
        creatorId: 1
      });

      const errors = project.validate();

      expect(errors).toContain('Status inválido');
    });
  });

  describe('addTechnology', () => {
    it('should add technology if not exists and under limit', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        technologies: ['React'],
        creatorId: 1
      });

      project.addTechnology('Node.js');

      expect(project.technologies).toContain('Node.js');
      expect(project.technologies.length).toBe(2);
    });

    it('should not add duplicate technology', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        technologies: ['React'],
        creatorId: 1
      });

      project.addTechnology('React');

      expect(project.technologies.length).toBe(1);
    });

    it('should not add if limit reached', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        technologies: Array(15).fill('Tech'),
        creatorId: 1
      });

      project.addTechnology('New Tech');

      expect(project.technologies.length).toBe(15);
    });
  });

  describe('removeTechnology', () => {
    it('should remove technology', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        technologies: ['React', 'Node.js'],
        creatorId: 1
      });

      project.removeTechnology('React');

      expect(project.technologies).not.toContain('React');
      expect(project.technologies).toContain('Node.js');
    });
  });

  describe('addObjective', () => {
    it('should add objective if not exists and under limit', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        objectives: ['Objective 1'],
        creatorId: 1
      });

      project.addObjective('Objective 2');

      expect(project.objectives).toContain('Objective 2');
      expect(project.objectives.length).toBe(2);
    });

    it('should not add if limit reached', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        objectives: Array(10).fill('Objective'),
        creatorId: 1
      });

      project.addObjective('New Objective');

      expect(project.objectives.length).toBe(10);
    });
  });

  describe('updateStatus', () => {
    it('should update status if valid', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        status: 'idea',
        creatorId: 1
      });

      project.updateStatus('development');

      expect(project.status).toBe('development');
    });

    it('should not update status if invalid', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        status: 'idea',
        creatorId: 1
      });

      project.updateStatus('invalid_status');

      expect(project.status).toBe('idea');
    });
  });

  describe('addTeamMember', () => {
    it('should add team member if not exists', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        teamMembers: [1],
        creatorId: 1
      });

      project.addTeamMember(2);

      expect(project.teamMembers).toContain(2);
      expect(project.teamMembers.length).toBe(2);
    });

    it('should not add duplicate team member', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        teamMembers: [1],
        creatorId: 1
      });

      project.addTeamMember(1);

      expect(project.teamMembers.length).toBe(1);
    });
  });

  describe('removeTeamMember', () => {
    it('should remove team member', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        teamMembers: [1, 2],
        creatorId: 1
      });

      project.removeTeamMember(1);

      expect(project.teamMembers).not.toContain(1);
      expect(project.teamMembers).toContain(2);
    });
  });

  describe('addCollaborator', () => {
    it('should add collaborator if not exists', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        collaborators: [1],
        creatorId: 1
      });

      project.addCollaborator(2);

      expect(project.collaborators).toContain(2);
    });
  });

  describe('toPublicView', () => {
    it('should return public view with all project data', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        objectives: ['Objective 1'],
        technologies: ['React'],
        status: 'development',
        category: 'web',
        creatorId: 1,
        teamMembers: [1, 2],
        collaborators: [3],
        images: ['image.jpg']
      });

      const publicView = project.toPublicView();

      expect(publicView).toEqual({
        id: 1,
        title: 'Test',
        description: 'Test description',
        objectives: ['Objective 1'],
        technologies: ['React'],
        status: 'development',
        category: 'web',
        creatorId: 1,
        teamMembers: [1, 2],
        collaborators: [3],
        images: ['image.jpg'],
        createdAt: project.createdAt,
        updatedAt: project.updatedAt
      });
    });

    it('should handle non-array values', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'Test description',
        objectives: null,
        technologies: null,
        creatorId: 1
      });

      const publicView = project.toPublicView();

      expect(publicView.objectives).toEqual([]);
      expect(publicView.technologies).toEqual([]);
    });
  });

  describe('toSummary', () => {
    it('should return summary with truncated description', () => {
      const project = new Project({
        id: 1,
        title: 'Test',
        description: 'a'.repeat(200),
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis', 'Docker'],
        status: 'development',
        category: 'web',
        creatorId: 1
      });

      const summary = project.toSummary();

      expect(summary.description).toHaveLength(153); // 150 + '...'
      expect(summary.technologies).toHaveLength(5);
      expect(summary).toEqual({
        id: 1,
        title: 'Test',
        description: 'a'.repeat(150) + '...',
        technologies: ['React', 'Node.js', 'Express', 'MongoDB', 'Redis'],
        status: 'development',
        category: 'web',
        createdAt: project.createdAt
      });
    });
  });
});


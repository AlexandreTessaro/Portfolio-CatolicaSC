import { describe, it, expect } from 'vitest';
import Match from '../../domain/Match.js';

describe('Match Domain Model', () => {
  describe('constructor', () => {
    it('should create match with all properties', () => {
      const matchData = {
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'I would like to join this project',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        project: { id: 123, title: 'Test Project' },
        user: { id: 456, name: 'Test User' }
      };

      const match = new Match(matchData);

      expect(match.id).toBe(1);
      expect(match.projectId).toBe(123);
      expect(match.userId).toBe(456);
      expect(match.status).toBe('pending');
      expect(match.message).toBe('I would like to join this project');
      expect(match.project).toEqual({ id: 123, title: 'Test Project' });
      expect(match.user).toEqual({ id: 456, name: 'Test User' });
    });
  });

  describe('validateStatus', () => {
    it('should return true for valid status', () => {
      expect(Match.validateStatus('pending')).toBe(true);
      expect(Match.validateStatus('accepted')).toBe(true);
      expect(Match.validateStatus('rejected')).toBe(true);
      expect(Match.validateStatus('blocked')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(Match.validateStatus('invalid')).toBe(false);
      expect(Match.validateStatus('')).toBe(false);
      expect(Match.validateStatus(null)).toBe(false);
    });
  });

  describe('validateMessage', () => {
    it('should return true for valid message', () => {
      expect(Match.validateMessage('This is a valid message with enough characters')).toBe(true);
      expect(Match.validateMessage('a'.repeat(10))).toBe(true);
      expect(Match.validateMessage('a'.repeat(500))).toBe(true);
    });

    it('should return false for short message', () => {
      expect(Match.validateMessage('Short')).toBe(false);
      expect(Match.validateMessage('a'.repeat(9))).toBe(false);
    });

    it('should return false for long message', () => {
      expect(Match.validateMessage('a'.repeat(501))).toBe(false);
    });

    it('should return false for non-string message', () => {
      expect(Match.validateMessage(null)).toBe(false);
      expect(Match.validateMessage(undefined)).toBe(false);
      expect(Match.validateMessage(123)).toBe(false);
      expect(Match.validateMessage({})).toBe(false);
    });
  });

  describe('canBeAccepted', () => {
    it('should return true for pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      expect(match.canBeAccepted()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'accepted',
        message: 'Test message with enough characters'
      });

      expect(match.canBeAccepted()).toBe(false);
    });
  });

  describe('canBeRejected', () => {
    it('should return true for pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      expect(match.canBeRejected()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'rejected',
        message: 'Test message with enough characters'
      });

      expect(match.canBeRejected()).toBe(false);
    });
  });

  describe('canBeBlocked', () => {
    it('should return true for pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      expect(match.canBeBlocked()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'accepted',
        message: 'Test message with enough characters'
      });

      expect(match.canBeBlocked()).toBe(false);
    });
  });

  describe('isActive', () => {
    it('should return true for accepted status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'accepted',
        message: 'Test message with enough characters'
      });

      expect(match.isActive()).toBe(true);
    });

    it('should return false for non-accepted status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      expect(match.isActive()).toBe(false);
    });
  });

  describe('isPending', () => {
    it('should return true for pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      expect(match.isPending()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'accepted',
        message: 'Test message with enough characters'
      });

      expect(match.isPending()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize match to JSON', () => {
      const project = {
        id: 123,
        title: 'Test Project',
        description: 'Test description',
        status: 'development',
        technologies: ['React'],
        creatorId: 1
      };

      const user = {
        id: 456,
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Test bio',
        skills: ['JavaScript'],
        avatar: 'avatar.jpg'
      };

      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        project,
        user
      });

      const json = match.toJSON();

      expect(json).toEqual({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02'),
        project: {
          id: 123,
          title: 'Test Project',
          description: 'Test description',
          status: 'development',
          technologies: ['React'],
          creatorId: 1
        },
        user: {
          id: 456,
          name: 'Test User',
          email: 'test@example.com',
          bio: 'Test bio',
          skills: ['JavaScript'],
          avatar: 'avatar.jpg'
        }
      });
    });

    it('should handle null project and user', () => {
      const match = new Match({
        id: 1,
        projectId: 123,
        userId: 456,
        status: 'pending',
        message: 'Test message with enough characters'
      });

      const json = match.toJSON();

      expect(json.project).toBeNull();
      expect(json.user).toBeNull();
    });
  });

  describe('createPendingMatch', () => {
    it('should create pending match', () => {
      const match = Match.createPendingMatch(123, 456, 'Test message with enough characters');

      expect(match.projectId).toBe(123);
      expect(match.userId).toBe(456);
      expect(match.status).toBe('pending');
      expect(match.message).toBe('Test message with enough characters');
      expect(match.createdAt).toBeInstanceOf(Date);
      expect(match.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('createAcceptedMatch', () => {
    it('should create accepted match', () => {
      const match = Match.createAcceptedMatch(123, 456, 'Test message with enough characters');

      expect(match.projectId).toBe(123);
      expect(match.userId).toBe(456);
      expect(match.status).toBe('accepted');
      expect(match.message).toBe('Test message with enough characters');
      expect(match.createdAt).toBeInstanceOf(Date);
      expect(match.updatedAt).toBeInstanceOf(Date);
    });
  });
});


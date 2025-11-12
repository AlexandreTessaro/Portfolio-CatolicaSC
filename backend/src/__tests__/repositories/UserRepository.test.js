import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserRepository } from '../../repositories/UserRepository.js';
import User from '../../domain/User.js';

describe('UserRepository', () => {
  let userRepository;
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
    userRepository = new UserRepository(mockDatabase);
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript'],
        socialLinks: { github: 'https://github.com/test' },
        profileImage: 'avatar.jpg',
        consentAccepted: true,
        consentTimestamp: new Date()
      };

      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: 'Test bio',
          skills: JSON.stringify(['JavaScript']),
          social_links: JSON.stringify({ github: 'https://github.com/test' }),
          profile_image: 'avatar.jpg',
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.create(userData);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should use default values for consent', async () => {
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User'
      };

      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify([]),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      await userRepository.create(userData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([false, expect.any(Date)])
      );
    });
  });

  describe('findById', () => {
    it('should find user by id', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: 'Test bio',
          skills: JSON.stringify(['JavaScript']),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findById(1);

      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
    });

    it('should return null when user not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify([]),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findByEmail('test@example.com');

      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('test@example.com');
    });

    it('should return null when user not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    it('should update user', async () => {
      const updates = {
        name: 'Updated Name',
        bio: 'Updated bio'
      };

      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Updated Name',
          bio: 'Updated bio',
          skills: JSON.stringify([]),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.update(1, updates);

      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('Updated Name');
    });

    it('should handle JSON fields correctly', async () => {
      const updates = {
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' }
      };

      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify(['JavaScript', 'React']),
          social_links: JSON.stringify({ github: 'https://github.com/test' }),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      await userRepository.update(1, updates);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('skills = $'),
        expect.arrayContaining([JSON.stringify(['JavaScript', 'React'])])
      );
    });

    it('should return null when no fields to update', async () => {
      const result = await userRepository.update(1, {});

      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.update(999, { name: 'New Name' });

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete user', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await userRepository.delete(1);

      expect(result).toBe(true);
    });

    it('should return false when user not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userRepository.delete(999);

      expect(result).toBe(false);
    });
  });

  describe('findAll', () => {
    it('should find all users with pagination', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify([]),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findAll(50, 0);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIMIT $1 OFFSET $2'),
        [50, 0]
      );
    });
  });

  describe('findBySkills', () => {
    it('should find users by skills', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify(['JavaScript']),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findBySkills(['JavaScript'], 20);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('skills @>'),
        expect.arrayContaining([JSON.stringify(['JavaScript'])])
      );
    });
  });

  describe('findByName', () => {
    it('should find users by name', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify([]),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findByName('Test', 20, 0);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('LIKE'),
        expect.arrayContaining(['%Test%'])
      );
    });
  });

  describe('searchUsers', () => {
    it('should search users with filters', async () => {
      const filters = {
        excludeUserId: 1,
        name: 'Test',
        skills: ['JavaScript'],
        sortBy: 'name'
      };

      const mockResult = {
        rows: [{
          id: 2,
          email: 'test2@example.com',
          password: 'hashedPassword',
          name: 'Test User 2',
          bio: null,
          skills: JSON.stringify(['JavaScript']),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.searchUsers(filters, 20, 0);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('id != $1'),
        expect.arrayContaining([1])
      );
    });

    it('should handle different sort options', async () => {
      const filters = { sortBy: 'oldest' };
      const mockResult = { rows: [] };
      mockClient.query.mockResolvedValue(mockResult);

      await userRepository.searchUsers(filters, 20, 0);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('ORDER BY created_at ASC'),
        expect.any(Array)
      );
    });
  });

  describe('findRecommendedUsers', () => {
    it('should find recommended users', async () => {
      const mockResult = {
        rows: [{
          id: 1,
          email: 'test@example.com',
          password: 'hashedPassword',
          name: 'Test User',
          bio: null,
          skills: JSON.stringify(['JavaScript']),
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }]
      };

      mockClient.query.mockResolvedValue(mockResult);

      const result = await userRepository.findRecommendedUsers(4, null);

      expect(result).toHaveLength(1);
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('jsonb_array_length(skills) > 0'),
        expect.any(Array)
      );
    });

    it('should exclude user when excludeUserId provided', async () => {
      const mockResult = { rows: [] };
      mockClient.query.mockResolvedValue(mockResult);

      await userRepository.findRecommendedUsers(4, 1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('id != $1'),
        expect.arrayContaining([1])
      );
    });
  });
});


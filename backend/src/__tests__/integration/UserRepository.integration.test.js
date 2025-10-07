import { vi, describe, it, beforeEach, expect, beforeAll, afterAll } from 'vitest';
import { UserRepository } from '../../repositories/UserRepository.js';
import User from '../../domain/User.js';

// Mock do módulo database
vi.mock('../../config/database.js', () => ({
  default: {
    connect: vi.fn(),
    query: vi.fn(),
    end: vi.fn()
  }
}));

describe('UserRepository Integration Tests', () => {
  let userRepository;
  let mockPool;
  let mockClient;

  beforeAll(async () => {
    // Importar o mock após o vi.mock
    const databaseModule = await import('../../config/database.js');
    mockPool = databaseModule.default;
    
    userRepository = new UserRepository();
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
    it('should create a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' },
        profileImage: 'avatar.jpg'
      };

      const mockDbUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: JSON.stringify(['JavaScript', 'React']),
        social_links: JSON.stringify({ github: 'https://github.com/test' }),
        profile_image: 'avatar.jpg',
        is_admin: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockDbUser]
      });

      // Act
      const result = await userRepository.create(userData);

      // Assert
      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO users'),
        expect.arrayContaining([
          'test@example.com',
          'hashedPassword',
          'Test User',
          'Test bio',
          JSON.stringify(['JavaScript', 'React']),
          JSON.stringify({ github: 'https://github.com/test' }),
          'avatar.jpg',
          expect.any(Date),
          expect.any(Date)
        ])
      );
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe('test@example.com');
      expect(result.name).toBe('Test User');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle database errors during user creation', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User'
      };

      mockClient.query.mockRejectedValue(new Error('Database connection failed'));

      // Act & Assert
      await expect(userRepository.create(userData)).rejects.toThrow('Database connection failed');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find user by id successfully', async () => {
      // Arrange
      const userId = 1;
      const mockDbUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: JSON.stringify(['JavaScript', 'React']),
        social_links: JSON.stringify({ github: 'https://github.com/test' }),
        profile_image: 'avatar.jpg',
        is_admin: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockDbUser]
      });

      // Act
      const result = await userRepository.findById(userId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE id = $1'),
        [userId]
      );
      expect(result).toBeInstanceOf(User);
      expect(result.id).toBe(1);
      expect(result.email).toBe('test@example.com');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      // Arrange
      const userId = 999;
      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.findById(userId);

      // Assert
      expect(result).toBeNull();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findByEmail', () => {
    it('should find user by email successfully', async () => {
      // Arrange
      const email = 'test@example.com';
      const mockDbUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: JSON.stringify(['JavaScript', 'React']),
        social_links: JSON.stringify({}),
        profile_image: null,
        is_admin: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockDbUser]
      });

      // Act
      const result = await userRepository.findByEmail(email);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users WHERE email = $1'),
        [email]
      );
      expect(result).toBeInstanceOf(User);
      expect(result.email).toBe(email);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return null when user not found by email', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.findByEmail(email);

      // Assert
      expect(result).toBeNull();
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Updated Name',
        bio: 'Updated bio',
        skills: JSON.stringify(['JavaScript', 'React', 'Node.js']),
        social_links: JSON.stringify({}),
        profile_image: null,
        is_admin: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedUser]
      });

      // Act
      const result = await userRepository.update(userId, updateData);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE users'),
        [
          'Updated Name',
          'Updated bio',
          JSON.stringify(['JavaScript', 'React', 'Node.js']),
          expect.any(Date),
          userId
        ]
      );
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('Updated Name');
      expect(result.bio).toBe('Updated bio');
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle partial updates', async () => {
      // Arrange
      const userId = 1;
      const updateData = {
        name: 'New Name'
      };

      const mockUpdatedUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'New Name',
        bio: 'Test bio',
        skills: JSON.stringify(['JavaScript']),
        social_links: JSON.stringify({}),
        profile_image: null,
        is_admin: false,
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({
        rows: [mockUpdatedUser]
      });

      // Act
      const result = await userRepository.update(userId, updateData);

      // Assert
      expect(result).toBeInstanceOf(User);
      expect(result.name).toBe('New Name');
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 1;
      mockClient.query.mockResolvedValue({
        rows: [{ id: userId }]
      });

      // Act
      const result = await userRepository.delete(userId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('DELETE FROM users WHERE id = $1'),
        [userId]
      );
      expect(result).toBe(true);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return false when user not found for deletion', async () => {
      // Arrange
      const userId = 999;
      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.delete(userId);

      // Assert
      expect(result).toBe(false);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('searchUsers', () => {
    it('should search users by filters successfully', async () => {
      // Arrange
      const filters = {
        skills: ['JavaScript', 'React']
      };
      const limit = 10;
      const offset = 0;

      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          skills: JSON.stringify(['JavaScript', 'React']),
          bio: 'Bio 1',
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          skills: JSON.stringify(['JavaScript', 'Node.js']),
          bio: 'Bio 2',
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockClient.query.mockResolvedValue({
        rows: mockUsers
      });

      // Act
      const result = await userRepository.searchUsers(filters, limit, offset);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users'),
        expect.arrayContaining([limit, offset])
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return empty array when no users found', async () => {
      // Arrange
      const filters = {
        skills: ['NonExistentSkill']
      };
      const limit = 10;
      const offset = 0;

      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.searchUsers(filters, limit, offset);

      // Assert
      expect(result).toEqual([]);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findRecommendedUsers', () => {
    it('should find recommended users successfully', async () => {
      // Arrange
      const limit = 5;
      const excludeUserId = 1;

      const mockUsers = [
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          skills: JSON.stringify(['JavaScript', 'React']),
          bio: 'Bio 2',
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        },
        {
          id: 3,
          email: 'user3@example.com',
          name: 'User 3',
          skills: JSON.stringify(['Node.js', 'Express']),
          bio: 'Bio 3',
          social_links: JSON.stringify({}),
          profile_image: null,
          is_admin: false,
          is_verified: false,
          created_at: new Date(),
          updated_at: new Date()
        }
      ];

      mockClient.query.mockResolvedValue({
        rows: mockUsers
      });

      // Act
      const result = await userRepository.findRecommendedUsers(limit, excludeUserId);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users'),
        expect.arrayContaining([limit, excludeUserId])
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return empty array when no recommendations found', async () => {
      // Arrange
      const limit = 5;
      const excludeUserId = 1;

      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.findRecommendedUsers(limit, excludeUserId);

      // Assert
      expect(result).toEqual([]);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should find all users with pagination', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;

      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          name: 'User 1',
          skills: JSON.stringify(['JavaScript']),
          bio: 'Bio 1'
        },
        {
          id: 2,
          email: 'user2@example.com',
          name: 'User 2',
          skills: JSON.stringify(['React']),
          bio: 'Bio 2'
        }
      ];

      mockClient.query.mockResolvedValue({
        rows: mockUsers
      });

      // Act
      const result = await userRepository.findAll(limit, offset);

      // Assert
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM users'),
        [limit, offset]
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(User);
      expect(result[1]).toBeInstanceOf(User);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should handle empty result set', async () => {
      // Arrange
      const limit = 10;
      const offset = 0;

      mockClient.query.mockResolvedValue({
        rows: []
      });

      // Act
      const result = await userRepository.findAll(limit, offset);

      // Assert
      expect(result).toEqual([]);
      expect(mockClient.release).toHaveBeenCalled();
    });
  });

});

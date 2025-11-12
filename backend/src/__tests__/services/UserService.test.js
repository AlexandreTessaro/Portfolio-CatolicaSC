import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserService } from '../../services/UserService.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import { ConsentRepository } from '../../repositories/ConsentRepository.js';
import bcrypt from 'bcryptjs';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../config/jwt.js';

// Mock das dependências
vi.mock('../../repositories/UserRepository.js');
vi.mock('../../repositories/ConsentRepository.js');
vi.mock('bcryptjs');
vi.mock('../../config/jwt.js');

describe('UserService', () => {
  let userService;
  let mockUserRepository;
  let mockConsentRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instância mock do UserRepository
    mockUserRepository = {
      create: vi.fn(),
      findByEmail: vi.fn(),
      findById: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      searchUsers: vi.fn(),
      findRecommendedUsers: vi.fn(),
    };

    // Criar instância mock do ConsentRepository
    mockConsentRepository = {
      createConsent: vi.fn(),
      revokeConsent: vi.fn(),
    };
    
    // Mock do UserRepository
    vi.mocked(UserRepository).mockImplementation(() => mockUserRepository);
    vi.mocked(ConsentRepository).mockImplementation(() => mockConsentRepository);
    
    // Criar instância do UserService
    userService = new UserService();
  });

  describe('register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        email: 'test@example.com',
        password: 'password123',
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' },
        consentAccepted: true
      };

      const hashedPassword = 'hashedPassword123';
      const mockUser = {
        id: 1,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        bio: userData.bio,
        skills: userData.skills,
        socialLinks: userData.socialLinks,
        isAdmin: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        toPublicProfile: vi.fn().mockReturnValue({
          id: 1,
          email: userData.email,
        name: userData.name,
        bio: userData.bio,
        skills: userData.skills,
        socialLinks: userData.socialLinks,
        isAdmin: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
        })
      };

      // Mock do bcrypt
      vi.mocked(bcrypt.hash).mockResolvedValue(hashedPassword);
      
      // Mock do repository
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await userService.register(userData);

      // Assert
      expect(vi.mocked(bcrypt.hash)).toHaveBeenCalledWith(userData.password, 12);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword,
        consentAccepted: true,
        consentTimestamp: expect.any(Date)
      });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User',
        consentAccepted: true
      };

      // Mock do repository para simular usuário existente
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: userData.email });

      // Act & Assert
      await expect(userService.register(userData)).rejects.toThrow('Email já está em uso');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'password123';

      const mockUser = {
        id: 1,
        email: email,
        password: 'hashedPassword123',
        name: 'Test User',
        toPublicProfile: vi.fn().mockReturnValue({
          id: 1,
          email: email,
        name: 'Test User'
        })
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      // Mock do repository
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Mock do bcrypt
      vi.mocked(bcrypt.compare).mockResolvedValue(true);
      
      // Mock do jwt
      vi.mocked(generateAccessToken).mockReturnValue(mockTokens.accessToken);
      vi.mocked(generateRefreshToken).mockReturnValue(mockTokens.refreshToken);

      // Act
      const result = await userService.login(email, password);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(email);
      expect(vi.mocked(bcrypt.compare)).toHaveBeenCalledWith(password, mockUser.password);
      expect(vi.mocked(generateAccessToken)).toHaveBeenCalledWith({ userId: 1, email: email });
      expect(vi.mocked(generateRefreshToken)).toHaveBeenCalledWith({ userId: 1, email: email });
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const email = 'nonexistent@example.com';
      const password = 'password123';

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.login(email, password)).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      const email = 'test@example.com';
      const password = 'wrongpassword';

      const mockUser = {
        id: 1,
        email: email,
        password: 'hashedPassword123',
        name: 'Test User'
      };

      // Mock do repository
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Mock do bcrypt para simular senha incorreta
      vi.mocked(bcrypt.compare).mockResolvedValue(false);

      // Act & Assert
      await expect(userService.login(email, password)).rejects.toThrow('Credenciais inválidas');
    });
  });

  describe('refreshToken', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const decoded = { userId: 1, email: 'test@example.com' };
      
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        toPublicProfile: vi.fn().mockReturnValue({
          id: 1,
          email: 'test@example.com',
          name: 'Test User'
        })
      };

      const newAccessToken = 'new-access-token';

      // Mock do jwt
      vi.mocked(verifyRefreshToken).mockReturnValue(decoded);
      vi.mocked(generateAccessToken).mockReturnValue(newAccessToken);
      
      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.refreshToken(refreshToken);

      // Assert
      expect(vi.mocked(verifyRefreshToken)).toHaveBeenCalledWith(refreshToken);
      expect(mockUserRepository.findById).toHaveBeenCalledWith(decoded.userId);
      expect(vi.mocked(generateAccessToken)).toHaveBeenCalledWith({ userId: 1, email: 'test@example.com' });
      expect(result).toHaveProperty('accessToken', newAccessToken);
      expect(result).toHaveProperty('user');
    });

    it('should throw error if refresh token is invalid', async () => {
      // Arrange
      const invalidRefreshToken = 'invalid-token';

      // Mock do jwt para simular token inválido
      vi.mocked(verifyRefreshToken).mockImplementation(() => {
        throw new Error('Token inválido');
      });

      // Act & Assert
      await expect(userService.refreshToken(invalidRefreshToken)).rejects.toThrow('Erro ao renovar token');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const refreshToken = 'valid-refresh-token';
      const decoded = { userId: 999, email: 'test@example.com' };

      // Mock do jwt
      vi.mocked(verifyRefreshToken).mockReturnValue(decoded);
      
      // Mock do repository para simular usuário não encontrado
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.refreshToken(refreshToken)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('updateProfile', () => {
    it('should update profile successfully', async () => {
      // Arrange
      const userId = 1;
      const updates = {
        name: 'Updated Name',
        bio: 'Updated bio',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const mockUpdatedUser = {
        id: userId,
        name: updates.name,
        bio: updates.bio,
        skills: updates.skills,
        toPublicProfile: vi.fn().mockReturnValue({
          id: userId,
          name: updates.name,
          bio: updates.bio,
          skills: updates.skills
        })
      };

      // Mock do repository
      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);

      // Act
      const result = await userService.updateProfile(userId, updates);

      // Assert
      expect(mockUserRepository.update).toHaveBeenCalledWith(userId, updates);
      expect(result).toHaveProperty('name', updates.name);
      expect(result).toHaveProperty('bio', updates.bio);
    });

    it('should throw error if name is too short', async () => {
      // Arrange
      const userId = 1;
      const updates = { name: 'A' }; // Muito curto

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Nome deve ter pelo menos 2 caracteres');
    });

    it('should throw error if bio is too long', async () => {
      // Arrange
      const userId = 1;
      const updates = { bio: 'a'.repeat(501) }; // Muito longo

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Bio deve ter no máximo 500 caracteres');
    });

    it('should throw error if too many skills', async () => {
      // Arrange
      const userId = 1;
      const updates = { skills: Array(21).fill('Skill') }; // Muitas habilidades

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Máximo de 20 habilidades permitidas');
    });

    it('should throw error if profile image format is invalid', async () => {
      // Arrange
      const userId = 1;
      const updates = { profileImage: 'invalid-image-data' };

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Formato de imagem inválido');
    });

    it('should throw error if profile image is too large', async () => {
      // Arrange
      const userId = 1;
      const largeImage = 'data:image/jpeg;base64,' + 'a'.repeat(4 * 1024 * 1024); // 4MB
      const updates = { profileImage: largeImage };

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Imagem muito grande');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;
      const updates = { name: 'Updated Name' };

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.update.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.updateProfile(userId, updates)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('getProfile', () => {
    it('should get profile successfully', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        toPublicProfile: vi.fn().mockReturnValue({
          id: userId,
          name: 'Test User',
          email: 'test@example.com'
        })
      };

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getProfile(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('name', 'Test User');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getProfile(userId)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('getPublicProfile', () => {
    it('should get public profile successfully', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        toPublicProfile: vi.fn().mockReturnValue({
          id: userId,
          name: 'Test User',
          email: 'test@example.com'
        })
      };

      // Mock do repository
      mockUserRepository.findById.mockResolvedValue(mockUser);

      // Act
      const result = await userService.getPublicProfile(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('id', userId);
      expect(result).toHaveProperty('name', 'Test User');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.getPublicProfile(userId)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('searchUsers', () => {
    it('should search users successfully', async () => {
      // Arrange
      const filters = { skills: ['JavaScript'] };
      const limit = 10;
      const offset = 0;
      const excludeUserId = 1;

      const mockUsers = [
        {
          id: 2,
          name: 'User 2',
          skills: ['JavaScript', 'React'],
          toPublicProfile: vi.fn().mockReturnValue({
            id: 2,
            name: 'User 2',
            skills: ['JavaScript', 'React']
          })
        },
        {
          id: 3,
          name: 'User 3',
          skills: ['JavaScript', 'Node.js'],
          toPublicProfile: vi.fn().mockReturnValue({
            id: 3,
            name: 'User 3',
            skills: ['JavaScript', 'Node.js']
          })
        }
      ];

      // Mock do repository
      mockUserRepository.searchUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.searchUsers(filters, limit, offset, excludeUserId);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(
        { ...filters, excludeUserId },
        limit,
        offset
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 2);
      expect(result[1]).toHaveProperty('id', 3);
    });

    it('should search users without excludeUserId', async () => {
      // Arrange
      const filters = { skills: ['JavaScript'] };
      const limit = 10;
      const offset = 0;

      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          toPublicProfile: vi.fn().mockReturnValue({ id: 1, name: 'User 1' })
        }
      ];

      // Mock do repository
      mockUserRepository.searchUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.searchUsers(filters, limit, offset);

      // Assert
      expect(mockUserRepository.searchUsers).toHaveBeenCalledWith(filters, limit, offset);
      expect(result).toHaveLength(1);
    });

    it('should handle errors when searching users fails', async () => {
      mockUserRepository.searchUsers.mockRejectedValue(new Error('Database error'));

      await expect(userService.searchUsers({}, 10, 0)).rejects.toThrow('Erro ao buscar usuários');
    });
  });

  describe('getRecommendedUsers', () => {
    it('should get recommended users successfully', async () => {
      // Arrange
      const limit = 5;
      const excludeUserId = 1;

      const mockUsers = [
        {
          id: 2,
          name: 'Recommended User 1',
          toPublicProfile: vi.fn().mockReturnValue({
            id: 2,
            name: 'Recommended User 1'
          })
        },
        {
          id: 3,
          name: 'Recommended User 2',
          toPublicProfile: vi.fn().mockReturnValue({
            id: 3,
            name: 'Recommended User 2'
          })
        }
      ];

      // Mock do repository
      mockUserRepository.findRecommendedUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getRecommendedUsers(limit, excludeUserId);

      // Assert
      expect(mockUserRepository.findRecommendedUsers).toHaveBeenCalledWith(limit, excludeUserId);
      expect(result).toHaveLength(2);
      expect(result[0]).toHaveProperty('id', 2);
      expect(result[1]).toHaveProperty('id', 3);
    });

    it('should get recommended users without excludeUserId', async () => {
      // Arrange
      const limit = 5;

      const mockUsers = [
        {
          id: 1,
          name: 'User 1',
          toPublicProfile: vi.fn().mockReturnValue({ id: 1, name: 'User 1' })
        }
      ];

      // Mock do repository
      mockUserRepository.findRecommendedUsers.mockResolvedValue(mockUsers);

      // Act
      const result = await userService.getRecommendedUsers(limit);

      // Assert
      expect(mockUserRepository.findRecommendedUsers).toHaveBeenCalledWith(limit, null);
      expect(result).toHaveLength(1);
    });

    it('should handle errors when getting recommended users fails', async () => {
      mockUserRepository.findRecommendedUsers.mockRejectedValue(new Error('Database error'));

      await expect(userService.getRecommendedUsers(5)).rejects.toThrow('Erro ao buscar usuários recomendados');
    });
  });

  describe('deleteUser', () => {
    it('should delete user successfully', async () => {
      // Arrange
      const userId = 1;

      // Mock do repository
      mockUserRepository.delete.mockResolvedValue(true);

      // Act
      const result = await userService.deleteUser(userId);

      // Assert
      expect(mockUserRepository.delete).toHaveBeenCalledWith(userId);
      expect(result).toHaveProperty('message', 'Usuário deletado com sucesso');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.delete.mockResolvedValue(false);

      // Act & Assert
      await expect(userService.deleteUser(userId)).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('forgetMe', () => {
    it('should anonymize user data successfully', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com'
      };

      const mockUpdatedUser = {
        id: userId,
        email: `deleted_${userId}_${Date.now()}@deleted.local`,
        name: 'Usuário Excluído',
        bio: null,
        profileImage: null,
        socialLinks: {}
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockResolvedValue(mockUpdatedUser);
      mockConsentRepository.revokeConsent.mockResolvedValue(true);

      // Act
      const result = await userService.forgetMe(userId);

      // Assert
      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.update).toHaveBeenCalledWith(
        userId,
        expect.objectContaining({
          name: 'Usuário Excluído',
          bio: null,
          profileImage: null,
          socialLinks: {}
        })
      );
      expect(mockConsentRepository.revokeConsent).toHaveBeenCalledWith(userId, 'privacy_policy');
      expect(result).toHaveProperty('anonymized', true);
      expect(result).toHaveProperty('message');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const userId = 999;

      mockUserRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.forgetMe(userId)).rejects.toThrow('Usuário não encontrado');
    });

    it('should throw error if anonymization fails', async () => {
      // Arrange
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com'
      };

      mockUserRepository.findById.mockResolvedValue(mockUser);
      mockUserRepository.update.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(userService.forgetMe(userId)).rejects.toThrow('Erro ao processar direito ao esquecimento');
    });
  });
});
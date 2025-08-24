import { UserService } from '../../services/UserService.js';
import { UserRepository } from '../../repositories/UserRepository.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Mock das dependências
jest.mock('../../repositories/UserRepository.js');
jest.mock('bcryptjs');
jest.mock('jsonwebtoken');

describe('UserService', () => {
  let userService;
  let mockUserRepository;

  beforeEach(() => {
    // Limpar todos os mocks
    jest.clearAllMocks();
    
    // Criar instância mock do UserRepository
    mockUserRepository = {
      create: jest.fn(),
      findByEmail: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };
    
    // Mock do UserRepository
    UserRepository.mockImplementation(() => mockUserRepository);
    
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
        socialLinks: { github: 'https://github.com/test' }
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
        updatedAt: new Date()
      };

      // Mock do bcrypt
      bcrypt.hash.mockResolvedValue(hashedPassword);
      
      // Mock do repository
      mockUserRepository.create.mockResolvedValue(mockUser);

      // Act
      const result = await userService.register(userData);

      // Assert
      expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 10);
      expect(mockUserRepository.create).toHaveBeenCalledWith({
        ...userData,
        password: hashedPassword
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw error if user already exists', async () => {
      // Arrange
      const userData = {
        email: 'existing@example.com',
        password: 'password123',
        name: 'Test User'
      };

      // Mock do repository para simular usuário existente
      mockUserRepository.findByEmail.mockResolvedValue({ id: 1, email: userData.email });

      // Act & Assert
      await expect(userService.register(userData)).rejects.toThrow('Usuário já existe');
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(userData.email);
    });
  });

  describe('login', () => {
    it('should login user successfully with valid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        email: credentials.email,
        password: 'hashedPassword123',
        name: 'Test User'
      };

      const mockTokens = {
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      // Mock do repository
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Mock do bcrypt
      bcrypt.compare.mockResolvedValue(true);
      
      // Mock do jwt
      jwt.sign.mockReturnValueOnce(mockTokens.accessToken);
      jwt.sign.mockReturnValueOnce(mockTokens.refreshToken);

      // Act
      const result = await userService.login(credentials);

      // Assert
      expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(credentials.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(credentials.password, mockUser.password);
      expect(jwt.sign).toHaveBeenCalledTimes(2);
      expect(result).toHaveProperty('user');
      expect(result).toHaveProperty('tokens');
      expect(result.tokens).toHaveProperty('accessToken');
      expect(result.tokens).toHaveProperty('refreshToken');
    });

    it('should throw error if user not found', async () => {
      // Arrange
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123'
      };

      // Mock do repository para simular usuário não encontrado
      mockUserRepository.findByEmail.mockResolvedValue(null);

      // Act & Assert
      await expect(userService.login(credentials)).rejects.toThrow('Credenciais inválidas');
    });

    it('should throw error if password is incorrect', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      const mockUser = {
        id: 1,
        email: credentials.email,
        password: 'hashedPassword123',
        name: 'Test User'
      };

      // Mock do repository
      mockUserRepository.findByEmail.mockResolvedValue(mockUser);
      
      // Mock do bcrypt para simular senha incorreta
      bcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(userService.login(credentials)).rejects.toThrow('Credenciais inválidas');
    });
  });
});

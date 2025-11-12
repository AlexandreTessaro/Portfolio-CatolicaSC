import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { UserController } from '../../controllers/UserController.js';

// Mock simples do UserService
const mockUserService = {
  register: vi.fn(),
  login: vi.fn(),
  refreshToken: vi.fn(),
  getProfile: vi.fn(),
  updateProfile: vi.fn(),
  searchUsers: vi.fn(),
  getPublicProfile: vi.fn(),
};

// Mock do middleware de autenticação
const mockAuth = vi.fn((req, res, next) => {
  req.user = { userId: 1, email: 'test@example.com' };
  next();
});

describe('UserController - Basic Tests', () => {
  let app;
  let userController;

  beforeEach(() => {
    vi.clearAllMocks();
    
    // Criar instância do controller e substituir o serviço
    userController = new UserController();
    userController.userService = mockUserService;
    
    app = express();
    app.use(express.json());
    
    // Rotas básicas
    app.post('/register', userController.validateRegister(), userController.register);
    app.post('/login', userController.validateLogin(), userController.login);
    app.post('/refresh-token', userController.refreshToken);
    app.get('/profile', mockAuth, userController.getProfile);
    app.put('/profile', mockAuth, userController.validateUpdateProfile(), userController.updateProfile);
    app.get('/search', userController.searchUsers);
    app.get('/public/:userId', userController.getPublicProfile);
  });

  describe('POST /register', () => {
    it('should register a user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        bio: 'Test bio',
        skills: ['JavaScript', 'React']
      };

      const mockUser = {
        id: 1,
        ...userData,
        isAdmin: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        toPublicProfile: () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          bio: 'Test bio',
          skills: ['JavaScript', 'React']
        })
      };

      mockUserService.register.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });

      // Act
      const response = await request(app)
        .post('/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(mockUserService.register).toHaveBeenCalled();
      const callArgs = mockUserService.register.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        bio: userData.bio,
        skills: userData.skills
      });
      expect(callArgs.ipAddress).toBeDefined();
      expect(typeof callArgs.ipAddress).toBe('string');
    });

    it('should return 400 for invalid data', async () => {
      // Act
      const response = await request(app)
        .post('/register')
        .send({});

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockUserService.register).not.toHaveBeenCalled();
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        toPublicProfile: () => ({
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        })
      };

      mockUserService.login.mockResolvedValue({
        user: mockUser,
        accessToken: 'access-token',
        refreshToken: 'refresh-token'
      });

      // Act
      const response = await request(app)
        .post('/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(mockUserService.login).toHaveBeenCalledWith('test@example.com', 'password123');
    });
  });

  describe('GET /profile', () => {
    it('should get user profile successfully', async () => {
      // Arrange
      const mockProfile = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        bio: 'Test bio',
        skills: ['JavaScript', 'React']
      };

      mockUserService.getProfile.mockResolvedValue(mockProfile);

      // Act
      const response = await request(app)
        .get('/profile');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProfile);
      expect(mockUserService.getProfile).toHaveBeenCalledWith(1);
    });
  });

  describe('GET /search', () => {
    it('should search users successfully', async () => {
      // Arrange
      const mockUsers = [
        {
          id: 1,
          name: 'Test User',
          email: 'test@example.com',
          skills: ['JavaScript', 'React']
        }
      ];

      mockUserService.searchUsers.mockResolvedValue(mockUsers);

      // Act
      const response = await request(app)
        .get('/search')
        .query({ q: 'javascript', skills: 'React,Node.js' });

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockUsers);
      expect(mockUserService.searchUsers).toHaveBeenCalled();
    });
  });
});

import request from 'supertest';
import express from 'express';
import cookieParser from 'cookie-parser';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { UserController } from '../../controllers/UserController.js';
import { UserService } from '../../services/UserService.js';
import { authenticateToken } from '../../middleware/auth.js';

// Mock das dependências
vi.mock('../../services/UserService.js');
vi.mock('../../middleware/auth.js');

describe('UserController', () => {
  let app;
  let userController;
  let mockUserService;
  let mockAuthenticateToken;

  beforeEach(() => {
    // Limpar todos os mocks
    vi.clearAllMocks();
    
    // Criar instância mock do UserService
    mockUserService = {
      register: vi.fn(),
      login: vi.fn(),
      refreshToken: vi.fn(),
      logout: vi.fn(),
      getProfile: vi.fn(),
      updateProfile: vi.fn(),
      deleteProfile: vi.fn(),
      searchUsers: vi.fn(),
      getRecommendedUsers: vi.fn(),
      getPublicProfile: vi.fn(),
    };
    
    // Mock do middleware de autenticação
    mockAuthenticateToken = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    vi.mocked(authenticateToken).mockImplementation(mockAuthenticateToken);
    
    // Criar instância do controller e substituir o serviço
    userController = new UserController();
    userController.userService = mockUserService;
    
    // Configurar app Express para testes
    app = express();
    app.use(express.json());
    app.use(cookieParser());
    
    // Rotas de teste
    app.post('/register', userController.validateRegister(), userController.register);
    app.post('/login', userController.validateLogin(), userController.login);
    app.post('/refresh-token', userController.refreshToken);
    app.post('/logout', authenticateToken, userController.logout);
    app.get('/profile', authenticateToken, userController.getProfile);
    app.put('/profile', authenticateToken, userController.validateUpdateProfile(), userController.updateProfile);
    app.get('/search', userController.searchUsers);
    app.get('/recommended', authenticateToken, userController.getRecommendedUsers);
    app.get('/public/:userId', userController.getPublicProfile);
  });

  describe('POST /register', () => {
    it('should register a new user successfully', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        bio: 'Test bio',
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' }
      };

      const mockUser = {
        id: 1,
        ...userData,
        isAdmin: false,
        isVerified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockUserService.register.mockResolvedValue(mockUser);

      // Act
      const response = await request(app)
        .post('/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('name', userData.name);
      expect(response.body.data).toHaveProperty('email', userData.email);
      expect(mockUserService.register).toHaveBeenCalled();
      const callArgs = mockUserService.register.mock.calls[0][0];
      expect(callArgs).toMatchObject({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        bio: userData.bio,
        skills: userData.skills,
        socialLinks: userData.socialLinks
      });
      expect(callArgs.ipAddress).toBeDefined();
      expect(typeof callArgs.ipAddress).toBe('string');
    });

    it('should return 400 for invalid registration data', async () => {
      // Arrange
      const invalidData = {
        name: '', // Nome vazio
        email: 'invalid-email', // Email inválido
        password: '123' // Senha muito curta
      };

      // Act
      const response = await request(app)
        .post('/register')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('errors');
      expect(mockUserService.register).not.toHaveBeenCalled();
    });

    it('should return 409 if user already exists', async () => {
      // Arrange
      const userData = {
        name: 'Test User',
        email: 'existing@example.com',
        password: 'password123'
      };

      mockUserService.register.mockRejectedValue(new Error('Usuário já existe'));

      // Act
      const response = await request(app)
        .post('/register')
        .send(userData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Usuário já existe');
    });
  });

  describe('POST /login', () => {
    it('should login user successfully', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'password123'
      };

      const mockResult = {
        user: {
          id: 1,
          name: 'Test User',
          email: 'test@example.com'
        },
        accessToken: 'access-token-123',
        refreshToken: 'refresh-token-123'
      };

      mockUserService.login.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(mockUserService.login).toHaveBeenCalledWith(credentials.email, credentials.password);
    });

    it('should return 401 for invalid credentials', async () => {
      // Arrange
      const credentials = {
        email: 'test@example.com',
        password: 'wrongpassword'
      };

      mockUserService.login.mockRejectedValue(new Error('Credenciais inválidas'));

      // Act
      const response = await request(app)
        .post('/login')
        .send(credentials);

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Credenciais inválidas');
    });

    it('should return 400 for invalid login data', async () => {
      // Arrange
      const invalidData = {
        email: 'invalid-email',
        password: '' // Senha vazia
      };

      // Act
      const response = await request(app)
        .post('/login')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockUserService.login).not.toHaveBeenCalled();
    });
  });

  describe('POST /refresh-token', () => {
    it('should refresh token successfully', async () => {
      // Arrange
      const refreshData = {
        refreshToken: 'valid-refresh-token'
      };

      const mockResult = {
        accessToken: 'new-access-token',
        refreshToken: 'new-refresh-token'
      };

      mockUserService.refreshToken.mockResolvedValue(mockResult);

      // Act
      const response = await request(app)
        .post('/refresh-token')
        .set('Cookie', 'refreshToken=valid-refresh-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('accessToken');
      expect(response.body.data).toHaveProperty('refreshToken');
      expect(mockUserService.refreshToken).toHaveBeenCalledWith(refreshData.refreshToken);
    });

    it('should return 401 for invalid refresh token', async () => {
      // Arrange
      const refreshData = {
        refreshToken: 'invalid-refresh-token'
      };

      mockUserService.refreshToken.mockRejectedValue(new Error('Token inválido'));

      // Act
      const response = await request(app)
        .post('/refresh-token')
        .set('Cookie', 'refreshToken=invalid-refresh-token');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Token inválido');
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
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' }
      };

      mockUserService.getProfile.mockResolvedValue(mockProfile);

      // Act
      const response = await request(app)
        .get('/profile')
        .set('Authorization', 'Bearer valid-token');

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockProfile);
      expect(mockUserService.getProfile).toHaveBeenCalledWith(1);
    });

    it('should return 401 if not authenticated', async () => {
      // Arrange
      vi.mocked(authenticateToken).mockImplementationOnce((req, res, next) => {
        res.status(401).json({ success: false, message: 'Token inválido' });
      });

      // Act
      const response = await request(app)
        .get('/profile');

      // Assert
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('success', false);
      expect(mockUserService.getProfile).not.toHaveBeenCalled();
    });
  });

  describe('PUT /profile', () => {
    it('should update user profile successfully', async () => {
      // Arrange
      const updateData = {
        name: 'Updated Name',
        bio: 'Updated bio',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      const mockUpdatedProfile = {
        id: 1,
        name: 'Updated Name',
        email: 'test@example.com',
        bio: 'Updated bio',
        skills: ['JavaScript', 'React', 'Node.js']
      };

      mockUserService.updateProfile.mockResolvedValue(mockUpdatedProfile);

      // Act
      const response = await request(app)
        .put('/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(updateData);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockUpdatedProfile);
      expect(mockUserService.updateProfile).toHaveBeenCalledWith(1, updateData);
    });

    it('should return 400 for invalid update data', async () => {
      // Arrange
      const invalidData = {
        name: '', // Nome vazio
        email: 'invalid-email' // Email inválido
      };

      // Act
      const response = await request(app)
        .put('/profile')
        .set('Authorization', 'Bearer valid-token')
        .send(invalidData);

      // Assert
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(mockUserService.updateProfile).not.toHaveBeenCalled();
    });
  });

  describe('GET /search', () => {
    it('should search users successfully', async () => {
      // Arrange
      const searchParams = {
        q: 'javascript',
        skills: 'React,Node.js',
        limit: 10,
        offset: 0
      };

      const mockUsers = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          skills: ['JavaScript', 'React']
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane@example.com',
          skills: ['JavaScript', 'Node.js']
        }
      ];

      mockUserService.searchUsers.mockResolvedValue(mockUsers);

      // Act
      const response = await request(app)
        .get('/search')
        .query(searchParams);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockUsers);
      expect(mockUserService.searchUsers).toHaveBeenCalledWith(
        { skills: ['React', 'Node.js'] },
        10,
        0,
        null
      );
    });

    it('should return empty array when no users found', async () => {
      // Arrange
      const searchParams = {
        q: 'nonexistent',
        limit: 10,
        offset: 0
      };

      mockUserService.searchUsers.mockResolvedValue([]);

      // Act
      const response = await request(app)
        .get('/search')
        .query(searchParams);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual([]);
    });
  });

  describe('GET /public/:userId', () => {
    it('should get public profile successfully', async () => {
      // Arrange
      const userId = 1;
      const mockPublicProfile = {
        id: 1,
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' },
        isVerified: true
      };

      mockUserService.getPublicProfile.mockResolvedValue(mockPublicProfile);

      // Act
      const response = await request(app)
        .get(`/public/${userId}`);

      // Assert
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toEqual(mockPublicProfile);
      expect(mockUserService.getPublicProfile).toHaveBeenCalledWith(userId.toString());
    });

    it('should return 404 if user not found', async () => {
      // Arrange
      const userId = 999;

      mockUserService.getPublicProfile.mockRejectedValue(new Error('Usuário não encontrado'));

      // Act
      const response = await request(app)
        .get(`/public/${userId}`);

      // Assert
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Usuário não encontrado');
    });
  });
});

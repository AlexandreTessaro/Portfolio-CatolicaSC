import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock axios usando vi.hoisted para evitar problemas de hoisting
const { mockApiClient } = vi.hoisted(() => {
  const mockApiClient = {
    interceptors: {
      request: {
        use: vi.fn()
      },
      response: {
        use: vi.fn()
      }
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  };
  
  return { mockApiClient };
});

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockApiClient),
    post: vi.fn()
  }
}));

vi.mock('../../config/api.js', () => ({
  API_CONFIG: {
    baseURL: 'http://localhost:5000/api',
    timeout: 10000,
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json',
    },
  },
  API_ENDPOINTS: {
    USERS: {
      REGISTER: '/api/users/register',
      LOGIN: '/api/users/login',
      PROFILE: '/api/users/profile',
    },
    PROJECTS: {
      CREATE: '/api/projects',
      LIST: '/api/projects',
    },
    MATCHES: {
      CREATE: '/api/matches',
      RECEIVED: '/api/matches/received',
    },
  },
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      getAccessToken: vi.fn(() => 'mock-token')
    }))
  }
}));

// Importar após mockar
import { apiService, userService, projectService, matchService } from '../../services/apiService';

describe('apiService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('userService', () => {
    it('should register user', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123'
      };

      mockApiClient.post.mockResolvedValue({ data: { success: true } });

      const result = await userService.register(userData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/users/register', userData);
      expect(result.success).toBe(true);
    });

    it('should login user', async () => {
      const loginData = {
        email: 'test@example.com',
        password: 'password123'
      };

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: {
            accessToken: 'token',
            refreshToken: 'refresh'
          }
        }
      });

      const result = await userService.login(loginData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/users/login', loginData);
      expect(result.success).toBe(true);
    });

    it('should get user profile', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          success: true,
          data: { id: 1, name: 'Test User' }
        }
      });

      const result = await userService.getProfile();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/users/profile');
      expect(result.success).toBe(true);
    });
  });

  describe('projectService', () => {
    it('should create project', async () => {
      const projectData = {
        title: 'Test Project',
        description: 'Test description'
      };

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: { id: 1, ...projectData }
        }
      });

      const result = await projectService.createProject(projectData);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/projects', projectData);
      expect(result.success).toBe(true);
    });

    it('should get projects', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          success: true,
          data: []
        }
      });

      const result = await projectService.getProjects();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/projects?');
      expect(result.success).toBe(true);
    });
  });

  describe('matchService', () => {
    it('should create match', async () => {
      const projectId = 1;
      const message = 'Test message';

      mockApiClient.post.mockResolvedValue({
        data: {
          success: true,
          data: { id: 1, projectId, message }
        }
      });

      const result = await matchService.createMatch(projectId, message);

      expect(mockApiClient.post).toHaveBeenCalledWith('/api/matches', { projectId, message });
      expect(result.success).toBe(true);
    });

    it('should get received matches', async () => {
      mockApiClient.get.mockResolvedValue({
        data: {
          success: true,
          data: []
        }
      });

      const result = await matchService.getReceivedMatches();

      expect(mockApiClient.get).toHaveBeenCalledWith('/api/matches/received');
      expect(result.success).toBe(true);
    });
  });
});


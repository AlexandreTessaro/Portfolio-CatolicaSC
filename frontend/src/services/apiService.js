import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.js';

// Criar instância do axios com configurações padrão
const apiClient = axios.create(API_CONFIG);

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para renovar token automaticamente
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (refreshToken) {
          const response = await axios.post(API_ENDPOINTS.USERS.REFRESH_TOKEN, {
            refreshToken
          });

          const { accessToken } = response.data.data;
          localStorage.setItem('accessToken', accessToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Se falhar ao renovar, redirecionar para login
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

// Serviços de usuário
export const userService = {
  async register(userData) {
    const response = await apiClient.post(API_ENDPOINTS.USERS.REGISTER, userData);
    return response.data;
  },

  async login(credentials) {
    const response = await apiClient.post(API_ENDPOINTS.USERS.LOGIN, credentials);
    return response.data;
  },

  async logout() {
    const response = await apiClient.post(API_ENDPOINTS.USERS.LOGOUT);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get(API_ENDPOINTS.USERS.PROFILE);
    return response.data;
  },

  async updateProfile(updates) {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE_PROFILE, updates);
    return response.data;
  },

  async getPublicProfile(userId) {
    const response = await apiClient.get(API_ENDPOINTS.USERS.PUBLIC_PROFILE(userId));
    return response.data;
  },

  async searchUsers(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const response = await apiClient.get(`${API_ENDPOINTS.USERS.SEARCH}?${params}`);
    return response.data;
  }
};

// Serviços de projeto
export const projectService = {
  async createProject(projectData) {
    const response = await apiClient.post(API_ENDPOINTS.PROJECTS.CREATE, projectData);
    return response.data;
  },

  async getProjects(filters = {}) {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    });
    
    const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.LIST}?${params}`);
    return response.data;
  },

  async getProject(projectId) {
    const response = await apiClient.get(API_ENDPOINTS.PROJECTS.GET(projectId));
    return response.data;
  },

  async updateProject(projectId, updates) {
    const response = await apiClient.put(API_ENDPOINTS.PROJECTS.UPDATE(projectId), updates);
    return response.data;
  },

  async deleteProject(projectId) {
    const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.DELETE(projectId));
    return response.data;
  },

  async searchProjects(searchTerm, limit = 20) {
    const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.SEARCH}?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);
    return response.data;
  },

  async getUserProjects(userId, limit = 20, offset = 0) {
    const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.USER_PROJECTS(userId)}?limit=${limit}&offset=${offset}`);
    return response.data;
  },

  async getRecommendedProjects(limit = 10) {
    const response = await apiClient.get(`${API_ENDPOINTS.PROJECTS.RECOMMENDED}?limit=${limit}`);
    return response.data;
  },

  async addTeamMember(projectId, memberId) {
    const response = await apiClient.post(API_ENDPOINTS.PROJECTS.ADD_TEAM_MEMBER(projectId), { memberId });
    return response.data;
  },

  async removeTeamMember(projectId, memberId) {
    const response = await apiClient.delete(API_ENDPOINTS.PROJECTS.REMOVE_TEAM_MEMBER(projectId, memberId));
    return response.data;
  }
};

// Serviço de health check
export const healthService = {
  async checkHealth() {
    const response = await axios.get(API_ENDPOINTS.HEALTH);
    return response.data;
  }
};

export default {
  userService,
  projectService,
  healthService
};

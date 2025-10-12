import axios from 'axios';
import { API_ENDPOINTS, API_CONFIG } from '../config/api.js';
import { useAuthStore } from '../stores/authStore.js';

// Criar instância do axios com configurações padrão
const apiClient = axios.create(API_CONFIG);

// Interceptor para adicionar token de autenticação
apiClient.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore.getState();
    const token = authStore.getAccessToken();
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
        const authStore = useAuthStore.getState();
        const refreshToken = authStore.getRefreshToken();
        
        if (refreshToken) {
          const response = await axios.post(API_ENDPOINTS.USERS.REFRESH_TOKEN, {}, {
            withCredentials: true
          });

          const { accessToken } = response.data.data;
          authStore.setTokens(accessToken, refreshToken);

          originalRequest.headers.Authorization = `Bearer ${accessToken}`;
          return apiClient(originalRequest);
        }
      } catch (_refreshError) { // eslint-disable-line no-unused-vars
        // Se falhar ao renovar, fazer logout
        const authStore = useAuthStore.getState();
        authStore.logout();
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
    const authStore = useAuthStore.getState();
    authStore.logout();
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
  },

  async getRecommendedUsers(limit = 4) {
    const response = await apiClient.get(`${API_ENDPOINTS.USERS.RECOMMENDED}?limit=${limit}`);
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

// Serviços de matchmaking
export const matchService = {
  async createMatch(projectId, message) {
    const response = await apiClient.post(API_ENDPOINTS.MATCHES.CREATE, {
      projectId,
      message
    });
    return response.data;
  },

  async getReceivedMatches(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`${API_ENDPOINTS.MATCHES.RECEIVED}${params}`);
    return response.data;
  },

  async getSentMatches(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`${API_ENDPOINTS.MATCHES.SENT}${params}`);
    return response.data;
  },

  async acceptMatch(matchId) {
    const response = await apiClient.patch(API_ENDPOINTS.MATCHES.ACCEPT(matchId));
    return response.data;
  },

  async rejectMatch(matchId) {
    const response = await apiClient.patch(API_ENDPOINTS.MATCHES.REJECT(matchId));
    return response.data;
  },

  async blockMatch(matchId) {
    const response = await apiClient.patch(API_ENDPOINTS.MATCHES.BLOCK(matchId));
    return response.data;
  },

  async cancelMatch(matchId) {
    const response = await apiClient.delete(API_ENDPOINTS.MATCHES.CANCEL(matchId));
    return response.data;
  },

  async getMatchById(matchId) {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.GET(matchId));
    return response.data;
  },

  async getMatchStats() {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.STATS);
    return response.data;
  },

  async canRequestParticipation(projectId) {
    const response = await apiClient.get(API_ENDPOINTS.MATCHES.CAN_REQUEST(projectId));
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

// Serviço de recomendações
export const recommendationService = {
  async getProjectsWithScores(filters = {}) {
    const params = new URLSearchParams();
    if (filters.limit) params.append('limit', filters.limit);
    if (filters.offset) params.append('offset', filters.offset);
    if (filters.status) params.append('status', filters.status);
    if (filters.category) params.append('category', filters.category);
    if (filters.technologies) params.append('technologies', filters.technologies);

    const response = await apiClient.get(`${API_ENDPOINTS.RECOMMENDATIONS.PROJECTS}?${params}`);
    return response.data;
  },

  async getRecommendationScore(projectId) {
    const response = await apiClient.get(API_ENDPOINTS.RECOMMENDATIONS.SCORE(projectId));
    return response.data;
  },

  async getMultipleScores(projectIds) {
    const response = await apiClient.post(API_ENDPOINTS.RECOMMENDATIONS.SCORES, { projectIds });
    return response.data;
  }
};

// Serviço de conexões entre usuários
export const userConnectionService = {
  async createConnection(receiverId, message = null) {
    const response = await apiClient.post(API_ENDPOINTS.USER_CONNECTIONS.CREATE, {
      receiverId,
      message
    });
    return response.data;
  },

  async getReceivedConnections(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`${API_ENDPOINTS.USER_CONNECTIONS.RECEIVED}${params}`);
    return response.data;
  },

  async getSentConnections(status = null) {
    const params = status ? `?status=${status}` : '';
    const response = await apiClient.get(`${API_ENDPOINTS.USER_CONNECTIONS.SENT}${params}`);
    return response.data;
  },

  async getAcceptedConnections() {
    const response = await apiClient.get(API_ENDPOINTS.USER_CONNECTIONS.ACCEPTED);
    return response.data;
  },

  async getConnectionStats() {
    const response = await apiClient.get(API_ENDPOINTS.USER_CONNECTIONS.STATS);
    return response.data;
  },

  async getConnectionStatus(userId) {
    const response = await apiClient.get(API_ENDPOINTS.USER_CONNECTIONS.STATUS(userId));
    return response.data;
  },

  async acceptConnection(connectionId) {
    const response = await apiClient.put(API_ENDPOINTS.USER_CONNECTIONS.ACCEPT(connectionId));
    return response.data;
  },

  async rejectConnection(connectionId) {
    const response = await apiClient.put(API_ENDPOINTS.USER_CONNECTIONS.REJECT(connectionId));
    return response.data;
  },

  async blockConnection(connectionId) {
    const response = await apiClient.put(API_ENDPOINTS.USER_CONNECTIONS.BLOCK(connectionId));
    return response.data;
  },

  async deleteConnection(connectionId) {
    const response = await apiClient.delete(API_ENDPOINTS.USER_CONNECTIONS.DELETE(connectionId));
    return response.data;
  }
};

export default {
  userService,
  projectService,
  matchService,
  recommendationService,
  userConnectionService,
  healthService
};

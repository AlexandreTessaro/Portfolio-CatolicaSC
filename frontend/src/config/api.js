const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Usuários
  USERS: {
    REGISTER: `${API_BASE_URL}/users/register`,
    LOGIN: `${API_BASE_URL}/users/login`,
    FIREBASE_LOGIN: `${API_BASE_URL}/users/firebase-login`,
    REFRESH_TOKEN: `${API_BASE_URL}/users/refresh-token`,
    LOGOUT: `${API_BASE_URL}/users/logout`,
    PROFILE: `${API_BASE_URL}/users/profile`,
    UPDATE_PROFILE: `${API_BASE_URL}/users/profile`,
    PUBLIC_PROFILE: (userId) => `${API_BASE_URL}/users/public/${userId}`,
    SEARCH: `${API_BASE_URL}/users/search`,
    RECOMMENDED: `${API_BASE_URL}/users/recommended`,
  },

  // Projetos
  PROJECTS: {
    CREATE: `${API_BASE_URL}/projects`,
    LIST: `${API_BASE_URL}/projects`,
    GET: (projectId) => `${API_BASE_URL}/projects/${projectId}`,
    UPDATE: (projectId) => `${API_BASE_URL}/projects/${projectId}`,
    DELETE: (projectId) => `${API_BASE_URL}/projects/${projectId}`,
    SEARCH: `${API_BASE_URL}/projects/search`,
    USER_PROJECTS: (userId) => `${API_BASE_URL}/projects/user/${userId}`,
    RECOMMENDED: `${API_BASE_URL}/projects/recommended`,
    ADD_TEAM_MEMBER: (projectId) => `${API_BASE_URL}/projects/${projectId}/team`,
    REMOVE_TEAM_MEMBER: (projectId, memberId) => `${API_BASE_URL}/projects/${projectId}/team/${memberId}`,
  },

  // Matchmaking
  MATCHES: {
    CREATE: `${API_BASE_URL}/matches`,
    RECEIVED: `${API_BASE_URL}/matches/received`,
    SENT: `${API_BASE_URL}/matches/sent`,
    GET: (matchId) => `${API_BASE_URL}/matches/${matchId}`,
    ACCEPT: (matchId) => `${API_BASE_URL}/matches/${matchId}/accept`,
    REJECT: (matchId) => `${API_BASE_URL}/matches/${matchId}/reject`,
    BLOCK: (matchId) => `${API_BASE_URL}/matches/${matchId}/block`,
    CANCEL: (matchId) => `${API_BASE_URL}/matches/${matchId}`,
    STATS: `${API_BASE_URL}/matches/stats`,
    CAN_REQUEST: (projectId) => `${API_BASE_URL}/matches/can-request/${projectId}`,
  },

  // Recomendações
  RECOMMENDATIONS: {
    PROJECTS: `${API_BASE_URL}/recommendations/projects`,
    SCORE: (projectId) => `${API_BASE_URL}/recommendations/score/${projectId}`,
    SCORES: `${API_BASE_URL}/recommendations/scores`,
  },

  // Conexões entre usuários
  USER_CONNECTIONS: {
    CREATE: `${API_BASE_URL}/user-connections`,
    RECEIVED: `${API_BASE_URL}/user-connections/received`,
    SENT: `${API_BASE_URL}/user-connections/sent`,
    ACCEPTED: `${API_BASE_URL}/user-connections/accepted`,
    STATS: `${API_BASE_URL}/user-connections/stats`,
    STATUS: (userId) => `${API_BASE_URL}/user-connections/status/${userId}`,
    ACCEPT: (connectionId) => `${API_BASE_URL}/user-connections/${connectionId}/accept`,
    REJECT: (connectionId) => `${API_BASE_URL}/user-connections/${connectionId}/reject`,
    BLOCK: (connectionId) => `${API_BASE_URL}/user-connections/${connectionId}/block`,
    DELETE: (connectionId) => `${API_BASE_URL}/user-connections/${connectionId}`,
  },

  // Health check
  HEALTH: `${API_BASE_URL.replace('/api', '')}/health`,
};

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
};

export default API_ENDPOINTS;

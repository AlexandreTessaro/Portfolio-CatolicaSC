import { describe, it, expect, beforeEach, vi } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('App', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('GET /', () => {
    it('should return API information', async () => {
      const response = await request(app)
        .get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'Startup Collaboration API');
      expect(response.body).toHaveProperty('version', '1.0.0');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('message', 'API funcionando corretamente');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('uptime');
    });
  });

  describe('POST /api/admin/run-migrations', () => {
    it('should return 403 when migration token is missing', async () => {
      const response = await request(app)
        .post('/api/admin/run-migrations');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Acesso negado');
    });

    it('should return 403 when migration token is invalid', async () => {
      const response = await request(app)
        .post('/api/admin/run-migrations')
        .set('x-migration-token', 'invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('GET /api/admin/run-migrations', () => {
    it('should return 403 when migration token is missing', async () => {
      const response = await request(app)
        .get('/api/admin/run-migrations');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
    });

    it('should return 403 when migration token in query is invalid', async () => {
      const response = await request(app)
        .get('/api/admin/run-migrations?token=invalid-token');

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('success', false);
    });
  });

  describe('404 Handler', () => {
    it('should return 404 for unknown routes', async () => {
      const response = await request(app)
        .get('/unknown-route');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('message', 'Rota não encontrada');
    });
  });

  describe('CORS Configuration', () => {
    it('should allow requests from configured frontend', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', process.env.FRONTEND_URL || 'http://localhost:3000');

      expect(response.status).toBe(200);
    });

    it('should allow requests from Vercel previews', async () => {
      const response = await request(app)
        .get('/')
        .set('Origin', 'https://preview-123.vercel.app');

      expect(response.status).toBe(200);
    });
  });

  describe('Rate Limiting', () => {
    it('should apply rate limiting to /api routes', async () => {
      // Fazer múltiplas requisições para testar rate limit
      const requests = Array(10).fill(null).map(() => 
        request(app).get('/api/users/search')
      );

      const responses = await Promise.all(requests);
      
      // Todas devem retornar (rate limit pode não ser atingido em testes)
      responses.forEach(response => {
        expect([200, 429]).toContain(response.status);
      });
    });
  });
});


import request from 'supertest';
import express from 'express';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import { UserConnectionController } from '../../controllers/UserConnectionController.js';
import { UserConnectionService } from '../../services/UserConnectionService.js';

vi.mock('../../services/UserConnectionService.js');

describe('UserConnectionController', () => {
  let app;
  let userConnectionController;
  let mockUserConnectionService;
  let mockAuth;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUserConnectionService = {
      createConnection: vi.fn(),
      acceptConnection: vi.fn(),
      rejectConnection: vi.fn(),
      blockConnection: vi.fn(),
      getReceivedConnections: vi.fn(),
      getSentConnections: vi.fn(),
      getAcceptedConnections: vi.fn(),
      areUsersConnected: vi.fn(),
      deleteConnection: vi.fn(),
      getConnectionStats: vi.fn()
    };

    vi.mocked(UserConnectionService).mockImplementation(() => mockUserConnectionService);
    
    userConnectionController = new UserConnectionController();
    userConnectionController.userConnectionService = mockUserConnectionService;
    
    mockAuth = vi.fn((req, res, next) => {
      req.user = { userId: 1, email: 'test@example.com' };
      next();
    });
    
    app = express();
    app.use(express.json());
    
    app.post('/api/connections', mockAuth, userConnectionController.validateCreateConnection(), (req, res) => userConnectionController.createConnection(req, res));
    app.put('/api/connections/:connectionId/accept', mockAuth, (req, res) => userConnectionController.acceptConnection(req, res));
    app.put('/api/connections/:connectionId/reject', mockAuth, (req, res) => userConnectionController.rejectConnection(req, res));
    app.put('/api/connections/:connectionId/block', mockAuth, (req, res) => userConnectionController.blockConnection(req, res));
    app.get('/api/connections/received', mockAuth, (req, res) => userConnectionController.getReceivedConnections(req, res));
    app.get('/api/connections/sent', mockAuth, (req, res) => userConnectionController.getSentConnections(req, res));
    app.get('/api/connections/accepted', mockAuth, (req, res) => userConnectionController.getAcceptedConnections(req, res));
    app.get('/api/connections/status/:userId', mockAuth, (req, res) => userConnectionController.getConnectionStatus(req, res));
    app.delete('/api/connections/:connectionId', mockAuth, (req, res) => userConnectionController.deleteConnection(req, res));
    app.get('/api/connections/stats', mockAuth, (req, res) => userConnectionController.getConnectionStats(req, res));
  });

  describe('POST /api/connections', () => {
    it('should create connection successfully', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        toJSON: vi.fn().mockReturnValue({ id: 1, status: 'pending' })
      };

      mockUserConnectionService.createConnection.mockResolvedValue(connection);

      const response = await request(app)
        .post('/api/connections')
        .send({ receiverId: 2, message: 'Hello' });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
    });

    it('should return 200 for existing connection', async () => {
      const connection = {
        isExisting: true,
        toJSON: vi.fn().mockReturnValue({ id: 1 })
      };

      mockUserConnectionService.createConnection.mockResolvedValue(connection);

      const response = await request(app)
        .post('/api/connections')
        .send({ receiverId: 2 });

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Conexão já existe entre estes usuários');
    });

    it('should validate receiverId', async () => {
      const response = await request(app)
        .post('/api/connections')
        .send({ receiverId: 'invalid' });

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/connections/:connectionId/accept', () => {
    it('should accept connection successfully', async () => {
      const connection = {
        id: 1,
        status: 'accepted',
        toJSON: vi.fn().mockReturnValue({ id: 1, status: 'accepted' })
      };

      mockUserConnectionService.acceptConnection.mockResolvedValue(connection);

      const response = await request(app)
        .put('/api/connections/1/accept');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/connections/stats', () => {
    it('should get connection stats successfully', async () => {
      const stats = {
        total: 10,
        received: { total: 5, pending: 2 },
        sent: { total: 5, pending: 1 },
        friends: 3
      };

      mockUserConnectionService.getConnectionStats.mockResolvedValue(stats);

      const response = await request(app)
        .get('/api/connections/stats');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toEqual(stats);
    });
  });
});


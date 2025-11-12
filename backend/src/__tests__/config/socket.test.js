import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Server } from 'socket.io';
import { setupSocketIO, emitNotification } from '../../config/socket.js';

vi.mock('socket.io');
vi.mock('../../config/jwt.js', () => ({
  verifyAccessToken: vi.fn()
}));

import { verifyAccessToken } from '../../config/jwt.js';

describe('socket config', () => {
  let mockServer;
  let mockIO;
  let mockSocket;

  beforeEach(() => {
    vi.clearAllMocks();

    mockSocket = {
      handshake: {
        auth: {},
        headers: {}
      },
      userId: null,
      userEmail: null,
      join: vi.fn(),
      on: vi.fn()
    };

    mockIO = {
      use: vi.fn((middleware) => {
        // Simular middleware sendo executado
        return mockIO;
      }),
      on: vi.fn((event, callback) => {
        if (event === 'connection') {
          callback(mockSocket);
        }
      }),
      to: vi.fn().mockReturnThis(),
      emit: vi.fn()
    };

    Server.mockImplementation(() => mockIO);
  });

  describe('setupSocketIO', () => {
    it('should setup Socket.io with CORS configuration', () => {
      process.env.FRONTEND_URL = 'http://localhost:3000';

      const result = setupSocketIO(mockServer);

      expect(Server).toHaveBeenCalledWith(mockServer, {
        cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true
        }
      });
      expect(result).toBe(mockIO);
    });

    it('should use default frontend URL when not set', () => {
      delete process.env.FRONTEND_URL;

      setupSocketIO(mockServer);

      expect(Server).toHaveBeenCalledWith(mockServer, {
        cors: {
          origin: 'http://localhost:3000',
          methods: ['GET', 'POST'],
          credentials: true
        }
      });
    });

    it('should authenticate socket with token from auth', async () => {
      const token = 'valid-token';
      mockSocket.handshake.auth.token = token;
      verifyAccessToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      setupSocketIO(mockServer);

      // Simular middleware de autenticação
      const authMiddleware = mockIO.use.mock.calls[0][0];
      const next = vi.fn();

      await authMiddleware(mockSocket, next);

      expect(verifyAccessToken).toHaveBeenCalledWith(token);
      expect(next).toHaveBeenCalled();
      expect(mockSocket.userId).toBe(1);
      expect(mockSocket.userEmail).toBe('test@example.com');
    });

    it('should authenticate socket with token from Authorization header', async () => {
      const token = 'valid-token';
      mockSocket.handshake.auth.token = null;
      mockSocket.handshake.headers.authorization = `Bearer ${token}`;
      verifyAccessToken.mockReturnValue({ userId: 1, email: 'test@example.com' });

      setupSocketIO(mockServer);

      const authMiddleware = mockIO.use.mock.calls[0][0];
      const next = vi.fn();

      await authMiddleware(mockSocket, next);

      expect(verifyAccessToken).toHaveBeenCalledWith(token);
      expect(next).toHaveBeenCalled();
    });

    it('should reject connection when token is missing', async () => {
      mockSocket.handshake.auth.token = null;
      mockSocket.handshake.headers.authorization = null;

      setupSocketIO(mockServer);

      const authMiddleware = mockIO.use.mock.calls[0][0];
      const next = vi.fn();

      await authMiddleware(mockSocket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Token não fornecido');
    });

    it('should reject connection when token is invalid', async () => {
      const token = 'invalid-token';
      mockSocket.handshake.auth.token = token;
      verifyAccessToken.mockImplementation(() => {
        throw new Error('Invalid token');
      });

      setupSocketIO(mockServer);

      const authMiddleware = mockIO.use.mock.calls[0][0];
      const next = vi.fn();

      await authMiddleware(mockSocket, next);

      expect(next).toHaveBeenCalledWith(expect.any(Error));
      expect(next.mock.calls[0][0].message).toBe('Token inválido');
    });

    it('should join user room on connection', () => {
      mockSocket.userId = 1;
      mockSocket.userEmail = 'test@example.com';

      setupSocketIO(mockServer);

      // Simular evento de conexão
      const connectionHandler = mockIO.on.mock.calls.find(call => call[0] === 'connection')[1];
      connectionHandler(mockSocket);

      expect(mockSocket.join).toHaveBeenCalledWith('user:1');
    });

    it('should handle disconnect event', () => {
      mockSocket.userId = 1;
      mockSocket.userEmail = 'test@example.com';

      const consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      setupSocketIO(mockServer);

      const connectionHandler = mockIO.on.mock.calls.find(call => call[0] === 'connection')[1];
      connectionHandler(mockSocket);

      // Simular evento de desconexão
      const disconnectHandler = mockSocket.on.mock.calls.find(call => call[0] === 'disconnect')[1];
      disconnectHandler();

      expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Cliente desconectado'));
      consoleLogSpy.mockRestore();
    });
  });

  describe('emitNotification', () => {
    it('should emit notification to user room', () => {
      const userId = 1;
      const notification = {
        id: 1,
        type: 'match_request',
        title: 'New Match',
        message: 'You have a new match request'
      };

      emitNotification(mockIO, userId, notification);

      expect(mockIO.to).toHaveBeenCalledWith('user:1');
      expect(mockIO.emit).toHaveBeenCalledWith('notification', notification);
    });
  });
});


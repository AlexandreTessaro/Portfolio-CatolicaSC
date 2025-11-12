import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserConnectionService } from '../../services/UserConnectionService.js';
import { UserConnectionRepository } from '../../repositories/UserConnectionRepository.js';
import { UserConnection } from '../../domain/UserConnection.js';

vi.mock('../../repositories/UserConnectionRepository.js');
vi.mock('../../domain/UserConnection.js');

describe('UserConnectionService', () => {
  let userConnectionService;
  let mockUserConnectionRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUserConnectionRepository = {
      create: vi.fn(),
      findById: vi.fn(),
      findByRequesterAndReceiver: vi.fn(),
      updateStatus: vi.fn(),
      findReceivedConnections: vi.fn(),
      findSentConnections: vi.fn(),
      findAcceptedConnections: vi.fn(),
      delete: vi.fn()
    };

    vi.mocked(UserConnectionRepository).mockImplementation(() => mockUserConnectionRepository);
    
    userConnectionService = new UserConnectionService();
  });

  describe('createConnection', () => {
    it('should create connection successfully', async () => {
      const connectionData = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        message: 'Hello'
      };

      mockUserConnectionRepository.findByRequesterAndReceiver.mockResolvedValue(null);
      mockUserConnectionRepository.create.mockResolvedValue(connectionData);

      const result = await userConnectionService.createConnection(1, 2, 'Hello');

      expect(result).toEqual(connectionData);
      expect(mockUserConnectionRepository.create).toHaveBeenCalledWith({
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        message: 'Hello'
      });
    });

    it('should throw error when trying to connect to self', async () => {
      await expect(
        userConnectionService.createConnection(1, 1)
      ).rejects.toThrow('Erro ao criar conexão: Você não pode se conectar consigo mesmo');
    });

    it('should return existing connection if already exists', async () => {
      const existingConnection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending'
      };

      mockUserConnectionRepository.findByRequesterAndReceiver.mockResolvedValue(existingConnection);

      const result = await userConnectionService.createConnection(1, 2);

      expect(result.isExisting).toBe(true);
      expect(result.message).toBe('Conexão já existe entre estes usuários');
      expect(mockUserConnectionRepository.create).not.toHaveBeenCalled();
    });

    it('should throw error when creation fails', async () => {
      mockUserConnectionRepository.findByRequesterAndReceiver.mockResolvedValue(null);
      mockUserConnectionRepository.create.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.createConnection(1, 2)
      ).rejects.toThrow('Erro ao criar conexão: Database error');
    });
  });

  describe('acceptConnection', () => {
    it('should accept connection successfully', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        canBeAccepted: vi.fn().mockReturnValue(true)
      };

      const updatedConnection = { ...connection, status: 'accepted' };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);
      mockUserConnectionRepository.updateStatus.mockResolvedValue(updatedConnection);

      const result = await userConnectionService.acceptConnection(1, 2);

      expect(result.status).toBe('accepted');
      expect(mockUserConnectionRepository.updateStatus).toHaveBeenCalledWith(1, 'accepted');
    });

    it('should throw error when connection not found', async () => {
      mockUserConnectionRepository.findById.mockResolvedValue(null);

      await expect(
        userConnectionService.acceptConnection(999, 2)
      ).rejects.toThrow('Erro ao aceitar conexão: Conexão não encontrada');
    });

    it('should throw error when user is not receiver', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending'
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);

      await expect(
        userConnectionService.acceptConnection(1, 1)
      ).rejects.toThrow('Erro ao aceitar conexão: Você não tem permissão para aceitar esta conexão');
    });

    it('should throw error when connection cannot be accepted', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        canBeAccepted: vi.fn().mockReturnValue(false)
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);

      await expect(
        userConnectionService.acceptConnection(1, 2)
      ).rejects.toThrow('Erro ao aceitar conexão: Esta conexão não pode ser aceita');
    });
  });

  describe('rejectConnection', () => {
    it('should reject connection successfully', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        canBeRejected: vi.fn().mockReturnValue(true)
      };

      const updatedConnection = { ...connection, status: 'rejected' };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);
      mockUserConnectionRepository.updateStatus.mockResolvedValue(updatedConnection);

      const result = await userConnectionService.rejectConnection(1, 2);

      expect(result.status).toBe('rejected');
      expect(mockUserConnectionRepository.updateStatus).toHaveBeenCalledWith(1, 'rejected');
    });

    it('should throw error when connection not found', async () => {
      mockUserConnectionRepository.findById.mockResolvedValue(null);

      await expect(
        userConnectionService.rejectConnection(999, 2)
      ).rejects.toThrow('Erro ao rejeitar conexão: Conexão não encontrada');
    });

    it('should throw error when user is not receiver', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending'
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);

      await expect(
        userConnectionService.rejectConnection(1, 1)
      ).rejects.toThrow('Erro ao rejeitar conexão: Você não tem permissão para rejeitar esta conexão');
    });
  });

  describe('blockConnection', () => {
    it('should block connection successfully', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'accepted',
        canBeBlocked: vi.fn().mockReturnValue(true)
      };

      const updatedConnection = { ...connection, status: 'blocked' };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);
      mockUserConnectionRepository.updateStatus.mockResolvedValue(updatedConnection);

      const result = await userConnectionService.blockConnection(1, 1);

      expect(result.status).toBe('blocked');
      expect(mockUserConnectionRepository.updateStatus).toHaveBeenCalledWith(1, 'blocked');
    });

    it('should throw error when user is not part of connection', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'accepted'
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);

      await expect(
        userConnectionService.blockConnection(1, 3)
      ).rejects.toThrow('Erro ao bloquear conexão: Você não tem permissão para bloquear esta conexão');
    });
  });

  describe('getReceivedConnections', () => {
    it('should get received connections successfully', async () => {
      const connections = [
        { id: 1, requesterId: 1, receiverId: 2, status: 'pending' }
      ];

      mockUserConnectionRepository.findReceivedConnections.mockResolvedValue(connections);

      const result = await userConnectionService.getReceivedConnections(2);

      expect(result).toEqual(connections);
      expect(mockUserConnectionRepository.findReceivedConnections).toHaveBeenCalledWith(2, null);
    });

    it('should filter by status', async () => {
      const connections = [];
      mockUserConnectionRepository.findReceivedConnections.mockResolvedValue(connections);

      await userConnectionService.getReceivedConnections(2, 'pending');

      expect(mockUserConnectionRepository.findReceivedConnections).toHaveBeenCalledWith(2, 'pending');
    });

    it('should throw error when fetch fails', async () => {
      mockUserConnectionRepository.findReceivedConnections.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.getReceivedConnections(2)
      ).rejects.toThrow('Erro ao buscar conexões recebidas: Database error');
    });
  });

  describe('getSentConnections', () => {
    it('should get sent connections successfully', async () => {
      const connections = [
        { id: 1, requesterId: 1, receiverId: 2, status: 'pending' }
      ];

      mockUserConnectionRepository.findSentConnections.mockResolvedValue(connections);

      const result = await userConnectionService.getSentConnections(1);

      expect(result).toEqual(connections);
      expect(mockUserConnectionRepository.findSentConnections).toHaveBeenCalledWith(1, null);
    });

    it('should throw error when fetch fails', async () => {
      mockUserConnectionRepository.findSentConnections.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.getSentConnections(1)
      ).rejects.toThrow('Erro ao buscar conexões enviadas: Database error');
    });
  });

  describe('getAcceptedConnections', () => {
    it('should get accepted connections successfully', async () => {
      const connections = [
        { id: 1, requesterId: 1, receiverId: 2, status: 'accepted' }
      ];

      mockUserConnectionRepository.findAcceptedConnections.mockResolvedValue(connections);

      const result = await userConnectionService.getAcceptedConnections(1);

      expect(result).toEqual(connections);
      expect(mockUserConnectionRepository.findAcceptedConnections).toHaveBeenCalledWith(1);
    });

    it('should throw error when fetch fails', async () => {
      mockUserConnectionRepository.findAcceptedConnections.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.getAcceptedConnections(1)
      ).rejects.toThrow('Erro ao buscar conexões aceitas: Database error');
    });
  });

  describe('areUsersConnected', () => {
    it('should return connection status when users are connected', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'accepted'
      };

      mockUserConnectionRepository.findByRequesterAndReceiver.mockResolvedValue(connection);

      const result = await userConnectionService.areUsersConnected(1, 2);

      expect(result.connected).toBe(true);
      expect(result.status).toBe('accepted');
      expect(result.connectionId).toBe(1);
    });

    it('should return not connected when no connection exists', async () => {
      mockUserConnectionRepository.findByRequesterAndReceiver.mockResolvedValue(null);

      const result = await userConnectionService.areUsersConnected(1, 2);

      expect(result.connected).toBe(false);
      expect(result.status).toBe('none');
    });

    it('should throw error when check fails', async () => {
      mockUserConnectionRepository.findByRequesterAndReceiver.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.areUsersConnected(1, 2)
      ).rejects.toThrow('Erro ao verificar conexão: Database error');
    });
  });

  describe('deleteConnection', () => {
    it('should delete connection successfully', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending'
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);
      mockUserConnectionRepository.delete.mockResolvedValue(connection);

      const result = await userConnectionService.deleteConnection(1, 1);

      expect(result).toEqual(connection);
      expect(mockUserConnectionRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw error when connection not found', async () => {
      mockUserConnectionRepository.findById.mockResolvedValue(null);

      await expect(
        userConnectionService.deleteConnection(999, 1)
      ).rejects.toThrow('Erro ao deletar conexão: Conexão não encontrada');
    });

    it('should throw error when user is not part of connection', async () => {
      const connection = {
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending'
      };

      mockUserConnectionRepository.findById.mockResolvedValue(connection);

      await expect(
        userConnectionService.deleteConnection(1, 3)
      ).rejects.toThrow('Erro ao deletar conexão: Você não tem permissão para deletar esta conexão');
    });
  });

  describe('getConnectionStats', () => {
    it('should get connection stats successfully', async () => {
      const receivedConnections = [
        { id: 1, status: 'pending' },
        { id: 2, status: 'accepted' },
        { id: 3, status: 'rejected' }
      ];
      const sentConnections = [
        { id: 4, status: 'pending' },
        { id: 5, status: 'accepted' }
      ];
      const acceptedConnections = [
        { id: 2, status: 'accepted' },
        { id: 5, status: 'accepted' }
      ];

      mockUserConnectionRepository.findReceivedConnections.mockResolvedValue(receivedConnections);
      mockUserConnectionRepository.findSentConnections.mockResolvedValue(sentConnections);
      mockUserConnectionRepository.findAcceptedConnections.mockResolvedValue(acceptedConnections);

      const stats = await userConnectionService.getConnectionStats(1);

      expect(stats.total).toBe(5);
      expect(stats.received.total).toBe(3);
      expect(stats.received.pending).toBe(1);
      expect(stats.received.accepted).toBe(1);
      expect(stats.received.rejected).toBe(1);
      expect(stats.sent.total).toBe(2);
      expect(stats.friends).toBe(2);
    });

    it('should throw error when fetch fails', async () => {
      mockUserConnectionRepository.findReceivedConnections.mockRejectedValue(new Error('Database error'));

      await expect(
        userConnectionService.getConnectionStats(1)
      ).rejects.toThrow('Erro ao obter estatísticas: Database error');
    });
  });
});


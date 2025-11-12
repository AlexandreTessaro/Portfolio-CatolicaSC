import { describe, it, expect, beforeEach, vi } from 'vitest';
import { UserConnectionRepository } from '../../repositories/UserConnectionRepository.js';
import { UserConnection } from '../../domain/UserConnection.js';

vi.mock('../../domain/UserConnection.js');

describe('UserConnectionRepository', () => {
  let userConnectionRepository;
  let mockClient;
  let mockPool;

  beforeEach(() => {
    mockClient = {
      query: vi.fn(),
      release: vi.fn()
    };

    mockPool = {
      connect: vi.fn().mockResolvedValue(mockClient)
    };

    userConnectionRepository = new UserConnectionRepository();
    userConnectionRepository.pool = mockPool;
  });

  describe('create', () => {
    it('should create a connection successfully', async () => {
      const connectionData = {
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        message: 'Hello'
      };

      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'pending',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      const expectedConnection = new UserConnection({
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'pending',
        message: 'Hello',
        createdAt: dbRow.created_at,
        updatedAt: dbRow.updated_at
      });

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.create(connectionData);

      expect(mockPool.connect).toHaveBeenCalled();
      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_connections'),
        [1, 2, 'pending', 'Hello']
      );
      expect(mockClient.release).toHaveBeenCalled();
      expect(result).toBeDefined();
    });

    it('should create connection with default status and null message', async () => {
      const connectionData = {
        requesterId: 1,
        receiverId: 2
      };

      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'pending',
        message: null,
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.create(connectionData);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_connections'),
        [1, 2, 'pending', null]
      );
      expect(result).toBeDefined();
    });
  });

  describe('findById', () => {
    it('should find connection by id', async () => {
      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'accepted',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      const expectedConnection = new UserConnection({
        id: 1,
        requesterId: 1,
        receiverId: 2,
        status: 'accepted',
        message: 'Hello',
        createdAt: dbRow.created_at,
        updatedAt: dbRow.updated_at
      });

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.findById(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        'SELECT * FROM user_connections WHERE id = $1',
        [1]
      );
      expect(result).toBeDefined();
    });

    it('should return null when connection not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userConnectionRepository.findById(999);

      expect(result).toBeNull();
    });
  });

  describe('existsBetweenUsers', () => {
    it('should return true when connection exists', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ id: 1 }] });

      const result = await userConnectionRepository.existsBetweenUsers(1, 2);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('SELECT id FROM user_connections'),
        [1, 2]
      );
      expect(result).toBe(true);
    });

    it('should return false when connection does not exist', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userConnectionRepository.existsBetweenUsers(1, 2);

      expect(result).toBe(false);
    });

    it('should check both directions (requester/receiver)', async () => {
      mockClient.query.mockResolvedValue({ rows: [{ id: 1 }] });

      await userConnectionRepository.existsBetweenUsers(1, 2);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('(requester_id = $1 AND receiver_id = $2)'),
        [1, 2]
      );
    });
  });

  describe('findReceivedConnections', () => {
    it('should find received connections', async () => {
      const dbRows = [
        {
          id: 1,
          requester_id: 2,
          receiver_id: 1,
          status: 'pending',
          message: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
          requester_name: 'John',
          requester_email: 'john@example.com',
          requester_bio: 'Bio',
          requester_skills: ['JavaScript']
        }
      ];

      mockClient.query.mockResolvedValue({ rows: dbRows });
      UserConnection.mockImplementation((data) => ({
        ...data,
        toJSON: () => data
      }));

      const result = await userConnectionRepository.findReceivedConnections(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE uc.receiver_id = $1'),
        [1]
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should find received connections with status filter', async () => {
      const dbRows = [
        {
          id: 1,
          requester_id: 2,
          receiver_id: 1,
          status: 'pending',
          message: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
          requester_name: 'John',
          requester_email: 'john@example.com',
          requester_bio: 'Bio',
          requester_skills: ['JavaScript']
        }
      ];

      mockClient.query.mockResolvedValue({ rows: dbRows });
      UserConnection.mockImplementation((data) => ({
        ...data,
        toJSON: () => data
      }));

      const result = await userConnectionRepository.findReceivedConnections(1, 'pending');

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('AND uc.status = $2'),
        [1, 'pending']
      );
      expect(result).toBeDefined();
    });
  });

  describe('findSentConnections', () => {
    it('should find sent connections', async () => {
      const dbRows = [
        {
          id: 1,
          requester_id: 1,
          receiver_id: 2,
          status: 'pending',
          message: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
          receiver_name: 'Jane',
          receiver_email: 'jane@example.com',
          receiver_bio: 'Bio',
          receiver_skills: ['Python']
        }
      ];

      mockClient.query.mockResolvedValue({ rows: dbRows });
      UserConnection.mockImplementation((data) => ({
        ...data,
        toJSON: () => data
      }));

      const result = await userConnectionRepository.findSentConnections(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('WHERE uc.requester_id = $1'),
        [1]
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should find sent connections with status filter', async () => {
      const dbRows = [
        {
          id: 1,
          requester_id: 1,
          receiver_id: 2,
          status: 'accepted',
          message: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
          receiver_name: 'Jane',
          receiver_email: 'jane@example.com',
          receiver_bio: 'Bio',
          receiver_skills: ['Python']
        }
      ];

      mockClient.query.mockResolvedValue({ rows: dbRows });
      UserConnection.mockImplementation((data) => ({
        ...data,
        toJSON: () => data
      }));

      const result = await userConnectionRepository.findSentConnections(1, 'accepted');

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('AND uc.status = $2'),
        [1, 'accepted']
      );
      expect(result).toBeDefined();
    });
  });

  describe('updateStatus', () => {
    it('should update connection status', async () => {
      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'accepted',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.updateStatus(1, 'accepted');

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_connections'),
        ['accepted', 1]
      );
      expect(result).toBeDefined();
    });

    it('should return null when connection not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userConnectionRepository.updateStatus(999, 'accepted');

      expect(result).toBeNull();
    });
  });

  describe('findAcceptedConnections', () => {
    it('should find accepted connections', async () => {
      const dbRows = [
        {
          id: 1,
          requester_id: 1,
          receiver_id: 2,
          status: 'accepted',
          message: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
          connected_user_name: 'Jane',
          connected_user_email: 'jane@example.com',
          connected_user_bio: 'Bio',
          connected_user_skills: ['Python']
        }
      ];

      mockClient.query.mockResolvedValue({ rows: dbRows });
      UserConnection.mockImplementation((data) => ({
        ...data,
        toJSON: () => data
      }));

      const result = await userConnectionRepository.findAcceptedConnections(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('AND uc.status = \'accepted\''),
        [1]
      );
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });
  });

  describe('findByRequesterAndReceiver', () => {
    it('should find connection between two users', async () => {
      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'pending',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.findByRequesterAndReceiver(1, 2);

      expect(mockClient.query).toHaveBeenCalledWith(
        expect.stringContaining('(requester_id = $1 AND receiver_id = $2)'),
        [1, 2]
      );
      expect(result).toBeDefined();
    });

    it('should return null when connection not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userConnectionRepository.findByRequesterAndReceiver(1, 2);

      expect(result).toBeNull();
    });
  });

  describe('delete', () => {
    it('should delete connection successfully', async () => {
      const dbRow = {
        id: 1,
        requester_id: 1,
        receiver_id: 2,
        status: 'pending',
        message: 'Hello',
        created_at: new Date(),
        updated_at: new Date()
      };

      mockClient.query.mockResolvedValue({ rows: [dbRow] });
      UserConnection.mockImplementation((data) => ({ ...data, toJSON: () => data }));

      const result = await userConnectionRepository.delete(1);

      expect(mockClient.query).toHaveBeenCalledWith(
        'DELETE FROM user_connections WHERE id = $1 RETURNING *',
        [1]
      );
      expect(result).toBeDefined();
    });

    it('should return null when connection not found', async () => {
      mockClient.query.mockResolvedValue({ rows: [] });

      const result = await userConnectionRepository.delete(999);

      expect(result).toBeNull();
    });
  });
});


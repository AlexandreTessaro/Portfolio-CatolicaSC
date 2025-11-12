import { describe, it, expect } from 'vitest';
import { UserConnection } from '../../domain/UserConnection.js';

describe('UserConnection Domain Model', () => {
  describe('constructor', () => {
    it('should create user connection with all properties', () => {
      const connectionData = {
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'Hello, I would like to connect',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };

      const connection = new UserConnection(connectionData);

      expect(connection.id).toBe(1);
      expect(connection.requesterId).toBe(123);
      expect(connection.receiverId).toBe(456);
      expect(connection.status).toBe('pending');
      expect(connection.message).toBe('Hello, I would like to connect');
    });

    it('should use default values when not provided', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456
      });

      expect(connection.status).toBe('pending');
      expect(connection.message).toBeNull();
      expect(connection.createdAt).toBeInstanceOf(Date);
      expect(connection.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validateStatus', () => {
    it('should return true for valid status', () => {
      expect(UserConnection.validateStatus('pending')).toBe(true);
      expect(UserConnection.validateStatus('accepted')).toBe(true);
      expect(UserConnection.validateStatus('rejected')).toBe(true);
      expect(UserConnection.validateStatus('blocked')).toBe(true);
    });

    it('should return false for invalid status', () => {
      expect(UserConnection.validateStatus('invalid')).toBe(false);
      expect(UserConnection.validateStatus('')).toBe(false);
      expect(UserConnection.validateStatus(null)).toBe(false);
    });
  });

  describe('validateMessage', () => {
    it('should return true for valid message', () => {
      expect(UserConnection.validateMessage('Valid message')).toBe(true);
      expect(UserConnection.validateMessage('a'.repeat(500))).toBe(true);
      expect(UserConnection.validateMessage('')).toBe(true);
    });

    it('should return true for null message', () => {
      expect(UserConnection.validateMessage(null)).toBe(true);
    });

    it('should return false for long message', () => {
      expect(UserConnection.validateMessage('a'.repeat(501))).toBe(false);
    });
  });

  describe('isValid', () => {
    it('should return true for valid connection', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'Valid message'
      });

      expect(connection.isValid()).toBe(true);
    });

    it('should return false when requesterId is missing', () => {
      const connection = new UserConnection({
        id: 1,
        receiverId: 456,
        status: 'pending'
      });

      expect(connection.isValid()).toBe(false);
    });

    it('should return false when receiverId is missing', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        status: 'pending'
      });

      expect(connection.isValid()).toBe(false);
    });

    it('should return false when requesterId equals receiverId', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 123,
        status: 'pending'
      });

      expect(connection.isValid()).toBe(false);
    });

    it('should return false for invalid status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'invalid'
      });

      expect(connection.isValid()).toBe(false);
    });

    it('should return false for invalid message', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'a'.repeat(501)
      });

      expect(connection.isValid()).toBe(false);
    });
  });

  describe('canBeAccepted', () => {
    it('should return true for pending status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending'
      });

      expect(connection.canBeAccepted()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'accepted'
      });

      expect(connection.canBeAccepted()).toBe(false);
    });
  });

  describe('canBeRejected', () => {
    it('should return true for pending status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending'
      });

      expect(connection.canBeRejected()).toBe(true);
    });

    it('should return false for non-pending status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'rejected'
      });

      expect(connection.canBeRejected()).toBe(false);
    });
  });

  describe('canBeBlocked', () => {
    it('should return true for pending status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending'
      });

      expect(connection.canBeBlocked()).toBe(true);
    });

    it('should return true for accepted status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'accepted'
      });

      expect(connection.canBeBlocked()).toBe(true);
    });

    it('should return false for rejected status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'rejected'
      });

      expect(connection.canBeBlocked()).toBe(false);
    });

    it('should return false for blocked status', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'blocked'
      });

      expect(connection.canBeBlocked()).toBe(false);
    });
  });

  describe('toJSON', () => {
    it('should serialize connection to JSON', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });

      const json = connection.toJSON();

      expect(json).toEqual({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });
    });
  });

  describe('toPublicJSON', () => {
    it('should serialize connection to public JSON without sensitive data', () => {
      const connection = new UserConnection({
        id: 1,
        requesterId: 123,
        receiverId: 456,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });

      const publicJson = connection.toPublicJSON();

      expect(publicJson).not.toHaveProperty('requesterId');
      expect(publicJson).not.toHaveProperty('receiverId');
      expect(publicJson).toEqual({
        id: 1,
        status: 'pending',
        message: 'Test message',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      });
    });
  });
});


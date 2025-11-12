import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ConsentRepository } from '../../repositories/ConsentRepository.js';

vi.mock('../../config/database.js', () => ({
  default: {
    connect: vi.fn()
  }
}));

import pool from '../../config/database.js';

describe('ConsentRepository', () => {
  let consentRepository;
  let mockClient;
  let mockQuery;

  beforeEach(() => {
    vi.clearAllMocks();
    
    mockQuery = vi.fn();
    mockClient = {
      query: mockQuery,
      release: vi.fn()
    };
    
    pool.connect = vi.fn().mockResolvedValue(mockClient);
    
    consentRepository = new ConsentRepository();
  });

  describe('createConsent', () => {
    it('should create consent successfully', async () => {
      const userId = 1;
      const consentData = {
        consentType: 'privacy_policy',
        consentVersion: '1.0',
        accepted: true,
        ipAddress: '127.0.0.1',
        userAgent: 'Mozilla/5.0'
      };

      const mockResult = {
        rows: [{
          id: 1,
          user_id: userId,
          consent_type: consentData.consentType,
          consent_version: consentData.consentVersion,
          accepted: consentData.accepted,
          ip_address: consentData.ipAddress,
          user_agent: consentData.userAgent
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.createConsent(userId, consentData);

      expect(pool.connect).toHaveBeenCalled();
      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_consents'),
        [userId, consentData.consentType, consentData.consentVersion, consentData.accepted, consentData.ipAddress, consentData.userAgent]
      );
      expect(result).toEqual(mockResult.rows[0]);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should use default values when not provided', async () => {
      const userId = 1;
      const consentData = {};

      const mockResult = {
        rows: [{
          id: 1,
          user_id: userId,
          consent_type: 'privacy_policy',
          consent_version: '1.0',
          accepted: true,
          ip_address: null,
          user_agent: null
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.createConsent(userId, consentData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('INSERT INTO user_consents'),
        [userId, 'privacy_policy', '1.0', true, null, null]
      );
      expect(result).toEqual(mockResult.rows[0]);
    });

    it('should update existing consent on conflict', async () => {
      const userId = 1;
      const consentData = {
        consentType: 'privacy_policy',
        consentVersion: '1.0',
        accepted: true
      };

      const mockResult = {
        rows: [{
          id: 1,
          user_id: userId,
          accepted: true,
          updated_at: new Date()
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.createConsent(userId, consentData);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('ON CONFLICT'),
        expect.any(Array)
      );
      expect(result).toEqual(mockResult.rows[0]);
    });
  });

  describe('findByUserId', () => {
    it('should find consents by user id', async () => {
      const userId = 1;
      const mockResult = {
        rows: [
          { id: 1, user_id: userId, consent_type: 'privacy_policy', accepted: true },
          { id: 2, user_id: userId, consent_type: 'terms_of_service', accepted: true }
        ]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.findByUserId(userId);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM user_consents'),
        [userId]
      );
      expect(result).toEqual(mockResult.rows);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return empty array when no consents found', async () => {
      const userId = 999;
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await consentRepository.findByUserId(userId);

      expect(result).toEqual([]);
    });
  });

  describe('hasActiveConsent', () => {
    it('should return true when user has active consent', async () => {
      const userId = 1;
      const consentType = 'privacy_policy';
      const mockResult = {
        rows: [{ id: 1, user_id: userId, consent_type: consentType, accepted: true }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.hasActiveConsent(userId, consentType);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM user_consents'),
        [userId, consentType]
      );
      expect(result).toBe(true);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return false when user has no active consent', async () => {
      const userId = 1;
      const consentType = 'privacy_policy';
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await consentRepository.hasActiveConsent(userId, consentType);

      expect(result).toBe(false);
    });

    it('should use default consent type when not provided', async () => {
      const userId = 1;
      mockQuery.mockResolvedValue({ rows: [] });

      await consentRepository.hasActiveConsent(userId);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('SELECT * FROM user_consents'),
        [userId, 'privacy_policy']
      );
    });
  });

  describe('revokeConsent', () => {
    it('should revoke consent successfully', async () => {
      const userId = 1;
      const consentType = 'privacy_policy';
      const mockResult = {
        rows: [{
          id: 1,
          user_id: userId,
          consent_type: consentType,
          accepted: false,
          updated_at: new Date()
        }]
      };

      mockQuery.mockResolvedValue(mockResult);

      const result = await consentRepository.revokeConsent(userId, consentType);

      expect(mockQuery).toHaveBeenCalledWith(
        expect.stringContaining('UPDATE user_consents'),
        [userId, consentType]
      );
      expect(result).toEqual(mockResult.rows);
      expect(mockClient.release).toHaveBeenCalled();
    });

    it('should return empty array when no consent found to revoke', async () => {
      const userId = 999;
      const consentType = 'privacy_policy';
      mockQuery.mockResolvedValue({ rows: [] });

      const result = await consentRepository.revokeConsent(userId, consentType);

      expect(result).toEqual([]);
    });
  });
});


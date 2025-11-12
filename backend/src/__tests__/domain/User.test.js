import { describe, it, expect } from 'vitest';
import { User } from '../../domain/User.js';

describe('User Domain Model', () => {
  describe('constructor', () => {
    it('should create user with all properties', () => {
      const userData = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedPassword',
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript', 'React'],
        socialLinks: { github: 'https://github.com/test' },
        profileImage: 'image.jpg',
        isAdmin: false,
        isVerified: true,
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-02')
      };

      const user = new User(userData);

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
      expect(user.name).toBe('Test User');
      expect(user.bio).toBe('Test bio');
      expect(user.skills).toEqual(['JavaScript', 'React']);
      expect(user.socialLinks).toEqual({ github: 'https://github.com/test' });
      expect(user.isAdmin).toBe(false);
      expect(user.isVerified).toBe(true);
    });

    it('should use default values when not provided', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      });

      expect(user.skills).toEqual([]);
      expect(user.socialLinks).toEqual({});
      expect(user.isAdmin).toBe(false);
      expect(user.isVerified).toBe(false);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('validate', () => {
    it('should return empty array for valid user', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        bio: 'Valid bio'
      });

      const errors = user.validate();

      expect(errors).toEqual([]);
    });

    it('should return error for invalid email', () => {
      const user = new User({
        id: 1,
        email: 'invalid-email',
        name: 'Test User'
      });

      const errors = user.validate();

      expect(errors).toContain('Email inválido');
    });

    it('should return error for short name', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'A'
      });

      const errors = user.validate();

      expect(errors).toContain('Nome deve ter pelo menos 2 caracteres');
    });

    it('should return error for long bio', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        bio: 'a'.repeat(501)
      });

      const errors = user.validate();

      expect(errors).toContain('Bio deve ter no máximo 500 caracteres');
    });

    it('should return error for too many skills', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        skills: Array(21).fill('Skill')
      });

      const errors = user.validate();

      expect(errors).toContain('Máximo de 20 habilidades permitidas');
    });
  });

  describe('addSkill', () => {
    it('should add skill if not exists and under limit', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        skills: ['JavaScript']
      });

      const initialUpdatedAt = user.updatedAt;
      
      user.addSkill('React');

      expect(user.skills).toContain('React');
      expect(user.skills.length).toBe(2);
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });

    it('should not add duplicate skill', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        skills: ['JavaScript']
      });

      user.addSkill('JavaScript');

      expect(user.skills.length).toBe(1);
    });

    it('should not add skill if limit reached', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        skills: Array(20).fill('Skill')
      });

      user.addSkill('New Skill');

      expect(user.skills.length).toBe(20);
      expect(user.skills).not.toContain('New Skill');
    });
  });

  describe('removeSkill', () => {
    it('should remove skill', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User',
        skills: ['JavaScript', 'React']
      });

      const initialUpdatedAt = user.updatedAt;
      
      user.removeSkill('JavaScript');

      expect(user.skills).not.toContain('JavaScript');
      expect(user.skills).toContain('React');
      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
    });
  });

  describe('updateProfile', () => {
    it('should update allowed fields', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      });

      const updates = {
        name: 'Updated Name',
        bio: 'Updated bio',
        skills: ['New Skill'],
        socialLinks: { github: 'https://github.com/new' },
        profileImage: 'new-image.jpg'
      };

      user.updateProfile(updates);

      expect(user.name).toBe('Updated Name');
      expect(user.bio).toBe('Updated bio');
      expect(user.skills).toEqual(['New Skill']);
      expect(user.socialLinks).toEqual({ github: 'https://github.com/new' });
      expect(user.profileImage).toBe('new-image.jpg');
    });

    it('should not update disallowed fields', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        name: 'Test User'
      });

      const updates = {
        id: 999,
        email: 'hacked@example.com',
        password: 'hacked'
      };

      user.updateProfile(updates);

      expect(user.id).toBe(1);
      expect(user.email).toBe('test@example.com');
    });
  });

  describe('toPublicProfile', () => {
    it('should return public profile without sensitive data', () => {
      const user = new User({
        id: 1,
        email: 'test@example.com',
        password: 'secret',
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript'],
        socialLinks: { github: 'https://github.com/test' },
        profileImage: 'image.jpg',
        isVerified: true
      });

      const publicProfile = user.toPublicProfile();

      expect(publicProfile).not.toHaveProperty('password');
      expect(publicProfile).not.toHaveProperty('email');
      expect(publicProfile).not.toHaveProperty('isAdmin');
      expect(publicProfile).toEqual({
        id: 1,
        name: 'Test User',
        bio: 'Test bio',
        skills: ['JavaScript'],
        socialLinks: { github: 'https://github.com/test' },
        profileImage: 'image.jpg',
        isVerified: true,
        createdAt: user.createdAt
      });
    });
  });
});


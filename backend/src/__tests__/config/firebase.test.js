import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock do firebase-admin usando vi.hoisted para garantir que seja aplicado antes
const { mockAuth, mockVerifyIdToken } = vi.hoisted(() => {
  const mockVerifyIdToken = vi.fn();
  const mockAuth = vi.fn(() => ({
    verifyIdToken: mockVerifyIdToken
  }));
  return { mockAuth, mockVerifyIdToken };
});

vi.mock('firebase-admin', () => ({
  default: {
    initializeApp: vi.fn((config) => ({
      auth: mockAuth
    })),
    credential: {
      cert: vi.fn()
    },
    auth: mockAuth
  }
}));

describe('firebase config', () => {
  let originalEnv;

  beforeEach(() => {
    originalEnv = { ...process.env };
    vi.clearAllMocks();
    vi.resetModules();
  });

  afterEach(() => {
    process.env = originalEnv;
  });

  it('should initialize Firebase Admin with service account JSON', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
      projectId: 'test-project',
      privateKey: 'test-key',
      clientEmail: 'test@example.com'
    });

    const admin = await import('firebase-admin');
    const firebaseModule = await import('../../config/firebase.js');

    // Verificar se initializeApp foi chamado
    expect(admin.default.initializeApp).toHaveBeenCalled();
  });

  it('should initialize Firebase Admin with individual env vars', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';
    process.env.FIREBASE_CLIENT_EMAIL = 'test@example.com';
    delete process.env.FIREBASE_SERVICE_ACCOUNT;

    const admin = await import('firebase-admin');
    vi.resetModules();
    
    const firebaseModule = await import('../../config/firebase.js');

    expect(admin.default.credential.cert).toHaveBeenCalled();
  });

  it('should not initialize Firebase Admin when env vars are missing', async () => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_PRIVATE_KEY;
    delete process.env.FIREBASE_SERVICE_ACCOUNT;

    const admin = await import('firebase-admin');
    vi.resetModules();
    
    const firebaseModule = await import('../../config/firebase.js');

    expect(admin.default.initializeApp).not.toHaveBeenCalled();
  });

  it('should verify Firebase token successfully', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
      projectId: 'test-project',
      privateKey: 'test-key',
      clientEmail: 'test@example.com'
    });

    vi.resetModules();
    
    const firebaseModule = await import('../../config/firebase.js');
    const { verifyFirebaseToken } = firebaseModule;

    const mockDecodedToken = { uid: '123', email: 'test@example.com' };
    mockVerifyIdToken.mockResolvedValue(mockDecodedToken);

    const result = await verifyFirebaseToken('valid-token');

    expect(result).toEqual(mockDecodedToken);
    expect(mockVerifyIdToken).toHaveBeenCalledWith('valid-token');
  });

  it('should throw error when Firebase Admin is not configured', async () => {
    delete process.env.FIREBASE_PROJECT_ID;
    delete process.env.FIREBASE_PRIVATE_KEY;

    vi.resetModules();
    const firebaseModule = await import('../../config/firebase.js');
    const { verifyFirebaseToken } = firebaseModule;

    await expect(verifyFirebaseToken('token')).rejects.toThrow('Firebase Admin não está configurado');
  });

  it('should throw error for invalid token', async () => {
    process.env.FIREBASE_PROJECT_ID = 'test-project';
    process.env.FIREBASE_PRIVATE_KEY = 'test-key';
    process.env.FIREBASE_SERVICE_ACCOUNT = JSON.stringify({
      projectId: 'test-project',
      privateKey: 'test-key',
      clientEmail: 'test@example.com'
    });

    vi.resetModules();
    
    const firebaseModule = await import('../../config/firebase.js');
    const { verifyFirebaseToken } = firebaseModule;

    mockVerifyIdToken.mockRejectedValue(new Error('Token expired'));

    await expect(verifyFirebaseToken('invalid-token')).rejects.toThrow('Token inválido: Token expired');
  });
});


import { renderHook, act } from '@testing-library/react';
import { useAuthStore } from '../../stores/authStore';

// Mock do localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('AuthStore', () => {
  beforeEach(() => {
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  it('should initialize with default values', () => {
    // Act
    const { result } = renderHook(() => useAuthStore());

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should set user correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };

    // Act
    act(() => {
      result.current.setUser(mockUser);
    });

    // Assert
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should set tokens correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    const accessToken = 'access-token-123';
    const refreshToken = 'refresh-token-123';

    // Act
    act(() => {
      result.current.setTokens(accessToken, refreshToken);
    });

    // Assert
    expect(result.current.accessToken).toBe(accessToken);
    expect(result.current.refreshToken).toBe(refreshToken);
    expect(result.current.isAuthenticated).toBe(true);
  });

  it('should login user correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, name: 'John Doe' };
    const mockTokens = {
      accessToken: 'access-token-123',
      refreshToken: 'refresh-token-123'
    };

    // Act
    act(() => {
      result.current.login(mockUser, mockTokens);
    });

    // Assert
    expect(result.current.user).toEqual(mockUser);
    expect(result.current.accessToken).toBe(mockTokens.accessToken);
    expect(result.current.refreshToken).toBe(mockTokens.refreshToken);
    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.error).toBeNull();
  });

  it('should logout user correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    
    // Primeiro faz login
    act(() => {
      result.current.login(
        { id: 1, name: 'John Doe' },
        { accessToken: 'token', refreshToken: 'refresh' }
      );
    });

    // Act
    act(() => {
      result.current.logout();
    });

    // Assert
    expect(result.current.user).toBeNull();
    expect(result.current.accessToken).toBeNull();
    expect(result.current.refreshToken).toBeNull();
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('should update profile correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' };
    
    // Primeiro faz login
    act(() => {
      result.current.login(mockUser, { accessToken: 'token', refreshToken: 'refresh' });
    });

    // Act
    act(() => {
      result.current.updateProfile({ name: 'Jane Doe', bio: 'New bio' });
    });

    // Assert
    expect(result.current.user.name).toBe('Jane Doe');
    expect(result.current.user.bio).toBe('New bio');
    expect(result.current.user.email).toBe('john@example.com'); // Não deve mudar
  });

  it('should set and clear error correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());
    const mockError = 'Something went wrong';

    // Act
    act(() => {
      result.current.setError(mockError);
    });

    // Assert
    expect(result.current.error).toBe(mockError);

    // Act
    act(() => {
      result.current.clearError();
    });

    // Assert
    expect(result.current.error).toBeNull();
  });

  it('should set loading state correctly', () => {
    // Arrange
    const { result } = renderHook(() => useAuthStore());

    // Act
    act(() => {
      result.current.setLoading(true);
    });

    // Assert
    expect(result.current.isLoading).toBe(true);

    // Act
    act(() => {
      result.current.setLoading(false);
    });

    // Assert
    expect(result.current.isLoading).toBe(false);
  });
});

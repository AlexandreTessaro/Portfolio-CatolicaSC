import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock axios usando vi.hoisted para evitar problemas de hoisting
const { mockApi } = vi.hoisted(() => {
  const mockApi = {
    interceptors: {
      request: {
        use: vi.fn()
      }
    },
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  };
  
  return { mockApi };
});

vi.mock('axios', () => ({
  default: {
    create: vi.fn(() => mockApi)
  }
}));

vi.mock('../../stores/authStore', () => ({
  useAuthStore: {
    getState: vi.fn(() => ({
      getAccessToken: vi.fn(() => 'mock-token')
    }))
  }
}));

// Importar após mockar
import { notificationService } from '../../services/notificationService';

describe('notificationService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should get notifications', async () => {
    mockApi.get.mockResolvedValue({
      data: {
        success: true,
        data: [
          { id: 1, title: 'Test', message: 'Test message' }
        ]
      }
    });

    const result = await notificationService.list();

    expect(mockApi.get).toHaveBeenCalledWith('/notifications', { params: {} });
    expect(result.success).toBe(true);
  });

  it('should get unread count', async () => {
    mockApi.get.mockResolvedValue({
      data: {
        success: true,
        data: { count: 5 }
      }
    });

    const result = await notificationService.getUnreadCount();

    expect(mockApi.get).toHaveBeenCalledWith('/notifications/unread-count');
    expect(result.data.count).toBe(5);
  });

  it('should mark notification as read', async () => {
    mockApi.put.mockResolvedValue({
      data: {
        success: true,
        data: { id: 1, is_read: true }
      }
    });

    const result = await notificationService.markAsRead(1);

    expect(mockApi.put).toHaveBeenCalledWith('/notifications/1/read');
    expect(result.success).toBe(true);
  });

  it('should mark all as read', async () => {
    mockApi.put.mockResolvedValue({
      data: {
        success: true,
        data: { count: 5 }
      }
    });

    const result = await notificationService.markAllAsRead();

    expect(mockApi.put).toHaveBeenCalledWith('/notifications/read-all');
    expect(result.success).toBe(true);
  });

  it('should delete notification', async () => {
    mockApi.delete.mockResolvedValue({
      data: {
        success: true,
        message: 'Notificação deletada com sucesso'
      }
    });

    const result = await notificationService.delete(1);

    expect(mockApi.delete).toHaveBeenCalledWith('/notifications/1');
    expect(result.success).toBe(true);
  });
});


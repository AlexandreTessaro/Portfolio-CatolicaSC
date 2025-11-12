import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import NotificationBell from '../../components/NotificationBell';
import { useAuthStore } from '../../stores/authStore';
import { useNotificationStore } from '../../stores/notificationStore';

vi.mock('../../stores/authStore');
vi.mock('../../stores/notificationStore');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn()
  };
});

describe('NotificationBell', () => {
  const mockLoadNotifications = vi.fn();
  const mockUpdateUnreadCount = vi.fn();
  const mockInitializeSocket = vi.fn();
  const mockDisconnectSocket = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      getAccessToken: vi.fn().mockReturnValue('token')
    });
    vi.mocked(useNotificationStore).mockReturnValue({
      notifications: [],
      unreadCount: 5,
      loadNotifications: mockLoadNotifications,
      updateUnreadCount: mockUpdateUnreadCount,
      markAsRead: vi.fn(),
      markAllAsRead: vi.fn(),
      deleteNotification: vi.fn(),
      initializeSocket: mockInitializeSocket,
      disconnectSocket: mockDisconnectSocket
    });
  });

  it('should render notification bell', async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );

    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    });
  });

  it('should initialize socket and load notifications', async () => {
    render(
      <BrowserRouter>
        <NotificationBell />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(mockInitializeSocket).toHaveBeenCalledWith('token');
      expect(mockLoadNotifications).toHaveBeenCalled();
      expect(mockUpdateUnreadCount).toHaveBeenCalled();
    });
  });
});


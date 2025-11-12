import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Profile from '../../pages/Profile';
import { useAuthStore } from '../../stores/authStore';

vi.mock('../../stores/authStore');
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('Profile', () => {
  const mockUser = {
    id: 1,
    name: 'Test User',
    email: 'test@example.com',
    bio: 'Test bio',
    createdAt: new Date().toISOString()
  };

  const mockUpdateProfile = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      user: mockUser,
      updateProfile: mockUpdateProfile,
      getAccessToken: vi.fn().mockReturnValue('token')
    });
  });

  it('should render profile page', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Test User' })).toBeInTheDocument();
    const emails = screen.getAllByText('test@example.com');
    expect(emails.length).toBeGreaterThan(0);
  });

  it('should display user information', () => {
    render(
      <BrowserRouter>
        <Profile />
      </BrowserRouter>
    );

    expect(screen.getByRole('heading', { name: 'Test User' })).toBeInTheDocument();
    const emails = screen.getAllByText('test@example.com');
    expect(emails.length).toBeGreaterThan(0);
    expect(screen.getByText('Test bio')).toBeInTheDocument();
  });
});


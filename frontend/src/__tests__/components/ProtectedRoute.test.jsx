import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter, Routes, Route, MemoryRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import ProtectedRoute from '../../components/ProtectedRoute';
import { useAuthStore } from '../../stores/authStore';

// Mock do Zustand store
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const TestComponent = () => <div>Protected Content</div>;
const LoginComponent = () => <div>Login Page</div>;

describe('ProtectedRoute Component', () => {
  const mockUseAuthStore = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render protected content when user is authenticated', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: { id: 1, name: 'John Doe' },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('should redirect to login when user is not authenticated', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route path="/protected" element={
            <ProtectedRoute>
              <TestComponent />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<LoginComponent />} />
        </Routes>
      </MemoryRouter>
    );

    // Assert
    expect(screen.queryByText('Protected Content')).not.toBeInTheDocument();
    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

});

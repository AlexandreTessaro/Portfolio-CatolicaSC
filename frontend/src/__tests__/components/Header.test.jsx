import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Header from '../../components/Layout/Header';

import { useAuthStore } from '../../stores/authStore';

// Mock do Zustand store
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

// Mock do serviço de API
vi.mock('../../services/apiService', () => ({
  userService: {
    logout: vi.fn(),
  },
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  const mockUseAuthStore = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render logo and navigation when not authenticated', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Header />);

    // Assert
    expect(screen.getByText('Collabra')).toBeInTheDocument();
    expect(screen.getByText('Início')).toBeInTheDocument();
    expect(screen.getByText('Projetos')).toBeInTheDocument();
    expect(screen.getByText('Usuários')).toBeInTheDocument();
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Cadastrar')).toBeInTheDocument();
  });

  it('should render user menu when authenticated', () => {
    // Arrange
    const mockUser = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    mockUseAuthStore.mockReturnValue({
      user: mockUser,
      isAuthenticated: true,
      logout: vi.fn(),
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Header />);

    // Assert
    expect(screen.getAllByText('John Doe')[0]).toBeInTheDocument();
    expect(screen.getByText('Perfil')).toBeInTheDocument();
    expect(screen.queryByText('Entrar')).not.toBeInTheDocument();
    expect(screen.queryByText('Cadastrar')).not.toBeInTheDocument();
  });

  it('should render navigation links correctly', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      logout: vi.fn(),
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Header />);

    // Assert
    const homeLink = screen.getByText('Início');
    const projectsLink = screen.getByText('Projetos');
    const usersLink = screen.getByText('Usuários');

    expect(homeLink).toHaveAttribute('href', '/dashboard');
    expect(projectsLink).toHaveAttribute('href', '/projects');
    expect(usersLink).toHaveAttribute('href', '/users');
  });
});

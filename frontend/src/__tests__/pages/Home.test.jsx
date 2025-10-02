import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Home from '../../pages/Home';
import { useAuthStore } from '../../stores/authStore';

// Mock das dependências
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Home Page', () => {
  const mockUseAuthStore = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render dashboard content correctly', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(screen.getByText('Olá, John Doe! 👋')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo de volta! Pronto para conectar ideias a talentos?')).toBeInTheDocument();
  });

  it('should render user statistics section', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(screen.getByText('Projetos Criados')).toBeInTheDocument();
    expect(screen.getByText('Colaborações')).toBeInTheDocument();
    expect(screen.getByText('Habilidades')).toBeInTheDocument();
    expect(screen.getByText('Dias na Plataforma')).toBeInTheDocument();
  });

  it('should render quick actions section', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(screen.getByText('Ações Rápidas')).toBeInTheDocument();
    expect(screen.getByText('Criar Projeto')).toBeInTheDocument();
    expect(screen.getByText('Explorar Projetos')).toBeInTheDocument();
    expect(screen.getByText('Meu Perfil')).toBeInTheDocument();
  });

  it('should have correct links in quick actions', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    const createProjectLink = screen.getByText('Criar Projeto').closest('a');
    const exploreProjectsLink = screen.getByText('Explorar Projetos').closest('a');
    const viewProfileLink = screen.getByText('Meu Perfil').closest('a');

    expect(createProjectLink).toHaveAttribute('href', '/projects/create');
    expect(exploreProjectsLink).toHaveAttribute('href', '/projects');
    expect(viewProfileLink).toHaveAttribute('href', '/profile');
  });

  it('should render with dark theme styling', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    const { container } = renderWithRouter(<Home />);

    // Assert
    const statsCards = container.querySelectorAll('.bg-gray-800\\/50');
    expect(statsCards.length).toBeGreaterThan(0);
  });

  it('should display user name in welcome message', () => {
    // Arrange
    const userName = 'Jane Smith';
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: userName,
        email: 'jane@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    expect(screen.getByText(`Olá, ${userName}! 👋`)).toBeInTheDocument();
  });

  it('should render all quick action buttons with correct icons', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    renderWithRouter(<Home />);

    // Assert
    const createProjectButton = screen.getByText('Criar Projeto').closest('a');
    const exploreProjectsButton = screen.getByText('Explorar Projetos').closest('a');
    const viewProfileButton = screen.getByText('Meu Perfil').closest('a');

    expect(createProjectButton).toBeInTheDocument();
    expect(exploreProjectsButton).toBeInTheDocument();
    expect(viewProfileButton).toBeInTheDocument();
  });

  it('should have proper responsive design classes', () => {
    // Arrange
    mockUseAuthStore.mockReturnValue({
      user: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com'
      },
      isAuthenticated: true,
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);

    // Act
    const { container } = renderWithRouter(<Home />);

    // Assert
    const gridElements = container.querySelectorAll('.grid');
    expect(gridElements.length).toBeGreaterThan(0);
    
    const responsiveElements = container.querySelectorAll('.md\\:grid-cols-2, .md\\:grid-cols-3');
    expect(responsiveElements.length).toBeGreaterThan(0);
  });
});

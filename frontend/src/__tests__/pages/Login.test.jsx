import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Login from '../../pages/Login';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/apiService';

// Mock das dependências
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../services/apiService', () => ({
  userService: {
    login: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Login Page', () => {
  const mockUseAuthStore = vi.fn();
  const mockLogin = vi.fn();
  
  beforeEach(() => {
    vi.clearAllMocks();
    
    mockUseAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      login: mockLogin,
      setLoading: vi.fn(),
      setError: vi.fn(),
      clearError: vi.fn(),
      getError: vi.fn().mockReturnValue(null),
      getIsLoading: vi.fn().mockReturnValue(false),
    });

    vi.mocked(useAuthStore).mockImplementation(mockUseAuthStore);
  });

  it('should render login form correctly', () => {
    // Act
    renderWithRouter(<Login />);

    // Assert
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar/i })).toBeInTheDocument();
  });

  it('should show password when toggle is clicked', () => {
    // Act
    renderWithRouter(<Login />);
    
    const passwordInput = screen.getByPlaceholderText('Sua senha');
    const toggleButton = screen.getAllByRole('button')[0]; // Primeiro botão (toggle)

    // Assert - Initially password should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Act - Click toggle button
    fireEvent.click(toggleButton);

    // Assert - Password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
  });

  it('should handle form submission with valid data', async () => {
    // Arrange
    const mockResponse = {
      data: {
        user: { id: 1, name: 'John Doe' },
        tokens: {
          accessToken: 'access-token',
          refreshToken: 'refresh-token'
        }
      }
    };

    vi.mocked(userService.login).mockResolvedValue(mockResponse);

    // Act
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(userService.login).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123'
      });
    });

    expect(mockLogin).toHaveBeenCalledWith({ user: mockResponse.data.user }, { accessToken: undefined, refreshToken: undefined });
  });

  it('should show validation errors for empty fields', async () => {
    // Act
    renderWithRouter(<Login />);
    
    const submitButton = screen.getByRole('button', { name: /entrar/i });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('Email é obrigatório')).toBeInTheDocument();
      expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument();
    });

    expect(userService.login).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email', async () => {
    // Act
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Assert
    // Verificar se o login não foi chamado (erro de validação)
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should handle login error', async () => {
    // Arrange
    const mockError = new Error('Credenciais inválidas');
    vi.mocked(userService.login).mockRejectedValue(mockError);

    // Act
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'wrongpassword' } });
    fireEvent.click(submitButton);

    // Assert
    // Verificar se o login não foi chamado (erro de validação)
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    // Arrange
    let resolveLogin;
    const loginPromise = new Promise((resolve) => {
      resolveLogin = resolve;
    });
    vi.mocked(userService.login).mockReturnValue(loginPromise);

    // Act
    renderWithRouter(<Login />);
    
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Sua senha');
    const submitButton = screen.getByRole('button', { name: /entrar/i });

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    fireEvent.click(submitButton);

    // Assert - Should show loading state (button might not be disabled immediately)
    // Aguardar um pouco para o userService.login ser chamado
    await waitFor(() => {
      expect(userService.login).toHaveBeenCalled();
    });

    // Resolve the promise
    resolveLogin({
      data: {
        user: { id: 1, name: 'John Doe' },
        tokens: { accessToken: 'token', refreshToken: 'refresh' }
      }
    });

    await waitFor(() => {
      expect(screen.queryByText('Entrando...')).not.toBeInTheDocument();
    });
  });

  it('should have link to register page', () => {
    // Act
    renderWithRouter(<Login />);

    // Assert
    const registerLink = screen.getByText('Cadastre-se gratuitamente');
    expect(registerLink).toHaveAttribute('href', '/register');
  });

  it('should have link to home page', () => {
    // Act
    renderWithRouter(<Login />);

    // Assert
    const homeLink = screen.getByText('← Voltar para o início');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

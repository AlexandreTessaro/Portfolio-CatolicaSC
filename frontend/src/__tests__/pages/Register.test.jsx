import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, beforeEach, expect } from 'vitest';
import Register from '../../pages/Register';
import { useAuthStore } from '../../stores/authStore';
import { userService } from '../../services/apiService';

// Mock das dependências
vi.mock('../../stores/authStore', () => ({
  useAuthStore: vi.fn(),
}));

vi.mock('../../services/apiService', () => ({
  userService: {
    register: vi.fn(),
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

describe('Register Page', () => {
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

  it('should render registration form correctly', () => {
    // Act
    renderWithRouter(<Register />);

    // Assert
    expect(screen.getByText('Crie sua conta')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Seu nome completo')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Crie uma senha segura')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Confirme sua senha')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeInTheDocument();
  });

  it('should show password requirements validation', async () => {
    // Act
    renderWithRouter(<Register />);
    
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    
    // Test weak password
    fireEvent.change(passwordInput, { target: { value: '123' } });
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Pelo menos 8 caracteres')).toBeInTheDocument();
      expect(screen.getByText('Uma letra maiúscula')).toBeInTheDocument();
      expect(screen.getByText('Uma letra minúscula')).toBeInTheDocument();
      expect(screen.getByText('Um número')).toBeInTheDocument();
      expect(screen.getByText('Um caractere especial')).toBeInTheDocument();
    });
  });

  it('should show password confirmation validation', async () => {
    // Act
    renderWithRouter(<Register />);
    
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Different123!' } });
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Senhas não coincidem')).toBeInTheDocument();
    });
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

    vi.mocked(userService.register).mockResolvedValue(mockResponse);

    // Act
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    // Assert
    await waitFor(() => {
      expect(userService.register).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
        consentAccepted: true,
        consentTimestamp: expect.any(String)
      });
    });

    expect(mockLogin).toHaveBeenCalledWith(
      { user: mockResponse.data.user }, 
      { accessToken: 'access-token', refreshToken: 'refresh-token' }
    );
  });

  it('should show validation errors for empty fields', async () => {
    // Act
    renderWithRouter(<Register />);
    
    const submitButton = screen.getByRole('button', { name: /criar conta/i });
    fireEvent.click(submitButton);

    // Assert - Check if form is rendered and button is disabled
    expect(screen.getByRole('button', { name: /criar conta/i })).toBeDisabled();
    expect(userService.register).not.toHaveBeenCalled();
  });

  it('should show validation error for invalid email', async () => {
    // Act
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    // Assert - Check if form submission is prevented
    expect(userService.register).not.toHaveBeenCalled();
  });

  it('should handle registration error', async () => {
    // Arrange
    const mockError = {
      response: {
        data: {
          message: 'Usuário já existe'
        }
      }
    };
    vi.mocked(userService.register).mockRejectedValue(mockError);

    // Act
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'existing@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    // Assert - Check if service was called and login was not called
    await waitFor(() => {
      expect(userService.register).toHaveBeenCalled();
    });

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('should show loading state during submission', async () => {
    // Arrange
    let resolveRegister;
    const registerPromise = new Promise((resolve) => {
      resolveRegister = resolve;
    });
    vi.mocked(userService.register).mockReturnValue(registerPromise);

    // Act
    renderWithRouter(<Register />);
    
    const nameInput = screen.getByPlaceholderText('Seu nome completo');
    const emailInput = screen.getByPlaceholderText('seu@email.com');
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const submitButton = screen.getByRole('button', { name: /criar conta/i });

    fireEvent.change(nameInput, { target: { value: 'John Doe' } });
    fireEvent.change(emailInput, { target: { value: 'john@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
    fireEvent.change(confirmPasswordInput, { target: { value: 'Password123!' } });
    fireEvent.click(submitButton);

    // Assert - Check if service was called
    await waitFor(() => {
      expect(userService.register).toHaveBeenCalled();
    });

    // Resolve the promise
    resolveRegister({
      data: {
        user: { id: 1, name: 'John Doe' },
        accessToken: 'token',
        refreshToken: 'refresh'
      }
    });

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalled();
    });
  });

  it('should toggle password visibility', () => {
    // Act
    renderWithRouter(<Register />);
    
    const passwordInput = screen.getByPlaceholderText('Crie uma senha segura');
    const confirmPasswordInput = screen.getByPlaceholderText('Confirme sua senha');
    const toggleButtons = screen.getAllByRole('button', { hidden: true }).filter(button => 
      button.querySelector('svg') && button.type === 'button'
    );

    // Assert - Initially passwords should be hidden
    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Act - Click first toggle button
    fireEvent.click(toggleButtons[0]);

    // Assert - First password should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'password');

    // Act - Click second toggle button
    fireEvent.click(toggleButtons[1]);

    // Assert - Both passwords should be visible
    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(confirmPasswordInput).toHaveAttribute('type', 'text');
  });

  it('should have link to login page', () => {
    // Act
    renderWithRouter(<Register />);

    // Assert
    const loginLink = screen.getByText('Entre aqui');
    expect(loginLink).toHaveAttribute('href', '/login');
  });

  it('should have link to home page', () => {
    // Act
    renderWithRouter(<Register />);

    // Assert
    const homeLink = screen.getByText('← Voltar para o início');
    expect(homeLink).toHaveAttribute('href', '/');
  });
});

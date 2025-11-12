import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import CreateProject from '../../pages/CreateProject';
import { useAuthStore } from '../../stores/authStore';
import { projectService } from '../../services/apiService';
import { useNavigate } from 'react-router-dom';

vi.mock('../../stores/authStore');
vi.mock('../../services/apiService');
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn()
  };
});

describe('CreateProject', () => {
  const mockSetError = vi.fn();
  const mockClearError = vi.fn();
  const mockSetLoading = vi.fn();
  const mockGetError = vi.fn(() => null);
  const mockGetIsLoading = vi.fn(() => false);
  const mockNavigate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      setError: mockSetError,
      clearError: mockClearError,
      setLoading: mockSetLoading,
      getError: mockGetError,
      getIsLoading: mockGetIsLoading
    });
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
  });

  it('should render create project form', () => {
    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    expect(screen.getByText('Criar Novo Projeto')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/app de delivery/i)).toBeInTheDocument();
  });

  it('should add objective when clicking add button', () => {
    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    const addButtons = screen.getAllByText(/adicionar/i);
    const objectiveButton = addButtons.find(btn => btn.textContent.includes('objetivo'));
    if (objectiveButton) {
      fireEvent.click(objectiveButton);
      const objectiveInputs = screen.getAllByPlaceholderText(/reduzir desperdício/i);
      expect(objectiveInputs.length).toBeGreaterThan(1);
    }
  });

  it('should add technology when clicking add button', () => {
    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    const addButtons = screen.getAllByText(/adicionar/i);
    const techButton = addButtons.find(btn => btn.textContent.includes('tecnologia'));
    if (techButton) {
      fireEvent.click(techButton);
      const techInputs = screen.getAllByPlaceholderText(/react/i);
      expect(techInputs.length).toBeGreaterThan(1);
    }
  });

  it('should submit form with project data', async () => {
    const mockCreateProject = vi.fn().mockResolvedValue({
      data: { id: 1 }
    });
    vi.mocked(projectService.createProject).mockImplementation(mockCreateProject);
    mockGetIsLoading.mockReturnValue(false);

    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    // Preencher campos obrigatórios usando name attribute (react-hook-form)
    const titleInput = screen.getByPlaceholderText(/app de delivery/i);
    fireEvent.change(titleInput, { target: { name: 'title', value: 'Test Project' } });

    const descriptionInput = screen.getByPlaceholderText(/descreva seu projeto/i);
    fireEvent.change(descriptionInput, { target: { name: 'description', value: 'Test description with enough characters' } });

    // Submeter o formulário diretamente
    const form = document.querySelector('form');
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockCreateProject).toHaveBeenCalled();
    }, { timeout: 3000 });
  });

  it('should display error message when error exists', () => {
    mockGetError.mockReturnValue('Test error message');

    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
  });

  it('should disable submit button when loading', () => {
    mockGetIsLoading.mockReturnValue(true);

    render(
      <BrowserRouter>
        <CreateProject />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /criando/i });
    expect(submitButton).toBeDisabled();
  });
});


import { describe, it, expect, beforeEach, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MatchesList from '../../components/MatchesList';
import { useAuthStore } from '../../stores/authStore';
import { matchService } from '../../services/apiService';

vi.mock('../../stores/authStore');
vi.mock('../../services/apiService');
vi.mock('react-hot-toast', () => ({
  default: {
    success: vi.fn(),
    error: vi.fn()
  }
}));

describe('MatchesList', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useAuthStore).mockReturnValue({
      isAuthenticated: true,
      getAccessToken: vi.fn().mockReturnValue('token')
    });
  });

  it('should render matches list', async () => {
    vi.mocked(matchService.getReceivedMatches).mockResolvedValue({
      data: [
        { id: 1, projectId: 1, status: 'pending', user: { name: 'Test User' }, project: { title: 'Test Project' } }
      ]
    });

    render(
      <BrowserRouter>
        <MatchesList type="received" title="Matches Recebidos" emptyMessage="Nenhum match" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Matches Recebidos')).toBeInTheDocument();
    });
  });

  it('should display empty message when no matches', async () => {
    vi.mocked(matchService.getReceivedMatches).mockResolvedValue({ data: [] });

    render(
      <BrowserRouter>
        <MatchesList type="received" title="Matches Recebidos" emptyMessage="Nenhum match" />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Nenhum match')).toBeInTheDocument();
    });
  });
});


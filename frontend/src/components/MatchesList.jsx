import React, { useState, useEffect } from 'react';
import { matchService } from '../services/apiService';
import ProfilePhoto from './ProfilePhoto';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const MatchCard = ({ match, type, onAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'blocked':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pendente';
      case 'accepted':
        return 'Aceito';
      case 'rejected':
        return 'Rejeitado';
      case 'blocked':
        return 'Bloqueado';
      default:
        return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {type === 'received' ? (
            <ProfilePhoto user={match.user} size="md" />
          ) : (
            <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {type === 'received' ? match.user?.name : match.project?.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(match.status)}`}>
              {getStatusText(match.status)}
            </span>
          </div>

          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {match.message}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
            <span>{formatDate(match.createdAt)}</span>
            {type === 'received' && (
              <span className="text-primary-600">
                Projeto: {match.project?.title}
              </span>
            )}
            {type === 'sent' && (
              <span className="text-primary-600">
                Para: {match.project?.title}
              </span>
            )}
          </div>

          {/* Actions */}
          {type === 'received' && match.status === 'pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onAction('accept', match.id)}
                className="px-3 py-1 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700 transition-colors"
              >
                Aceitar
              </button>
              <button
                onClick={() => onAction('reject', match.id)}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition-colors"
              >
                Rejeitar
              </button>
              <button
                onClick={() => onAction('block', match.id)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
              >
                Bloquear
              </button>
            </div>
          )}

          {type === 'sent' && match.status === 'pending' && (
            <button
              onClick={() => onAction('cancel', match.id)}
              className="px-3 py-1 bg-gray-600 text-white text-sm rounded-lg hover:bg-gray-700 transition-colors"
            >
              Cancelar Solicitação
            </button>
          )}

          {match.status === 'accepted' && (
            <div className="flex items-center text-green-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {type === 'received' ? 'Você aceitou esta solicitação' : 'Sua solicitação foi aceita!'}
            </div>
          )}

          {match.status === 'rejected' && (
            <div className="flex items-center text-red-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {type === 'received' ? 'Você rejeitou esta solicitação' : 'Sua solicitação foi rejeitada'}
            </div>
          )}

          {match.status === 'blocked' && (
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
              {type === 'received' ? 'Você bloqueou este usuário' : 'Você foi bloqueado'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const MatchesList = ({ type, title, emptyMessage }) => {
  const [matches, setMatches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { isAuthenticated, getAccessToken } = useAuthStore();

  const loadMatches = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = type === 'received' 
        ? await matchService.getReceivedMatches()
        : await matchService.getSentMatches();
      
      setMatches(response.data || []);
    } catch (error) {
      console.error(`Erro ao carregar matches ${type}:`, error);
      setError('Erro ao carregar solicitações');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAction = async (action, matchId) => {
    try {
      let response;
      
      switch (action) {
        case 'accept':
          response = await matchService.acceptMatch(matchId);
          break;
        case 'reject':
          response = await matchService.rejectMatch(matchId);
          break;
        case 'block':
          response = await matchService.blockMatch(matchId);
          break;
        case 'cancel':
          response = await matchService.cancelMatch(matchId);
          break;
        default:
          return;
      }

      toast.success(response.message || 'Ação realizada com sucesso');
      
      // Atualizar a lista
      await loadMatches();
    } catch (error) {
      console.error(`Erro ao ${action} match:`, error);
      toast.error(error.response?.data?.message || `Erro ao ${action} solicitação`);
    }
  };

  useEffect(() => {
    if (isAuthenticated && getAccessToken()) {
      loadMatches();
    }
  }, [type, isAuthenticated, getAccessToken]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">{title}</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-700">{error}</span>
          </div>
          <button
            onClick={loadMatches}
            className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      
      {matches.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-600">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {matches.map((match) => (
            <MatchCard
              key={match.id}
              match={match}
              type={type}
              onAction={handleAction}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MatchesList;

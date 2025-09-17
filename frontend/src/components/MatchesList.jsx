import React, { useState, useEffect } from 'react';
import { matchService } from '../services/apiService';
import ProfilePhoto from './ProfilePhoto';
import { useAuthStore } from '../stores/authStore';
import toast from 'react-hot-toast';

const MatchCard = ({ match, type, onAction }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30';
      case 'accepted':
        return 'bg-green-600/20 text-green-300 border border-green-500/30';
      case 'rejected':
        return 'bg-red-600/20 text-red-300 border border-red-500/30';
      case 'blocked':
        return 'bg-gray-600/20 text-gray-300 border border-gray-500/30';
      default:
        return 'bg-gray-600/20 text-gray-300 border border-gray-500/30';
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
    <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          {type === 'received' ? (
            <ProfilePhoto user={match.user} size="md" />
          ) : (
            <div className="w-12 h-12 bg-blue-600/20 rounded-full flex items-center justify-center border border-blue-500/30">
              <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-white truncate">
              {type === 'received' ? match.user?.name : match.project?.title}
            </h3>
            <span className={`px-3 py-1 text-xs font-medium rounded-lg ${getStatusColor(match.status)}`}>
              {getStatusText(match.status)}
            </span>
          </div>

          <p className="text-sm text-gray-300 mb-3 line-clamp-2">
            {match.message}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400 mb-4">
            <span>{formatDate(match.createdAt)}</span>
            {type === 'received' && (
              <span className="text-blue-400">
                Projeto: {match.project?.title}
              </span>
            )}
            {type === 'sent' && (
              <span className="text-blue-400">
                Para: {match.project?.title}
              </span>
            )}
          </div>

          {/* Actions */}
          {type === 'received' && match.status === 'pending' && (
            <div className="flex space-x-2">
              <button
                onClick={() => onAction('accept', match.id)}
                className="px-3 py-1 bg-green-600/20 hover:bg-green-600/30 text-green-300 hover:text-green-200 text-sm rounded-lg border border-green-500/30 hover:border-green-400/50 transition-all duration-200"
              >
                Aceitar
              </button>
              <button
                onClick={() => onAction('reject', match.id)}
                className="px-3 py-1 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 text-sm rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
              >
                Rejeitar
              </button>
              <button
                onClick={() => onAction('block', match.id)}
                className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 hover:text-gray-200 text-sm rounded-lg border border-gray-500/30 hover:border-gray-400/50 transition-all duration-200"
              >
                Bloquear
              </button>
            </div>
          )}

          {type === 'sent' && match.status === 'pending' && (
            <button
              onClick={() => onAction('cancel', match.id)}
              className="px-3 py-1 bg-orange-600/20 hover:bg-orange-600/30 text-orange-300 hover:text-orange-200 text-sm rounded-lg border border-orange-500/30 hover:border-orange-400/50 transition-all duration-200"
            >
              Cancelar Solicitação
            </button>
          )}

          {match.status === 'accepted' && (
            <div className="flex items-center text-green-400 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {type === 'received' ? 'Você aceitou esta solicitação' : 'Sua solicitação foi aceita!'}
            </div>
          )}

          {match.status === 'rejected' && (
            <div className="flex items-center text-red-400 text-sm">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {type === 'received' ? 'Você rejeitou esta solicitação' : 'Sua solicitação foi rejeitada'}
            </div>
          )}

          {match.status === 'blocked' && (
            <div className="flex items-center text-gray-400 text-sm">
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 animate-pulse">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-gray-700 rounded-full"></div>
                <div className="flex-1 space-y-3">
                  <div className="h-4 bg-gray-700 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-700 rounded w-full"></div>
                  <div className="h-3 bg-gray-700 rounded w-2/3"></div>
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
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-white">{title}</h2>
        <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-red-300">{error}</span>
          </div>
          <button
            onClick={loadMatches}
            className="mt-4 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 hover:text-red-200 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{title}</h2>
      
      {matches.length === 0 ? (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-8 text-center backdrop-blur-sm">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-300">{emptyMessage}</p>
        </div>
      ) : (
        <div className="space-y-6">
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

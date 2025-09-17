import React, { useState, useEffect } from 'react';
import { matchService } from '../services/apiService';
import MatchesList from '../components/MatchesList';
import { useAuthStore } from '../stores/authStore';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MatchesPage = () => {
  const [activeTab, setActiveTab] = useState('received');
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const { isAuthenticated, getAccessToken } = useAuthStore();
  const navigate = useNavigate();

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    const token = getAccessToken();
    if (!token) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, getAccessToken, navigate]);

  const loadStats = async () => {
    try {
      setIsLoadingStats(true);
      const response = await matchService.getMatchStats();
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
      // Não mostrar toast de erro para 403 (token expirado)
      if (error.response?.status !== 403) {
        toast.error('Erro ao carregar estatísticas');
      }
    } finally {
      setIsLoadingStats(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && getAccessToken()) {
      loadStats();
    }
  }, [isAuthenticated, getAccessToken]);

  const tabs = [
    {
      id: 'received',
      label: 'Recebidas',
      count: stats?.received?.total || 0,
      pending: stats?.received?.pending || 0
    },
    {
      id: 'sent',
      label: 'Enviadas',
      count: stats?.sent?.total || 0,
      pending: stats?.sent?.pending || 0
    }
  ];

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Solicitações de Participação
        </h1>
        <p className="text-xl text-gray-300">
          Gerencie as solicitações de participação em projetos e acompanhe suas próprias solicitações.
        </p>
      </div>

      {/* Stats Cards */}
      {!isLoadingStats && stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center border border-blue-500/30">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Recebidas</p>
                <p className="text-2xl font-bold text-white">{stats.received.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-600/20 rounded-lg flex items-center justify-center border border-yellow-500/30">
                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-white">{stats.received.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-600/20 rounded-lg flex items-center justify-center border border-green-500/30">
                <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Enviadas</p>
                <p className="text-2xl font-bold text-white">{stats.sent.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 transition-all duration-300">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-600/20 rounded-lg flex items-center justify-center border border-purple-500/30">
                <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Aceitas</p>
                <p className="text-2xl font-bold text-white">{stats.received.accepted + stats.sent.accepted}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-700">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 px-1 border-b-2 font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-500'
                }`}
              >
                <div className="flex items-center">
                  {tab.label}
                  {tab.pending > 0 && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-600/20 text-yellow-300 border border-yellow-500/30">
                      {tab.pending}
                    </span>
                  )}
                  <span className="ml-2 text-gray-500">({tab.count})</span>
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-8">
        {activeTab === 'received' && (
          <MatchesList
            type="received"
            title="Solicitações Recebidas"
            emptyMessage="Você ainda não recebeu nenhuma solicitação de participação em seus projetos."
          />
        )}

        {activeTab === 'sent' && (
          <MatchesList
            type="sent"
            title="Solicitações Enviadas"
            emptyMessage="Você ainda não enviou nenhuma solicitação de participação em projetos."
          />
        )}
      </div>

      {/* Help Section */}
      <div className="mt-12 bg-blue-900/20 border border-blue-500/30 rounded-xl p-8 backdrop-blur-sm">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-semibold text-blue-300 mb-4">
              Como funciona o sistema de solicitações?
            </h3>
            <div className="text-sm text-gray-300 space-y-2">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-blue-300">Solicitações Recebidas:</span> Usuários interessados em participar dos seus projetos
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-green-300">Solicitações Enviadas:</span> Suas solicitações para participar de outros projetos
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-purple-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-purple-300">Aceitar:</span> Permite que o usuário participe do projeto
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-red-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-red-300">Rejeitar:</span> Recusa a solicitação de forma educada
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0"></div>
                <div>
                  <span className="font-semibold text-orange-300">Bloquear:</span> Impede futuras solicitações deste usuário
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchesPage;

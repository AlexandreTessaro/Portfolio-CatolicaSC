import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { userService, userConnectionService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';
import ProfilePhoto from '../components/ProfilePhoto';
import toast from 'react-hot-toast';

const PublicProfile = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { user: currentUser, isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadUser = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await userService.getPublicProfile(userId);
        setUser(response.data);
      } catch (err) {
        console.error('Erro ao carregar perfil:', err);
        setError(err?.response?.data?.message || 'Usuário não encontrado');
        toast.error('Erro ao carregar perfil do usuário');
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      loadUser();
    }
  }, [userId]);

  useEffect(() => {
    const checkConnectionStatus = async () => {
      console.log('🔍 Debug - checkConnectionStatus called');
      console.log('🔍 userId:', userId);
      console.log('🔍 isAuthenticated:', isAuthenticated);
      console.log('🔍 currentUser?.id:', currentUser?.id);
      
      if (userId && isAuthenticated && currentUser?.id !== userId) {
        try {
          console.log('🔍 Making API call to get connection status...');
          const response = await userConnectionService.getConnectionStatus(userId);
          console.log('🔍 API response:', response);
          setConnectionStatus(response.data);
          console.log('🔍 Connection status set to:', response.data);
        } catch (error) {
          console.error('Erro ao verificar status de conexão:', error);
        }
      } else {
        console.log('🔍 Conditions not met for API call');
      }
    };

    // Verificar status sempre que a página carregar ou quando as dependências mudarem
    checkConnectionStatus();
  }, [userId, isAuthenticated, currentUser?.id]); // Mudado para currentUser?.id para evitar loops

  // Conectar com o usuário
  const handleConnect = async () => {
    if (!isAuthenticated) {
      toast.error('Você precisa estar logado para conectar com outros usuários');
      return;
    }

    try {
      setIsConnecting(true);
      
      const response = await userConnectionService.createConnection(userId, 'Olá! Gostaria de me conectar com você.');
      
      toast.success('Solicitação de conexão enviada com sucesso!');
      
      // Atualizar status da conexão imediatamente
      setConnectionStatus({ status: 'pending', connected: false });
      
      // Verificar status real da conexão após um pequeno delay
      setTimeout(async () => {
        try {
          const statusResponse = await userConnectionService.getConnectionStatus(userId);
          setConnectionStatus(statusResponse.data);
        } catch (error) {
          console.error('Erro ao verificar status após conexão:', error);
        }
      }, 1000);
      
    } catch (error) {
      console.error('Erro ao conectar:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar solicitação de conexão');
    } finally {
      setIsConnecting(false);
    }
  };

  const getSkillBadges = (skills) => {
    if (!skills || skills.length === 0) return null;
    
    return skills.map((skill, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg border border-gray-600 mr-2 mb-2"
      >
        {skill}
      </span>
    ));
  };

  const getSocialLinks = (socialLinks) => {
    if (!socialLinks) return null;
    
    const links = [];
    if (socialLinks.linkedin) links.push({ name: 'LinkedIn', url: socialLinks.linkedin, icon: 'linkedin', color: 'text-blue-600' });
    if (socialLinks.github) links.push({ name: 'GitHub', url: socialLinks.github, icon: 'github', color: 'text-gray-800' });
    if (socialLinks.twitter) links.push({ name: 'Twitter', url: socialLinks.twitter, icon: 'twitter', color: 'text-blue-400' });
    if (socialLinks.website) links.push({ name: 'Website', url: socialLinks.website, icon: 'globe', color: 'text-green-600' });
    
    return links.map((link, index) => (
      <a
        key={index}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`${link.color} hover:opacity-80 transition-opacity flex items-center space-x-2 p-3 rounded-lg border hover:bg-gray-50`}
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          {link.icon === 'linkedin' && (
            <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C20 1.581 19.402 1 18.668 1z" clipRule="evenodd" />
          )}
          {link.icon === 'github' && (
            <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
          )}
          {link.icon === 'twitter' && (
            <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
          )}
          {link.icon === 'globe' && (
            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
          )}
        </svg>
        <span className="font-medium">{link.name}</span>
      </a>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-500/50">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Usuário não encontrado</h2>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <Link
            to="/users"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10">Voltar para Usuários</span>
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <ProfilePhoto user={user} size="2xl" />
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">
                  {user.name}
                </h1>
                <p className="text-gray-300 mb-2">{user.email}</p>
                <div className="flex items-center space-x-4">
                  {user.isVerified && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-300 border border-green-500/30">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </span>
                  )}
                  <span className="text-sm text-gray-400">
                    Membro desde {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              {isAuthenticated && currentUser?.id !== user.id && (
                <button 
                  onClick={() => {
                    console.log('🔍 Button clicked - current connectionStatus:', connectionStatus);
                    handleConnect();
                  }}
                  disabled={isConnecting}
                  className={`px-6 py-3 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                    isConnecting
                      ? 'bg-gray-600 text-gray-300 cursor-not-allowed'
                      : connectionStatus?.status === 'pending'
                      ? 'bg-gradient-to-r from-yellow-600 to-orange-600 hover:from-yellow-700 hover:to-orange-700 text-white hover:shadow-yellow-500/25'
                      : connectionStatus?.status === 'accepted'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white hover:shadow-blue-500/25'
                      : connectionStatus?.status === 'rejected'
                      ? 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white hover:shadow-red-500/25'
                      : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white hover:shadow-green-500/25'
                  }`}
                >
                  {isConnecting ? (
                    <div className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Conectando...
                    </div>
                  ) : connectionStatus?.status === 'pending' ? (
                    'Solicitado'
                  ) : connectionStatus?.status === 'accepted' ? (
                    'Conectado'
                  ) : connectionStatus?.status === 'rejected' ? (
                    'Rejeitado'
                  ) : (
                    'Conectar'
                  )}
                </button>
              )}
              <Link
                to="/users"
                className="border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-6 py-3 rounded-lg font-medium transition-all duration-300"
              >
                Voltar
              </Link>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio */}
            {user.bio && (
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sobre
                </h2>
                <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">
                  {user.bio}
                </p>
              </div>
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Habilidades
                </h2>
                <div className="flex flex-wrap gap-2">
                  {getSkillBadges(user.skills)}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Social Links */}
            {user.socialLinks && (
              <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                  </svg>
                  Redes Sociais
                </h2>
                <div className="space-y-3">
                  {getSocialLinks(user.socialLinks)}
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Estatísticas
              </h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Habilidades</span>
                  <span className="font-bold text-white text-lg">{user.skills?.length || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Membro há</span>
                  <span className="font-bold text-white text-lg">
                    {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))} dias
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Status</span>
                  <span className="font-bold text-green-400 text-lg">Ativo</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublicProfile;

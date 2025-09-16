import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';

const Home = () => {
  const { isAuthenticated, user } = useAuthStore();

  return (
    <div className="py-8">
      {/* Welcome Section */}
      <div className="text-center mb-12">
        {isAuthenticated && user ? (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Olá, {user.name}! 👋
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Bem-vindo de volta! Pronto para conectar ideias a talentos?
            </p>
          </>
        ) : (
          <>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Conecte Ideias a Talentos
            </h1>
            <p className="text-xl mb-8 text-gray-300 max-w-2xl mx-auto">
              A plataforma que une empreendedores e profissionais para criar startups incríveis.
            </p>
          </>
        )}
      </div>

      {/* User Stats Section - Only for authenticated users */}
      {isAuthenticated && user && (
        <div className="mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-blue-500/30">
                  <svg className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">0</h3>
                <p className="text-gray-300">Projetos Criados</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                  <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">0</h3>
                <p className="text-gray-300">Colaborações</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-purple-500/30">
                  <svg className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">{user.skills?.length || 0}</h3>
                <p className="text-gray-300">Habilidades</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-orange-500/30">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">
                  {Math.floor((new Date() - new Date(user.createdAt)) / (1000 * 60 * 60 * 24))}
                </h3>
                <p className="text-gray-300">Dias na Plataforma</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Actions Section - Only for authenticated users */}
      {isAuthenticated && user && (
        <div className="mb-12">
          <div className="max-w-6xl mx-auto px-4">
            <h2 className="text-3xl font-bold text-white mb-12 text-center">
              Ações Rápidas
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <Link
                to="/projects/create"
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 hover:border-blue-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center group-hover:bg-blue-500/30 transition-all duration-200 border border-blue-500/30">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Criar Projeto</h3>
                    <p className="text-gray-400 text-sm">Inicie um novo projeto e encontre colaboradores</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/projects"
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 hover:border-green-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center group-hover:bg-green-500/30 transition-all duration-200 border border-green-500/30">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Explorar Projetos</h3>
                    <p className="text-gray-400 text-sm">Descubra projetos interessantes para colaborar</p>
                  </div>
                </div>
              </Link>

              <Link
                to="/profile"
                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8 hover:border-purple-500/50 hover:bg-gray-800/70 transition-all duration-300 group"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center group-hover:bg-purple-500/30 transition-all duration-200 border border-purple-500/30">
                    <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">Meu Perfil</h3>
                    <p className="text-gray-400 text-sm">Atualize suas informações e habilidades</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
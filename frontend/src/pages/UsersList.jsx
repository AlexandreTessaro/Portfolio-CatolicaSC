import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { userService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';
import ProfilePhoto from '../components/ProfilePhoto';
import toast from 'react-hot-toast';

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    skills: '',
    search: '',
    sortBy: 'newest'
  });
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [currentOffset, setCurrentOffset] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);

  const { isAuthenticated, user: currentUser } = useAuthStore();

  const loadInitialUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Carregar primeiros 6 usuários
      const response = await userService.searchUsers({
        ...filters,
        limit: 6,
        offset: 0
      });
      
      const usersData = response.data || [];
      setUsers(usersData);
      setCurrentOffset(6);
      setTotalUsers(response.count || usersData.length);
      // Se retornou exatamente 6 usuários, provavelmente há mais
      setHasMoreUsers(usersData.length === 6);
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar usuários');
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadMoreUsers = async () => {
    try {
      setLoadingMore(true);
      setError(null);
      
      const response = await userService.searchUsers({
        ...filters,
        limit: 6,
        offset: currentOffset
      });
      
      const newUsers = response.data || [];
      console.log('🔍 Debug - loadMoreUsers:', {
        newUsersLength: newUsers.length,
        currentUsersLength: users.length,
        willHaveMore: newUsers.length === 6
      });
      setUsers(prevUsers => [...prevUsers, ...newUsers]);
      setCurrentOffset(prevOffset => prevOffset + 6);
      // Se retornou menos de 6 usuários, não há mais
      setHasMoreUsers(newUsers.length === 6);
    } catch (err) {
      console.error('Erro ao carregar mais usuários:', err);
      setError(err?.response?.data?.message || 'Erro ao carregar usuários');
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoadingMore(false);
    }
  };

  const searchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await userService.searchUsers({
        ...filters,
        limit: 6,
        offset: 0
      });
      
      const usersData = response.data || [];
      setUsers(usersData);
      setCurrentOffset(6);
      setTotalUsers(response.count || usersData.length);
      // Se retornou exatamente 6 usuários, provavelmente há mais
      setHasMoreUsers(usersData.length === 6);
    } catch (err) {
      console.error('Erro ao buscar usuários:', err);
      setError(err?.response?.data?.message || 'Erro ao buscar usuários');
      toast.error('Erro ao buscar usuários');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialUsers();
  }, []);


  const handleSearch = (e) => {
    e.preventDefault();
    searchUsers();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleLoadMore = () => {
    loadMoreUsers();
  };

  const clearFilters = () => {
    setFilters({
      skills: '',
      search: '',
      sortBy: 'newest'
    });
    loadInitialUsers();
  };

  const hasActiveFilters = () => {
    return filters.search.trim() !== '' || filters.skills.trim() !== '' || filters.sortBy !== 'newest';
  };


  const getSkillBadges = (skills) => {
    if (!skills || skills.length === 0) return null;
    
    return skills.slice(0, 3).map((skill, index) => (
      <span
        key={index}
        className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg border border-gray-600"
      >
        {skill}
      </span>
    ));
  };

  const getSocialLinks = (socialLinks) => {
    if (!socialLinks) return null;
    
    const links = [];
    if (socialLinks.linkedin) links.push({ name: 'LinkedIn', url: socialLinks.linkedin, icon: 'linkedin' });
    if (socialLinks.github) links.push({ name: 'GitHub', url: socialLinks.github, icon: 'github' });
    if (socialLinks.twitter) links.push({ name: 'Twitter', url: socialLinks.twitter, icon: 'twitter' });
    if (socialLinks.website) links.push({ name: 'Website', url: socialLinks.website, icon: 'globe' });
    
    return links.slice(0, 2).map((link, index) => (
      <a
        key={index}
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 hover:text-blue-400 transition-colors"
        title={link.name}
      >
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
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
      </a>
    ));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando usuários...</p>
        </div>
      </div>
    );
  }



  return (
    <div className="py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Usuários</h1>
          <p className="text-xl text-gray-300">Descubra talentos incríveis e conecte-se com desenvolvedores</p>
        </div>
        <div className="text-lg text-gray-400 flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          {users.length} de {totalUsers} usuário{totalUsers !== 1 ? 's' : ''} carregado{users.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
        <form onSubmit={handleSearch} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Search */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Buscar por nome
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Digite o nome do usuário..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Skills Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Filtrar por habilidades
              </label>
              <input
                type="text"
                value={filters.skills}
                onChange={(e) => handleFilterChange('skills', e.target.value)}
                placeholder="Ex: JavaScript, React, Python..."
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Sort */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Ordenar por
              </label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Mais recentes</option>
                <option value="oldest">Mais antigos</option>
                <option value="name">Nome A-Z</option>
                <option value="skills">Mais habilidades</option>
              </select>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div className="flex space-x-4">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25"
              >
                Buscar
              </button>
              {hasActiveFilters() && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="px-6 py-3 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-lg transition-all duration-300"
                >
                  Limpar Filtros
                </button>
              )}
            </div>
          </div>
        </form>
      </div>

      {/* Users Grid */}
      {error ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-500/50">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Erro ao carregar usuários</h3>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <button
            onClick={loadInitialUsers}
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10">Tentar novamente</span>
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Nenhum usuário encontrado</h3>
          <p className="text-gray-300 text-lg">Tente ajustar os filtros de busca</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {users.map((user) => (
            <div key={user.id} className="group bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:bg-gray-800/50 hover:border-gray-600 transition-all duration-300 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/10">
              {/* User Header */}
              <div className="flex items-center space-x-4 mb-6">
                <ProfilePhoto user={user} size="lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl font-bold text-white truncate group-hover:text-blue-300 transition-colors">
                    {user.name}
                  </h3>
                  <p className="text-sm text-gray-400 truncate">
                    {user.email}
                  </p>
                  {user.isVerified && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-600/20 text-green-300 mt-2 border border-green-500/30">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      Verificado
                    </span>
                  )}
                </div>
              </div>

              {/* Bio */}
              {user.bio && (
                <p className="text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed">
                  {user.bio}
                </p>
              )}

              {/* Skills */}
              {user.skills && user.skills.length > 0 && (
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    {getSkillBadges(user.skills)}
                    {user.skills.length > 3 && (
                      <span className="px-3 py-1 bg-gray-700/50 text-gray-300 text-xs rounded-lg border border-gray-600">
                        +{user.skills.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              )}

              {/* Social Links */}
              {user.socialLinks && (
                <div className="flex items-center space-x-3 mb-6">
                  {getSocialLinks(user.socialLinks)}
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-between items-center">
                <Link
                  to={`/users/${user.id}`}
                  className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors flex items-center group-hover:translate-x-1 transform duration-200"
                >
                  Ver Perfil
                  <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Load More Button */}
      {console.log('🔍 Debug - Button render:', { hasMoreUsers, usersLength: users.length })}
      {hasMoreUsers && (
        <div className="flex justify-end mt-8">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className={`px-8 py-4 font-semibold rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              loadingMore 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-purple-500/25'
            }`}
          >
            {loadingMore ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Carregando...
              </div>
            ) : (
              'Carregar Mais Usuários'
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default UsersList;
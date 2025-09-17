import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectService, userService, matchService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';
import RequestParticipationModal from '../components/RequestParticipationModal';
import toast from 'react-hot-toast';

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [joining, setJoining] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [canRequestParticipation, setCanRequestParticipation] = useState({ canRequest: false });

  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    loadProject();
    if (isAuthenticated && projectId) {
      checkCanRequestParticipation();
    }
  }, [projectId, isAuthenticated]);

  const loadProject = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await projectService.getProject(projectId);
      setProject(response.data);
      
      // Load creator info
      if (response.data.creatorId) {
        try {
          const creatorResponse = await userService.getPublicProfile(response.data.creatorId);
          setCreator(creatorResponse.data);
        } catch (err) {
          console.warn('Could not load creator info:', err);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao carregar projeto');
    } finally {
      setLoading(false);
    }
  };

  const checkCanRequestParticipation = async () => {
    if (!isAuthenticated || !projectId) return;
    
    try {
      const response = await matchService.canRequestParticipation(projectId);
      setCanRequestParticipation(response.data);
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      setCanRequestParticipation({ canRequest: false });
    }
  };

  const handleJoinProject = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (canRequestParticipation.canRequest) {
      setShowRequestModal(true);
    } else {
      toast.error(canRequestParticipation.reason || 'Não é possível solicitar participação neste projeto');
    }
  };

  const handleRequestSuccess = () => {
    checkCanRequestParticipation();
    toast.success('Solicitação enviada com sucesso!');
  };

  const handleEditProject = () => {
    navigate(`/projects/${projectId}/edit`);
  };

  const handleDeleteProject = async () => {
    if (!confirm('Tem certeza que deseja excluir este projeto?')) return;

    try {
      await projectService.deleteProject(projectId);
      navigate('/projects');
    } catch (err) {
      alert('Erro ao excluir projeto: ' + (err?.response?.data?.message || 'Erro desconhecido'));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      idea: 'bg-gray-600/50 text-gray-300 border border-gray-500',
      planning: 'bg-blue-600/50 text-blue-300 border border-blue-500',
      development: 'bg-yellow-600/50 text-yellow-300 border border-yellow-500',
      testing: 'bg-orange-600/50 text-orange-300 border border-orange-500',
      launched: 'bg-green-600/50 text-green-300 border border-green-500'
    };
    return colors[status] || 'bg-gray-600/50 text-gray-300 border border-gray-500';
  };

  const getStatusLabel = (status) => {
    const labels = {
      idea: 'Ideia',
      planning: 'Planejamento',
      development: 'Desenvolvimento',
      testing: 'Testes',
      launched: 'Lançado'
    };
    return labels[status] || status;
  };

  const isOwner = user && project && user.id === project.creatorId;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-300">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm border border-red-500/50">
            <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">Erro ao carregar projeto</h3>
          <p className="text-gray-300 mb-8 text-lg">{error}</p>
          <Link
            to="/projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10">Voltar para projetos</span>
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="text-center">
          <h3 className="text-2xl font-bold text-white mb-8">Projeto não encontrado</h3>
          <Link
            to="/projects"
            className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
          >
            <span className="relative z-10">Voltar para projetos</span>
            <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      {/* Header */}
      <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8 mb-8">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                {getStatusLabel(project.status)}
              </span>
              <span className="text-sm text-gray-400 flex items-center">
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{project.title}</h1>
            {creator && (
              <p className="text-xl text-gray-300 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Criado por <Link to={`/users/${creator.id}`} className="text-blue-400 hover:text-blue-300 transition-colors ml-1">{creator.name}</Link>
              </p>
            )}
          </div>
          
          <div className="flex space-x-4">
            {isOwner ? (
              <>
                <button
                  onClick={handleEditProject}
                  className="px-6 py-3 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
                >
                  Editar
                </button>
                <button
                  onClick={handleDeleteProject}
                  className="px-6 py-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 font-semibold rounded-xl border border-red-500/30 hover:border-red-400/50 transition-all duration-300"
                >
                  Excluir
                </button>
              </>
            ) : (
              <button
                onClick={handleJoinProject}
                disabled={joining || !canRequestParticipation.canRequest}
                className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                  canRequestParticipation.canRequest 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/25' 
                    : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                }`}
              >
                {joining ? (
                  <div className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Participando...
                  </div>
                ) : (
                  canRequestParticipation.canRequest ? 'Solicitar Participação' : 'Não Disponível'
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Description */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Descrição
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap leading-relaxed">{project.description}</p>
          </div>

          {/* Objectives */}
          {project.objectives && project.objectives.length > 0 && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Objetivos
              </h2>
              <ul className="space-y-4">
                {project.objectives.map((objective, index) => (
                  <li key={index} className="flex items-start space-x-4">
                    <div className="w-3 h-3 bg-green-400 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-300 leading-relaxed">{objective}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Technologies */}
          {project.technologies && project.technologies.length > 0 && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                Tecnologias
              </h2>
              <div className="flex flex-wrap gap-3">
                {project.technologies.map((tech, index) => (
                  <span
                    key={index}
                    className="px-4 py-2 bg-purple-600/20 text-purple-300 text-sm rounded-lg border border-purple-500/30"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Images */}
          {project.images && project.images.length > 0 && (
            <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                <svg className="w-6 h-6 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Imagens
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {project.images.map((image, index) => (
                  <div key={index} className="group relative overflow-hidden rounded-xl border border-gray-600">
                    <img
                      src={image}
                      alt={`Imagem ${index + 1} do projeto`}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Team */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-cyan-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              Equipe
            </h3>
            {project.teamMembers && project.teamMembers.length > 0 ? (
              <div className="space-y-4">
                {project.teamMembers.map((member) => (
                  <Link
                    key={member.id}
                    to={`/users/${member.id}`}
                    className="group flex items-center space-x-4 hover:bg-gray-700/30 p-3 rounded-lg transition-all duration-200"
                  >
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center overflow-hidden border border-gray-600">
                      {member.profileImage ? (
                        <img
                          src={member.profileImage}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-lg font-medium text-gray-300">
                          {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                        </span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-semibold text-white truncate group-hover:text-cyan-300 transition-colors">
                        {member.name || 'Membro'}
                      </p>
                      {member.bio && (
                        <p className="text-sm text-gray-400 truncate">
                          {member.bio}
                        </p>
                      )}
                    </div>
                    <svg className="w-5 h-5 text-gray-400 group-hover:text-cyan-300 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-gray-400">Nenhum membro da equipe ainda.</p>
              </div>
            )}
          </div>

          {/* Project Info */}
          <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
              <svg className="w-6 h-6 mr-3 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informações
            </h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-sm font-medium text-gray-400">Categoria</span>
                <span className="text-white capitalize">{project.category || 'Não especificada'}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-sm font-medium text-gray-400">Status</span>
                <span className="text-white">{getStatusLabel(project.status)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-600">
                <span className="text-sm font-medium text-gray-400">Membros</span>
                <span className="text-white">{project.teamMembers?.length || 0}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-sm font-medium text-gray-400">Última atualização</span>
                <span className="text-white">{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Request Participation Modal */}
      <RequestParticipationModal
        isOpen={showRequestModal}
        onClose={() => setShowRequestModal(false)}
        project={project}
        onSuccess={handleRequestSuccess}
      />
    </div>
  );
};

export default ProjectDetails;

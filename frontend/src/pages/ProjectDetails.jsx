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
      idea: 'bg-gray-100 text-gray-800',
      planning: 'bg-blue-100 text-blue-800',
      development: 'bg-yellow-100 text-yellow-800',
      testing: 'bg-orange-100 text-orange-800',
      launched: 'bg-green-100 text-green-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
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
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando projeto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar projeto</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Link
            to="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voltar para projetos
          </Link>
        </div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Projeto não encontrado</h3>
          <Link
            to="/projects"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Voltar para projetos
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                  {getStatusLabel(project.status)}
                </span>
                <span className="text-sm text-gray-500">
                  Criado em {new Date(project.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              {creator && (
                <p className="text-gray-600">
                  Criado por <Link to={`/users/${creator.id}`} className="text-blue-600 hover:underline">{creator.name}</Link>
                </p>
              )}
            </div>
            
            <div className="flex space-x-3">
              {isOwner ? (
                <>
                  <button
                    onClick={handleEditProject}
                    className="btn-outline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={handleDeleteProject}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    Excluir
                  </button>
                </>
              ) : (
                <button
                  onClick={handleJoinProject}
                  disabled={joining || !canRequestParticipation.canRequest}
                  className={`btn-primary ${!canRequestParticipation.canRequest ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {joining ? 'Participando...' : 
                   canRequestParticipation.canRequest ? 'Solicitar Participação' : 
                   'Não Disponível'}
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Descrição</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            </div>

            {/* Objectives */}
            {project.objectives && project.objectives.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Objetivos</h2>
                <ul className="space-y-2">
                  {project.objectives.map((objective, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-gray-700">{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Technologies */}
            {project.technologies && project.technologies.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Tecnologias</h2>
                <div className="flex flex-wrap gap-2">
                  {project.technologies.map((tech, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Images */}
            {project.images && project.images.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Imagens</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {project.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Imagem ${index + 1} do projeto`}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Team */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Equipe</h3>
              {project.teamMembers && project.teamMembers.length > 0 ? (
                <div className="space-y-3">
                  {project.teamMembers.map((member) => (
                    <Link
                      key={member.id}
                      to={`/users/${member.id}`}
                      className="flex items-center space-x-3 hover:bg-gray-50 p-2 rounded-lg transition-colors"
                    >
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                        {member.profileImage ? (
                          <img
                            src={member.profileImage}
                            alt={member.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-sm font-medium text-gray-600">
                            {member.name ? member.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {member.name || 'Membro'}
                        </p>
                        {member.bio && (
                          <p className="text-xs text-gray-500 truncate">
                            {member.bio}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Nenhum membro da equipe ainda.</p>
              )}
            </div>

            {/* Project Info */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Informações</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoria</span>
                  <p className="text-gray-900 capitalize">{project.category || 'Não especificada'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Status</span>
                  <p className="text-gray-900">{getStatusLabel(project.status)}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Membros</span>
                  <p className="text-gray-900">{project.teamMembers?.length || 0}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Última atualização</span>
                  <p className="text-gray-900">{new Date(project.updatedAt).toLocaleDateString('pt-BR')}</p>
                </div>
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

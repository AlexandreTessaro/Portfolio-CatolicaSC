import React, { useState } from 'react';
import { matchService } from '../services/apiService';
import toast from 'react-hot-toast';

const RequestParticipationModal = ({ 
  isOpen, 
  onClose, 
  project, 
  onSuccess 
}) => {
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!message.trim()) {
      toast.error('Por favor, escreva uma mensagem');
      return;
    }

    if (message.length < 10) {
      toast.error('A mensagem deve ter pelo menos 10 caracteres');
      return;
    }

    if (message.length > 500) {
      toast.error('A mensagem deve ter no máximo 500 caracteres');
      return;
    }

    setIsLoading(true);
    
    try {
      await matchService.createMatch(project.id, message);
      toast.success('Solicitação enviada com sucesso!');
      setMessage('');
      onSuccess?.();
      onClose();
    } catch (error) {
      console.error('Erro ao enviar solicitação:', error);
      toast.error(error.response?.data?.message || 'Erro ao enviar solicitação');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMessage('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Solicitar Participação
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Project Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                >
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="px-2 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem de Apresentação *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte um pouco sobre você, suas habilidades e por que gostaria de participar deste projeto..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                rows={4}
                maxLength={500}
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Mínimo 10 caracteres
                </p>
                <span className={`text-xs ${message.length > 450 ? 'text-red-500' : 'text-gray-500'}`}>
                  {message.length}/500
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || message.length < 10}
              >
                {isLoading ? 'Enviando...' : 'Enviar Solicitação'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestParticipationModal;

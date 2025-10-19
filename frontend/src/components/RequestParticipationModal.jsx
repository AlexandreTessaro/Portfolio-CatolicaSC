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
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-[9990] p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto transform transition-all duration-300 ease-out">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">
              Solicitar Participação
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Project Info */}
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <h3 className="font-bold text-gray-900 mb-3 text-lg">{project.title}</h3>
            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
              {project.description}
            </p>
            <div className="flex flex-wrap gap-2">
              {project.technologies?.slice(0, 3).map((tech, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full border border-blue-200"
                >
                  {tech}
                </span>
              ))}
              {project.technologies?.length > 3 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm font-medium rounded-full border border-gray-200">
                  +{project.technologies.length - 3}
                </span>
              )}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                Mensagem de Apresentação *
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Conte um pouco sobre você, suas habilidades e por que gostaria de participar deste projeto..."
                className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none transition-all duration-200 text-gray-900 placeholder-gray-500 bg-white font-sans"
                rows={5}
                maxLength={500}
                required
                style={{ 
                  minHeight: '120px',
                  color: '#111827',
                  fontSize: '14px',
                  lineHeight: '1.5'
                }}
              />
              <div className="flex justify-between items-center mt-2">
                <p className="text-xs text-gray-600 font-medium">
                  Mínimo 10 caracteres
                </p>
                <span className={`text-xs font-medium ${message.length > 450 ? 'text-red-500' : message.length > 400 ? 'text-orange-500' : 'text-gray-500'}`}>
                  {message.length}/500
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex space-x-4 pt-6">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                disabled={isLoading || message.length < 10}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando...
                  </div>
                ) : (
                  'Enviar Solicitação'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RequestParticipationModal;

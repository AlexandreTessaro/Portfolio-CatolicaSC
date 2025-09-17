import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { projectService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';

const CreateProject = () => {
  const navigate = useNavigate();
  const { setError, clearError, getError, setLoading, getIsLoading } = useAuthStore();
  const { register, handleSubmit } = useForm();
  
  const [objectives, setObjectives] = useState(['']);
  const [technologies, setTechnologies] = useState(['']);
  const [images, setImages] = useState(['']);

  const onSubmit = async (data) => {
    clearError();
    setLoading(true);
    
    try {
      const projectData = {
        ...data,
        objectives: objectives.filter(obj => obj.trim()),
        technologies: technologies.filter(tech => tech.trim()),
        images: images.filter(img => img.trim()),
        status: data.status || 'idea',
        category: data.category || 'general'
      };

      const response = await projectService.createProject(projectData);
      navigate(`/projects/${response.data.id}`);
    } catch (err) {
      setError(err?.response?.data?.message || 'Erro ao criar projeto');
    } finally {
      setLoading(false);
    }
  };

  const addObjective = () => {
    setObjectives([...objectives, '']);
  };

  const removeObjective = (index) => {
    if (objectives.length > 1) {
      setObjectives(objectives.filter((_, i) => i !== index));
    }
  };

  const updateObjective = (index, value) => {
    const newObjectives = [...objectives];
    newObjectives[index] = value;
    setObjectives(newObjectives);
  };

  const addTechnology = () => {
    setTechnologies([...technologies, '']);
  };

  const removeTechnology = (index) => {
    if (technologies.length > 1) {
      setTechnologies(technologies.filter((_, i) => i !== index));
    }
  };

  const updateTechnology = (index, value) => {
    const newTechnologies = [...technologies];
    newTechnologies[index] = value;
    setTechnologies(newTechnologies);
  };

  const addImage = () => {
    setImages([...images, '']);
  };

  const removeImage = (index) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index));
    }
  };

  const updateImage = (index, value) => {
    const newImages = [...images];
    newImages[index] = value;
    setImages(newImages);
  };

  return (
    <div className="py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Criar Novo Projeto</h1>
        <p className="text-xl text-gray-300">Compartilhe sua ideia e encontre colaboradores</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        {/* Basic Info */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-white mb-8 flex items-center">
            <svg className="w-6 h-6 mr-3 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Informações Básicas
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Título do Projeto *
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Ex: App de Delivery Sustentável"
                {...register('title', { required: true, minLength: 3 })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Status
              </label>
              <select 
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...register('status')}
              >
                <option value="idea">Ideia</option>
                <option value="planning">Planejamento</option>
                <option value="development">Desenvolvimento</option>
                <option value="testing">Testes</option>
                <option value="launched">Lançado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Categoria
              </label>
              <select 
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                {...register('category')}
              >
                <option value="general">Geral</option>
                <option value="web">Web</option>
                <option value="mobile">Mobile</option>
                <option value="desktop">Desktop</option>
                <option value="ai">IA/ML</option>
                <option value="blockchain">Blockchain</option>
                <option value="iot">IoT</option>
                <option value="other">Outros</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-3">
                Descrição *
              </label>
              <textarea
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={4}
                placeholder="Descreva seu projeto, sua visão e o que você espera alcançar..."
                {...register('description', { required: true, minLength: 10 })}
              />
            </div>
          </div>
        </div>

        {/* Objectives */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Objetivos
            </h2>
            <button
              type="button"
              onClick={addObjective}
              className="group flex items-center px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 hover:text-blue-300 text-sm font-medium rounded-lg border border-blue-500/30 hover:border-blue-400/50 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar objetivo
            </button>
          </div>
          
          <div className="space-y-4">
            {objectives.map((objective, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ex: Reduzir desperdício de alimentos em 30%"
                  value={objective}
                  onChange={(e) => updateObjective(index, e.target.value)}
                />
                {objectives.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeObjective(index)}
                    className="flex items-center justify-center w-12 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Technologies */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Tecnologias
            </h2>
            <button
              type="button"
              onClick={addTechnology}
              className="group flex items-center px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 text-purple-400 hover:text-purple-300 text-sm font-medium rounded-lg border border-purple-500/30 hover:border-purple-400/50 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar tecnologia
            </button>
          </div>
          
          <div className="space-y-4">
            {technologies.map((technology, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  placeholder="Ex: React, Node.js, PostgreSQL"
                  value={technology}
                  onChange={(e) => updateTechnology(index, e.target.value)}
                />
                {technologies.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTechnology(index)}
                    className="flex items-center justify-center w-12 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Images */}
        <div className="bg-gray-800/30 backdrop-blur-sm border border-gray-700 rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <svg className="w-6 h-6 mr-3 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Imagens
            </h2>
            <button
              type="button"
              onClick={addImage}
              className="group flex items-center px-4 py-2 bg-orange-600/20 hover:bg-orange-600/30 text-orange-400 hover:text-orange-300 text-sm font-medium rounded-lg border border-orange-500/30 hover:border-orange-400/50 transition-all duration-200"
            >
              <svg className="w-4 h-4 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Adicionar imagem
            </button>
          </div>
          
          <div className="space-y-4">
            {images.map((image, index) => (
              <div key={index} className="flex space-x-3">
                <input
                  type="url"
                  className="flex-1 px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200"
                  placeholder="https://exemplo.com/imagem.jpg"
                  value={image}
                  onChange={(e) => updateImage(index, e.target.value)}
                />
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="flex items-center justify-center w-12 h-12 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-200"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-400 mt-4 flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cole URLs de imagens para mostrar seu projeto
          </p>
        </div>

        {/* Error */}
        {getError() && (
          <div className="bg-red-900/20 border border-red-500/50 rounded-xl p-6 backdrop-blur-sm">
            <div className="flex items-center">
              <svg className="w-6 h-6 text-red-400 mr-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-300 text-lg">{getError()}</p>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-end space-y-4 sm:space-y-0 sm:space-x-6">
          <button
            type="button"
            onClick={() => navigate('/projects')}
            className="px-8 py-4 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-semibold rounded-xl transition-all duration-300"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={getIsLoading()}
            className={`px-8 py-4 font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              getIsLoading() 
                ? 'bg-gray-600 text-gray-300 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/25'
            }`}
          >
            {getIsLoading() ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Criando...
              </div>
            ) : (
              <div className="flex items-center">
                <span>Criar Projeto</span>
                <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProject;

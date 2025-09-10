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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Criar Novo Projeto</h1>
          <p className="text-gray-600 mt-2">Compartilhe sua ideia e encontre colaboradores</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Informações Básicas</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título do Projeto *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Ex: App de Delivery Sustentável"
                  {...register('title', { required: true, minLength: 3 })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select className="input-field" {...register('status')}>
                  <option value="idea">Ideia</option>
                  <option value="planning">Planejamento</option>
                  <option value="development">Desenvolvimento</option>
                  <option value="testing">Testes</option>
                  <option value="launched">Lançado</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoria
                </label>
                <select className="input-field" {...register('category')}>
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
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descrição *
                </label>
                <textarea
                  className="input-field"
                  rows={4}
                  placeholder="Descreva seu projeto, sua visão e o que você espera alcançar..."
                  {...register('description', { required: true, minLength: 10 })}
                />
              </div>
            </div>
          </div>

          {/* Objectives */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Objetivos</h2>
              <button
                type="button"
                onClick={addObjective}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Adicionar objetivo
              </button>
            </div>
            
            <div className="space-y-3">
              {objectives.map((objective, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    className="flex-1 input-field"
                    placeholder="Ex: Reduzir desperdício de alimentos em 30%"
                    value={objective}
                    onChange={(e) => updateObjective(index, e.target.value)}
                  />
                  {objectives.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeObjective(index)}
                      className="text-red-600 hover:text-red-800 px-3 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Technologies */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Tecnologias</h2>
              <button
                type="button"
                onClick={addTechnology}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Adicionar tecnologia
              </button>
            </div>
            
            <div className="space-y-3">
              {technologies.map((technology, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    className="flex-1 input-field"
                    placeholder="Ex: React, Node.js, PostgreSQL"
                    value={technology}
                    onChange={(e) => updateTechnology(index, e.target.value)}
                  />
                  {technologies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTechnology(index)}
                      className="text-red-600 hover:text-red-800 px-3 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Imagens</h2>
              <button
                type="button"
                onClick={addImage}
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                + Adicionar imagem
              </button>
            </div>
            
            <div className="space-y-3">
              {images.map((image, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="url"
                    className="flex-1 input-field"
                    placeholder="https://exemplo.com/imagem.jpg"
                    value={image}
                    onChange={(e) => updateImage(index, e.target.value)}
                  />
                  {images.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="text-red-600 hover:text-red-800 px-3 py-2"
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Cole URLs de imagens para mostrar seu projeto
            </p>
          </div>

          {/* Error */}
          {getError() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800">{getError()}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/projects')}
              className="btn-secondary"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={getIsLoading()}
              className="btn-primary"
            >
              {getIsLoading() ? 'Criando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;

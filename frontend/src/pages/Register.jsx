import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';

const Register = () => {
  const navigate = useNavigate();
  const { login, setError, clearError, getError, setLoading, getIsLoading } = useAuthStore();
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    clearError();
    setLoading(true);
    try {
      const resp = await userService.register({
        email: data.email,
        password: data.password,
        name: data.name,
      });
      const { user, accessToken, refreshToken } = resp.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      login({ user }, { accessToken, refreshToken });
      navigate('/');
    } catch (e) {
      setError(e?.response?.data?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Criar conta</h1>
        {getError() && (
          <div className="mb-4 text-sm text-red-600">{getError()}</div>
        )}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" className="input-field" placeholder="Seu nome" {...register('name', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" className="input-field" placeholder="seu@email.com" {...register('email', { required: true })} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Senha</label>
            <input type="password" className="input-field" placeholder="Crie uma senha" {...register('password', { required: true, minLength: 6 })} />
          </div>
          <button type="submit" className="btn-primary w-full" disabled={getIsLoading()}>
            {getIsLoading() ? 'Cadastrando...' : 'Cadastrar'}
          </button>
        </form>
        <p className="text-sm text-gray-600 mt-4">
          Já tem conta? <Link to="/login" className="text-primary-600 hover:underline">Entrar</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;



import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/apiService';
import { useAuthStore } from '../stores/authStore';
import SocialLoginButtons from '../components/SocialLoginButtons';
import CollabraLogo from '../assets/collabra-logo.svg';

const Register = () => {
  const navigate = useNavigate();
  const { login, setError, clearError, getError, setLoading, getIsLoading } = useAuthStore();
  const { register, handleSubmit, watch, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const password = watch('password', '');
  const confirmPassword = watch('confirmPassword', '');

  // Validação de requisitos de senha
  const passwordRequirements = [
    { text: 'Pelo menos 8 caracteres', met: password.length >= 8 },
    { text: 'Uma letra maiúscula', met: /[A-Z]/.test(password) },
    { text: 'Uma letra minúscula', met: /[a-z]/.test(password) },
    { text: 'Um número', met: /\d/.test(password) },
    { text: 'Um caractere especial', met: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
  ];

  const isPasswordValid = passwordRequirements.every(req => req.met);
  const passwordsMatch = password === confirmPassword && confirmPassword.length > 0;

  const onSubmit = async (data) => {
    if (!isPasswordValid) {
      setError('A senha não atende aos requisitos de segurança');
      return;
    }
    
    if (data.password !== data.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    clearError();
    setLoading(true);
    try {
      const resp = await userService.register({
        email: data.email,
        password: data.password,
        name: data.name,
        consentAccepted: true, // Consentimento LGPD
        consentTimestamp: new Date().toISOString()
      });
      const { user, accessToken, refreshToken } = resp.data;
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
      login({ user }, { accessToken, refreshToken });
      navigate('/dashboard');
    } catch (e) {
      setError(e?.response?.data?.message || 'Falha no cadastro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md">
        {/* Logo e Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <img src={CollabraLogo} alt="Collabra Logo" className="h-12 w-12" />
            <span className="ml-3 text-3xl font-bold text-white">Collabra</span>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Crie sua conta</h1>
          <p className="text-gray-300">Junte-se à comunidade de desenvolvedores</p>
        </div>

        {/* Form Card */}
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 shadow-2xl">
          {getError() && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm text-red-400">{getError()}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Nome */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Nome completo</label>
              <input 
                type="text" 
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.name ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="Seu nome completo" 
                {...register('name', { 
                  required: 'Nome é obrigatório',
                  minLength: { value: 2, message: 'Nome deve ter pelo menos 2 caracteres' }
                })} 
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input 
                type="email" 
                className={`w-full px-4 py-3 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                  errors.email ? 'border-red-500' : 'border-gray-600'
                }`}
                placeholder="seu@email.com" 
                {...register('email', { 
                  required: 'Email é obrigatório',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Email inválido'
                  }
                })} 
              />
              {errors.email && (
                <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>
            
            {/* Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Senha</label>
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.password || (!isPasswordValid && password.length > 0) ? 'border-red-500' : 'border-gray-600'
                  }`}
                  placeholder="Crie uma senha segura" 
                  {...register('password', { 
                    required: 'Senha é obrigatória',
                    minLength: { value: 8, message: 'Senha deve ter pelo menos 8 caracteres' }
                  })} 
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {/* Requisitos de senha */}
              {password.length > 0 && (
                <div className="mt-3 space-y-1">
                  <p className="text-xs text-gray-400 font-medium">Requisitos de segurança:</p>
                  {passwordRequirements.map((req, index) => (
                    <div key={index} className="flex items-center text-xs">
                      <svg 
                        className={`w-3 h-3 mr-2 ${req.met ? 'text-green-400' : 'text-gray-500'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className={req.met ? 'text-green-400' : 'text-gray-500'}>{req.text}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {errors.password && (
                <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirmar Senha */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Confirmar senha</label>
              <div className="relative">
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 pr-12 bg-gray-700/50 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                    errors.confirmPassword || (!passwordsMatch && confirmPassword.length > 0) ? 'border-red-500' : passwordsMatch ? 'border-green-500' : 'border-gray-600'
                  }`}
                  placeholder="Confirme sua senha" 
                  {...register('confirmPassword', { 
                    required: 'Confirmação de senha é obrigatória',
                    validate: value => value === password || 'As senhas não coincidem'
                  })} 
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              
              {confirmPassword.length > 0 && (
                <div className="mt-2 flex items-center text-xs">
                  {passwordsMatch ? (
                    <>
                      <svg className="w-3 h-3 mr-2 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-green-400">Senhas coincidem</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-3 h-3 mr-2 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-400">Senhas não coincidem</span>
                    </>
                  )}
                </div>
              )}
              
              {errors.confirmPassword && (
                <p className="text-red-400 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Consentimento LGPD */}
            <div className="space-y-2">
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="consent"
                  className="mt-1 mr-3 w-4 h-4 text-blue-600 bg-gray-700 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                  {...register('consent', {
                    required: 'Você deve aceitar os termos e a política de privacidade para criar uma conta'
                  })}
                />
                <label htmlFor="consent" className="text-sm text-gray-300">
                  Eu concordo com os{' '}
                  <Link to="/terms" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                    Termos de Uso
                  </Link>
                  {' '}e{' '}
                  <Link to="/privacy" className="text-blue-400 hover:text-blue-300 underline" target="_blank">
                    Política de Privacidade
                  </Link>
                  {' '}e consinto com o tratamento dos meus dados pessoais conforme a LGPD.
                </label>
              </div>
              {errors.consent && (
                <p className="text-red-400 text-xs ml-7">{errors.consent.message}</p>
              )}
            </div>

            <button 
              type="submit" 
              className={`w-full font-semibold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
                isPasswordValid && passwordsMatch ? 
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-blue-500/25' : 
                'bg-gray-600 text-gray-300 cursor-not-allowed'
              }`}
              disabled={getIsLoading() || !isPasswordValid || !passwordsMatch || !watch('consent')}
            >
              {getIsLoading() ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Criando conta...
                </div>
              ) : (
                'Criar conta gratuitamente'
              )}
            </button>
          </form>

          {/* Social Login */}
          <div className="mt-6">
            <SocialLoginButtons />
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem conta?{' '}
              <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors duration-200">
                Entre aqui
              </Link>
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-gray-500 hover:text-gray-400 text-sm transition-colors duration-200">
              ← Voltar para o início
            </Link>
          </div>
        </div>

        {/* Trust indicators */}
        <div className="mt-8 flex justify-center items-center gap-6 text-gray-400 text-sm">
          <div className="flex items-center">
            <svg className="w-4 h-4 text-green-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            <span>Dados Seguros</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-blue-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span>100% Gratuito</span>
          </div>
          <div className="flex items-center">
            <svg className="w-4 h-4 text-purple-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Sem Compromisso</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;



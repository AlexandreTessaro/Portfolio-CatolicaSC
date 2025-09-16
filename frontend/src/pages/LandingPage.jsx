import React from 'react';
import { Link } from 'react-router-dom';
import CollabraLogo from '../assets/collabra-logo.svg';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <header className="relative z-10">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            {/* Logo */}
            <div className="flex items-center">
              <img src={CollabraLogo} alt="Collabra Logo" className="h-10 w-10" />
              <span className="ml-3 text-2xl font-bold text-white">Collabra</span>
            </div>

            {/* Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-gray-300 hover:text-white transition-colors">
                Recursos
              </a>
              <a href="#about" className="text-gray-300 hover:text-white transition-colors">
                Sobre
              </a>
              <a href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contato
              </a>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-300 hover:text-white transition-colors font-medium"
              >
                Entrar
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
              >
                Cadastrar
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              Conecte-se com
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                {' '}desenvolvedores
              </span>
              <br />
              e construa o futuro
            </h1>
            
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              A plataforma que conecta desenvolvedores talentosos com projetos inovadores. 
              Encontre sua próxima oportunidade ou construa sua equipe dos sonhos.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all transform hover:scale-105 flex items-center justify-center"
              >
                Começar Agora
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <Link
                to="/projects"
                className="border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all"
              >
                Explorar Projetos
              </Link>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <section id="features" className="py-20 bg-gray-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Por que escolher o Collabra?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Uma plataforma completa para conectar desenvolvedores e projetos inovadores
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Match Inteligente</h3>
                <p className="text-gray-300">
                  Sistema de matchmaking que conecta desenvolvedores com projetos baseado em habilidades e interesses.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Projetos Diversos</h3>
                <p className="text-gray-300">
                  Desde startups até projetos open source, encontre oportunidades que combinam com seu perfil.
                </p>
              </div>

              <div className="text-center p-8 rounded-xl bg-gray-800/30 hover:bg-gray-800/50 transition-all">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-white mb-4">Crescimento Profissional</h3>
                <p className="text-gray-300">
                  Desenvolva suas habilidades trabalhando em projetos reais e construa seu portfólio.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section id="about" className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  Sobre o Collabra
                </h2>
                <p className="text-lg text-gray-300 mb-6">
                  Somos uma plataforma inovadora que conecta desenvolvedores talentosos com projetos 
                  que precisam de suas habilidades. Nossa missão é democratizar o acesso a oportunidades 
                  de desenvolvimento e acelerar a inovação tecnológica.
                </p>
                <p className="text-lg text-gray-300 mb-8">
                  Com um sistema de matchmaking inteligente, facilitamos o encontro entre desenvolvedores 
                  e projetos, criando um ecossistema colaborativo onde todos podem crescer e aprender juntos.
                </p>
                <div className="flex flex-wrap gap-4">
                  <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                    <span className="text-blue-400 font-semibold">1000+</span>
                    <span className="text-gray-300 ml-2">Desenvolvedores</span>
                  </div>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                    <span className="text-purple-400 font-semibold">500+</span>
                    <span className="text-gray-300 ml-2">Projetos</span>
                  </div>
                  <div className="bg-gray-800/50 px-4 py-2 rounded-lg">
                    <span className="text-green-400 font-semibold">95%</span>
                    <span className="text-gray-300 ml-2">Taxa de Sucesso</span>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                  <h3 className="text-2xl font-bold mb-4">Como Funciona?</h3>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">1</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Crie seu Perfil</h4>
                        <p className="text-sm text-blue-100">Cadastre-se e complete seu perfil com suas habilidades</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">2</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Explore Projetos</h4>
                        <p className="text-sm text-blue-100">Encontre projetos que combinam com seu perfil</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center mr-4 mt-1">
                        <span className="text-sm font-bold">3</span>
                      </div>
                      <div>
                        <h4 className="font-semibold">Conecte-se</h4>
                        <p className="text-sm text-blue-100">Envie solicitações e comece a colaborar</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gray-900 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-900"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Pronto para começar sua jornada?
              </h2>
              <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                Junte-se a milhares de desenvolvedores que já encontraram suas oportunidades de crescimento
              </p>
              
              {/* Enhanced CTA Button */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link
                  to="/register"
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/25"
                >
                  <span className="relative z-10">Cadastrar-se Gratuitamente</span>
                  <svg className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <Link
                  to="/projects"
                  className="inline-flex items-center px-6 py-4 border-2 border-gray-600 hover:border-gray-400 text-gray-300 hover:text-white font-medium rounded-xl transition-all duration-300"
                >
                  Explorar Projetos
                </Link>
              </div>
              
              {/* Trust indicators */}
              <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-gray-400">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">100% Gratuito</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">Dados Seguros</span>
                </div>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-purple-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm">Sem Compromisso</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center mb-4">
                <img src={CollabraLogo} alt="Collabra Logo" className="h-10 w-10" />
                <span className="ml-3 text-2xl font-bold text-white">Collabra</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Conectando desenvolvedores talentosos com projetos inovadores para construir o futuro da tecnologia.
              </p>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Produto</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Recursos</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">Sobre</a></li>
                <li><Link to="/projects" className="text-gray-400 hover:text-white transition-colors">Projetos</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-white font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2">
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contato</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">FAQ</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Documentação</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Collabra. Todos os direitos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

import React from 'react';
import Layout from '../components/Layout/Layout';

const TermsOfUse = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Termos de Uso</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-sm text-gray-400 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Aceitação dos Termos</h2>
              <p>
                Ao acessar e usar a plataforma Startup Collab, você concorda em cumprir e estar vinculado a estes Termos de Uso.
                Se você não concordar com qualquer parte destes termos, não deve usar nossa plataforma.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Descrição do Serviço</h2>
              <p>
                A Startup Collab é uma plataforma web que conecta empreendedores e desenvolvedores para colaboração em projetos de startups.
                A plataforma permite:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Criação e divulgação de projetos</li>
                <li>Busca e conexão com outros usuários</li>
                <li>Sistema de matchmaking entre projetos e talentos</li>
                <li>Comunicação entre usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Conta de Usuário</h2>
              <p>
                Para usar a plataforma, você deve criar uma conta fornecendo informações precisas e atualizadas.
                Você é responsável por:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Manter a confidencialidade de sua senha</li>
                <li>Todas as atividades que ocorrem em sua conta</li>
                <li>Notificar-nos imediatamente sobre qualquer uso não autorizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Conduta do Usuário</h2>
              <p>Você concorda em não:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Usar a plataforma para qualquer propósito ilegal ou não autorizado</li>
                <li>Publicar conteúdo ofensivo, difamatório ou que viole direitos de terceiros</li>
                <li>Interferir ou interromper o funcionamento da plataforma</li>
                <li>Tentar obter acesso não autorizado a qualquer parte da plataforma</li>
                <li>Usar bots, scripts ou outros meios automatizados para acessar a plataforma</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo da plataforma, incluindo textos, gráficos, logos, ícones e software, é propriedade da Startup Collab
                ou de seus fornecedores de conteúdo e está protegido por leis de direitos autorais.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Limitação de Responsabilidade</h2>
              <p>
                A Startup Collab não se responsabiliza por:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Danos diretos, indiretos, incidentais ou consequenciais resultantes do uso da plataforma</li>
                <li>Perda de dados ou informações</li>
                <li>Interrupções ou falhas no serviço</li>
                <li>Conteúdo publicado por outros usuários</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Modificações dos Termos</h2>
              <p>
                Reservamo-nos o direito de modificar estes termos a qualquer momento. Alterações significativas serão notificadas
                aos usuários. O uso continuado da plataforma após as alterações constitui aceitação dos novos termos.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Rescisão</h2>
              <p>
                Podemos encerrar ou suspender sua conta imediatamente, sem aviso prévio, por violação destes Termos de Uso.
                Você também pode encerrar sua conta a qualquer momento através das configurações do perfil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Lei Aplicável</h2>
              <p>
                Estes Termos de Uso são regidos pelas leis brasileiras. Qualquer disputa será resolvida nos tribunais competentes do Brasil.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Contato</h2>
              <p>
                Para questões sobre estes Termos de Uso, entre em contato conosco através do email: contato@startupcollab.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default TermsOfUse;


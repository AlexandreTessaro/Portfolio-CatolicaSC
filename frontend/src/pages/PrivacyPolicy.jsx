import React from 'react';
import Layout from '../components/Layout/Layout';

const PrivacyPolicy = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
          <h1 className="text-3xl font-bold text-white mb-6">Política de Privacidade</h1>
          
          <div className="prose prose-invert max-w-none text-gray-300 space-y-6">
            <p className="text-sm text-gray-400 mb-8">Última atualização: {new Date().toLocaleDateString('pt-BR')}</p>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">1. Introdução</h2>
              <p>
                A Startup Collab está comprometida em proteger sua privacidade e seus dados pessoais.
                Esta Política de Privacidade explica como coletamos, usamos, armazenamos e protegemos suas informações,
                em conformidade com a Lei Geral de Proteção de Dados (LGPD - Lei nº 13.709/2018).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">2. Dados Coletados</h2>
              <p>Coletamos os seguintes tipos de dados pessoais:</p>
              
              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.1. Dados Fornecidos por Você</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Identificação:</strong> Nome completo, email</li>
                <li><strong>Perfil:</strong> Biografia, habilidades, foto de perfil</li>
                <li><strong>Projetos:</strong> Informações sobre projetos criados</li>
                <li><strong>Comunicação:</strong> Mensagens e interações com outros usuários</li>
              </ul>

              <h3 className="text-xl font-semibold text-white mt-4 mb-2">2.2. Dados Coletados Automaticamente</h3>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Endereço IP</li>
                <li>Informações do dispositivo e navegador</li>
                <li>Logs de acesso e ações realizadas</li>
                <li>Cookies e tecnologias similares</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">3. Finalidade do Tratamento</h2>
              <p>Utilizamos seus dados pessoais para:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Fornecer e melhorar nossos serviços</li>
                <li>Facilitar conexões entre usuários e projetos</li>
                <li>Enviar notificações sobre atividades relevantes</li>
                <li>Garantir a segurança da plataforma</li>
                <li>Cumprir obrigações legais</li>
                <li>Realizar análises e estatísticas (dados anonimizados)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">4. Base Legal</h2>
              <p>O tratamento de seus dados pessoais é baseado em:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Consentimento:</strong> Você forneceu consentimento explícito ao criar sua conta</li>
                <li><strong>Execução de contrato:</strong> Necessário para fornecer os serviços solicitados</li>
                <li><strong>Obrigação legal:</strong> Cumprimento de obrigações legais e regulatórias</li>
                <li><strong>Legítimo interesse:</strong> Melhorar nossos serviços e garantir segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">5. Compartilhamento de Dados</h2>
              <p>
                Não vendemos seus dados pessoais. Podemos compartilhar informações apenas nas seguintes situações:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Com seu consentimento:</strong> Quando você autorizar explicitamente</li>
                <li><strong>Prestadores de serviço:</strong> Empresas que nos auxiliam na operação (hospedagem, email, etc.)</li>
                <li><strong>Obrigação legal:</strong> Quando exigido por lei ou ordem judicial</li>
                <li><strong>Proteção de direitos:</strong> Para proteger nossos direitos, propriedade ou segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">6. Segurança dos Dados</h2>
              <p>
                Implementamos medidas técnicas e organizacionais para proteger seus dados pessoais:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li>Criptografia de dados sensíveis (senhas, tokens)</li>
                <li>Acesso restrito a dados pessoais</li>
                <li>Monitoramento de segurança e detecção de ameaças</li>
                <li>Backups regulares</li>
                <li>Atualizações de segurança</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">7. Retenção de Dados</h2>
              <p>
                Mantemos seus dados pessoais apenas pelo tempo necessário para cumprir as finalidades descritas nesta política,
                ou conforme exigido por lei. Quando você solicita a exclusão de sua conta, seus dados são removidos ou anonimizados,
                exceto quando a retenção for necessária por obrigação legal.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">8. Seus Direitos (LGPD)</h2>
              <p>Você tem os seguintes direitos sobre seus dados pessoais:</p>
              <ul className="list-disc list-inside ml-4 space-y-2">
                <li><strong>Confirmação e acesso:</strong> Saber se tratamos seus dados e acessá-los</li>
                <li><strong>Correção:</strong> Solicitar correção de dados incompletos ou desatualizados</li>
                <li><strong>Anonimização, bloqueio ou eliminação:</strong> Solicitar anonimização ou exclusão de dados desnecessários</li>
                <li><strong>Portabilidade:</strong> Receber seus dados em formato estruturado</li>
                <li><strong>Eliminação:</strong> Solicitar exclusão de dados tratados com consentimento</li>
                <li><strong>Revogação de consentimento:</strong> Retirar seu consentimento a qualquer momento</li>
                <li><strong>Oposição:</strong> Opor-se ao tratamento de dados em certas circunstâncias</li>
                <li><strong>Revisão de decisões automatizadas:</strong> Solicitar revisão de decisões tomadas apenas por processamento automatizado</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">9. Cookies</h2>
              <p>
                Utilizamos cookies e tecnologias similares para melhorar sua experiência, analisar o uso da plataforma
                e personalizar conteúdo. Você pode gerenciar suas preferências de cookies nas configurações do navegador.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">10. Alterações nesta Política</h2>
              <p>
                Podemos atualizar esta Política de Privacidade periodicamente. Notificaremos sobre alterações significativas
                por email ou através de aviso na plataforma. Recomendamos revisar esta política regularmente.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">11. Contato e Encarregado de Dados (DPO)</h2>
              <p>
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política, entre em contato:
              </p>
              <ul className="list-none ml-4 space-y-2 mt-4">
                <li><strong>Email:</strong> privacidade@startupcollab.com</li>
                <li><strong>Encarregado de Dados (DPO):</strong> dpo@startupcollab.com</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-white mb-4">12. Autoridade Supervisora</h2>
              <p>
                Se você acredita que seus dados pessoais foram tratados de forma inadequada, você tem o direito de apresentar
                uma reclamação à Autoridade Nacional de Proteção de Dados (ANPD):
              </p>
              <ul className="list-none ml-4 space-y-2 mt-4">
                <li><strong>Site:</strong> www.gov.br/anpd</li>
                <li><strong>Email:</strong> ouvidoria@anpd.gov.br</li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicy;


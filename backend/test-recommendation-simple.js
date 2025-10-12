import fetch from 'node-fetch';

const API_BASE_URL = 'http://localhost:5000/api';

async function testRecommendationEndpoint() {
  try {
    console.log('🧪 Testando endpoint de recomendações...');
    
    // Primeiro, fazer login para obter token
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'joao.silva@startupcollab.com',
        password: 'password123'
      })
    });
    
    const loginData = await loginResponse.json();
    
    if (!loginData.success) {
      throw new Error('Falha no login');
    }
    
    const token = loginData.data.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // Testar endpoint de projetos com scores
    const projectsResponse = await fetch(`${API_BASE_URL}/recommendations/projects?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    const projectsData = await projectsResponse.json();
    
    if (!projectsData.success) {
      throw new Error('Falha ao obter projetos');
    }
    
    console.log('✅ Projetos com scores obtidos:');
    projectsData.data.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
      console.log(`      Score: ${project.recommendationScore}%`);
      console.log(`      Tecnologias: ${project.technologies.join(', ')}`);
      console.log('');
    });
    
    console.log('🎉 Teste de endpoint de recomendações concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testRecommendationEndpoint();

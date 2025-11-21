import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

async function testRecommendationEndpoint() {
  try {
    console.log('🧪 Testando endpoint de recomendações...');
    
    // Primeiro, fazer login para obter token
    const loginResponse = await axios.post(`${API_BASE_URL}/users/login`, {
      email: 'joao.silva@startupcollab.com',
      password: 'password123'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // Testar endpoint de projetos com scores
    const projectsResponse = await axios.get(`${API_BASE_URL}/recommendations/projects?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Projetos com scores obtidos:');
    projectsResponse.data.data.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
      console.log(`      Score: ${project.recommendationScore}%`);
      console.log(`      Tecnologias: ${project.technologies.join(', ')}`);
      console.log('');
    });
    
    // Testar endpoint de score específico
    if (projectsResponse.data.data.length > 0) {
      const firstProject = projectsResponse.data.data[0];
      const scoreResponse = await axios.get(`${API_BASE_URL}/recommendations/score/${firstProject.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('✅ Score específico obtido:');
      console.log(`   Projeto: ${firstProject.title}`);
      console.log(`   Score: ${scoreResponse.data.data.recommendationScore}%`);
    }
    
    console.log('🎉 Teste de endpoint de recomendações concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.response?.data || error.message);
  }
}

testRecommendationEndpoint();

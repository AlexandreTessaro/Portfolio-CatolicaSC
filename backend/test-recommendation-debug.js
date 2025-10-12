import https from 'https';
import http from 'http';

const API_BASE_URL = 'http://localhost:5000/api';

function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const protocol = url.startsWith('https:') ? https : http;
    
    const req = protocol.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData, rawData: data });
        } catch (error) {
          resolve({ status: res.statusCode, data: data, rawData: data });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

async function testRecommendationEndpoint() {
  try {
    console.log('🧪 Testando endpoint de recomendações...');
    
    // Primeiro, fazer login para obter token
    const loginResponse = await makeRequest(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'joao.silva@startupcollab.com',
        password: 'password123'
      })
    });
    
    console.log('Login response status:', loginResponse.status);
    console.log('Login response data:', JSON.stringify(loginResponse.data, null, 2));
    
    if (!loginResponse.data.success) {
      throw new Error('Falha no login');
    }
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login realizado com sucesso');
    
    // Testar endpoint de projetos com scores
    const projectsResponse = await makeRequest(`${API_BASE_URL}/recommendations/projects?limit=5`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('Projects response status:', projectsResponse.status);
    console.log('Projects response data:', JSON.stringify(projectsResponse.data, null, 2));
    
    if (!projectsResponse.data.success) {
      throw new Error('Falha ao obter projetos');
    }
    
    console.log('✅ Projetos com scores obtidos:');
    projectsResponse.data.data.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
      console.log(`      Score: ${project.recommendationScore}%`);
      console.log('      Tecnologias:', project.technologies.join(', '));
      console.log('');
    });
    
    console.log('🎉 Teste de endpoint de recomendações concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

testRecommendationEndpoint();

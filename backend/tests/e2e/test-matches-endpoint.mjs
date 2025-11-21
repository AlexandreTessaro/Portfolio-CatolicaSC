import axios from 'axios';

async function testMatchesEndpoint() {
  try {
    console.log('🔄 Testando endpoint de matches...');
    
    // Primeiro, fazer login para obter um token
    console.log('🔐 Fazendo login...');
    const loginResponse = await axios.post('http://localhost:5000/api/users/login', {
      email: 'test@test.com',
      password: '123456'
    });
    
    const token = loginResponse.data.data.accessToken;
    console.log('✅ Login realizado, token obtido');
    
    // Testar endpoint de estatísticas
    console.log('📊 Testando /api/matches/stats...');
    const statsResponse = await axios.get('http://localhost:5000/api/matches/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Estatísticas carregadas:', statsResponse.data);
    
    // Testar endpoint de matches recebidos
    console.log('📥 Testando /api/matches/received...');
    const receivedResponse = await axios.get('http://localhost:5000/api/matches/received', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('✅ Matches recebidos:', receivedResponse.data);
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
    if (error.response?.status === 500) {
      console.error('❌ Erro 500 - Internal Server Error');
      console.error('❌ Detalhes:', error.response?.data);
    }
  }
}

testMatchesEndpoint();

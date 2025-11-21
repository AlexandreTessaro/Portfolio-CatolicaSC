const API_BASE_URL = 'http://localhost:5000';

async function testCanRequestParticipationDetailed() {
  try {
    console.log('🔍 Testando endpoint canRequestParticipation com detalhes...\n');

    // 1. Fazer login
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/api/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'teste@startupcollab.com',
        password: 'password123'
      })
    });

    const loginData = await loginResponse.json();
    console.log('Login response:', loginData);
    
    if (!loginData.success) {
      throw new Error('Login falhou: ' + loginData.message);
    }
    
    const token = loginData.data.accessToken;
    console.log('✅ Login realizado com sucesso\n');

    // 2. Testar apenas um projeto específico
    const projectId = 1;
    console.log(`2. Testando projeto ID: ${projectId}`);
    
    try {
      const canRequestResponse = await fetch(
        `${API_BASE_URL}/api/matches/can-request/${projectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      console.log('Status da resposta:', canRequestResponse.status);
      console.log('Headers:', Object.fromEntries(canRequestResponse.headers.entries()));
      
      const canRequestData = await canRequestResponse.json();
      console.log('✅ Resposta completa:', JSON.stringify(canRequestData, null, 2));
      
      if (canRequestData.success) {
        console.log('✅ Sucesso! Dados:', canRequestData.data);
      } else {
        console.log('❌ Erro:', canRequestData.message);
      }
    } catch (error) {
      console.log('❌ Erro ao testar:', error.message);
    }

  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

testCanRequestParticipationDetailed();

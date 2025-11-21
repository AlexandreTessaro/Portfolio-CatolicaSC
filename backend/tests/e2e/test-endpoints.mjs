// Script para testar endpoints de matchmaking
import fetch from 'node-fetch';

async function testEndpoints() {
  try {
    console.log('🔄 Testando endpoints de matchmaking...');
    
    // 1. Fazer login para obter token
    console.log('🔐 Fazendo login...');
    const loginResponse = await fetch('http://localhost:5000/api/users/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: 'test@test.com',
        password: '123456'
      })
    });
    
    if (!loginResponse.ok) {
      throw new Error(`Login failed: ${loginResponse.status}`);
    }
    
    const loginData = await loginResponse.json();
    const token = loginData.data.accessToken;
    console.log('✅ Login realizado');
    
    // 2. Testar endpoint de estatísticas
    console.log('📊 Testando /api/matches/stats...');
    const statsResponse = await fetch('http://localhost:5000/api/matches/stats', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (statsResponse.ok) {
      const statsData = await statsResponse.json();
      console.log('✅ Estatísticas:', statsData);
    } else {
      console.error('❌ Erro em stats:', statsResponse.status, await statsResponse.text());
    }
    
    // 3. Testar endpoint de matches recebidos
    console.log('📥 Testando /api/matches/received...');
    const receivedResponse = await fetch('http://localhost:5000/api/matches/received', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (receivedResponse.ok) {
      const receivedData = await receivedResponse.json();
      console.log('✅ Matches recebidos:', receivedData);
    } else {
      console.error('❌ Erro em received:', receivedResponse.status, await receivedResponse.text());
    }
    
    // 4. Testar endpoint de matches enviados
    console.log('📤 Testando /api/matches/sent...');
    const sentResponse = await fetch('http://localhost:5000/api/matches/sent', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (sentResponse.ok) {
      const sentData = await sentResponse.json();
      console.log('✅ Matches enviados:', sentData);
    } else {
      console.error('❌ Erro em sent:', sentResponse.status, await sentResponse.text());
    }
    
  } catch (error) {
    console.error('❌ Erro geral:', error.message);
  }
}

// Aguardar servidor iniciar
setTimeout(testEndpoints, 3000);

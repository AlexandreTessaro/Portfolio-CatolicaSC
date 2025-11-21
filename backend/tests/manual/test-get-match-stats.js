// Script para testar getMatchStats especificamente
import http from 'http';

async function testGetMatchStats() {
  console.log('🔄 Testando getMatchStats especificamente...');
  
  // 1. Fazer login para obter token
  console.log('🔐 Fazendo login...');
  const loginData = JSON.stringify({
    email: 'maria@gmail.com',
    password: '123456'
  });
  
  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/users/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(loginData)
    }
  };
  
  const loginResponse = await makeRequest(loginOptions, loginData);
  if (loginResponse.success) {
    const token = loginResponse.data.accessToken;
    console.log('✅ Login realizado');
    
    // 2. Testar endpoint de estatísticas com mais detalhes
    console.log('📊 Testando /api/matches/stats...');
    const statsOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const statsResponse = await makeRequest(statsOptions);
    console.log('📊 Resposta stats:', statsResponse);
    
    // 3. Testar endpoint de matches recebidos
    console.log('📥 Testando /api/matches/received...');
    const receivedOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/received',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
    
    const receivedResponse = await makeRequest(receivedOptions);
    console.log('📊 Resposta received:', receivedResponse);
    
  } else {
    console.error('❌ Erro no login:', loginResponse);
  }
}

function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';
      
      res.on('data', (chunk) => {
        responseData += chunk;
      });
      
      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve(parsed);
        } catch (error) {
          resolve({ success: false, error: error.message, raw: responseData });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

// Aguardar servidor iniciar
setTimeout(testGetMatchStats, 2000);

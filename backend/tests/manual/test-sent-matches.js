// Script para testar endpoint /api/matches/sent
import http from 'http';

async function testSentMatches() {
  console.log('🔄 Testando endpoint /api/matches/sent...');
  
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
    
    // 2. Testar endpoint de matches enviados
    console.log('📤 Testando /api/matches/sent...');
    const sentOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/sent',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Test-Client/1.0'
      }
    };
    
    const sentResponse = await makeRequest(sentOptions);
    console.log('📊 Resposta sent:', sentResponse);
    
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
setTimeout(testSentMatches, 3000);

// Script para testar se req.user está sendo definido corretamente
import http from 'http';

async function testReqUser() {
  console.log('🔄 Testando se req.user está sendo definido...');
  
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
    console.log('🔍 Token:', token.substring(0, 20) + '...');
    
    // 2. Testar endpoint que deve funcionar (users/profile)
    console.log('👤 Testando /api/users/profile...');
    const profileOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/users/profile',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const profileResponse = await makeRequest(profileOptions);
    console.log('📊 Resposta profile:', profileResponse);
    
    // 3. Testar endpoint de matches
    console.log('📊 Testando /api/matches/stats...');
    const statsOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const statsResponse = await makeRequest(statsOptions);
    console.log('📊 Resposta stats:', statsResponse);
    
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
setTimeout(testReqUser, 2000);

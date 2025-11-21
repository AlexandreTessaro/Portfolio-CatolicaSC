// Script para testar middleware de autenticação
import http from 'http';

async function testAuthMiddleware() {
  console.log('🔄 Testando middleware de autenticação...');
  
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
    
    // 2. Testar endpoint protegido sem token
    console.log('🔒 Testando endpoint sem token...');
    const noTokenOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/stats',
      method: 'GET'
    };
    
    const noTokenResponse = await makeRequest(noTokenOptions);
    console.log('📊 Resposta sem token:', noTokenResponse);
    
    // 3. Testar endpoint protegido com token
    console.log('🔓 Testando endpoint com token...');
    const withTokenOptions = {
      hostname: 'localhost',
      port: 5000,
      path: '/api/matches/stats',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };
    
    const withTokenResponse = await makeRequest(withTokenOptions);
    console.log('📊 Resposta com token:', withTokenResponse);
    
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
setTimeout(testAuthMiddleware, 2000);

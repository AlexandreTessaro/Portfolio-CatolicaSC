// Script para testar conectividade com o servidor
import http from 'http';

function testServer() {
  console.log('🔄 Testando conectividade com servidor...');
  
  const options = {
    hostname: 'localhost',
    port: 5000,
    path: '/health',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`✅ Status: ${res.statusCode}`);
    console.log(`✅ Headers:`, res.headers);
    
    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      console.log('✅ Response:', data);
    });
  });

  req.on('error', (error) => {
    console.error('❌ Erro:', error.message);
  });

  req.end();
}

// Aguardar servidor iniciar
setTimeout(testServer, 3000);

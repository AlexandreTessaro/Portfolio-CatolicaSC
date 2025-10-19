// Teste simples para verificar refresh token
const API_BASE_URL = 'http://localhost:5001/api';

async function testRefreshToken() {
  console.log('🔍 Testando refresh token...\n');

  try {
    // 1. Fazer login para obter tokens
    console.log('1. Fazendo login...');
    const loginResponse = await fetch(`${API_BASE_URL}/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'alexandre@test.com',
        password: '123456'
      })
    });

    const loginData = await loginResponse.json();
    if (!loginData.success) {
      throw new Error('Login failed: ' + loginData.message);
    }

    const { accessToken, refreshToken } = loginData.data;
    console.log('✅ Login realizado com sucesso');
    console.log('Access Token:', accessToken.substring(0, 20) + '...');
    console.log('Refresh Token:', refreshToken.substring(0, 20) + '...\n');

    // 2. Testar refresh token
    console.log('2. Testando refresh token...');
    const refreshResponse = await fetch(`${API_BASE_URL}/users/refresh-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: refreshToken
      })
    });

    const refreshData = await refreshResponse.json();
    if (!refreshData.success) {
      throw new Error('Refresh failed: ' + refreshData.message);
    }

    console.log('✅ Refresh token funcionando!');
    console.log('Novo Access Token:', refreshData.data.accessToken.substring(0, 20) + '...\n');

    // 3. Testar acesso com novo token
    console.log('3. Testando acesso com novo token...');
    const profileResponse = await fetch(`${API_BASE_URL}/users/profile`, {
      headers: {
        'Authorization': `Bearer ${refreshData.data.accessToken}`,
        'Content-Type': 'application/json',
      }
    });

    const profileData = await profileResponse.json();
    if (!profileData.success) {
      throw new Error('Profile access failed: ' + profileData.message);
    }

    console.log('✅ Acesso ao perfil funcionando!');
    console.log('Usuário:', profileData.data.name);

  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
  }
}

// Executar teste
testRefreshToken();

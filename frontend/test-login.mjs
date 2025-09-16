// Script para testar login no frontend
import axios from 'axios';

async function testLogin() {
  try {
    console.log('🔄 Testando login...');
    
    const loginData = {
      email: 'maria@gmail.com',
      password: '123456'
    };
    
    const response = await axios.post('http://localhost:5000/api/users/login', loginData);
    
    if (response.data.success) {
      console.log('✅ Login realizado com sucesso');
      console.log('📊 Token:', response.data.data.accessToken?.substring(0, 20) + '...');
      console.log('📊 Refresh Token:', response.data.data.refreshToken?.substring(0, 20) + '...');
      
      // Testar endpoint protegido
      console.log('🔒 Testando endpoint protegido...');
      const protectedResponse = await axios.get('http://localhost:5000/api/matches/stats', {
        headers: {
          'Authorization': `Bearer ${response.data.data.accessToken}`
        }
      });
      
      console.log('✅ Endpoint protegido funcionando:', protectedResponse.data);
      
    } else {
      console.error('❌ Erro no login:', response.data);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.response?.data || error.message);
  }
}

testLogin();

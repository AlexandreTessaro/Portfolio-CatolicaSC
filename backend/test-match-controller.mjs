// Script para testar MatchController diretamente
import MatchController from './src/controllers/MatchController.js';

async function testMatchController() {
  try {
    console.log('🔄 Testando MatchController...');
    
    const matchController = MatchController;
    
    // Simular req e res para testar os métodos
    const mockReq = {
      user: { id: 13 }, // ID da Maria
      body: {},
      params: {}
    };
    
    const mockRes = {
      json: (data) => {
        console.log('✅ Response:', data);
      },
      status: (code) => {
        console.log(`📊 Status: ${code}`);
        return {
          json: (data) => {
            console.log('❌ Error Response:', data);
          }
        };
      }
    };
    
    console.log('📊 Testando getMatchStats...');
    await matchController.getMatchStats(mockReq, mockRes);
    
    console.log('📥 Testando getReceivedMatches...');
    await matchController.getReceivedMatches(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    console.error('❌ Stack:', error.stack);
  }
}

testMatchController();

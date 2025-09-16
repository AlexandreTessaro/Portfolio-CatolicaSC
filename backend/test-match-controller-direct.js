import MatchController from './src/controllers/MatchController.js';

async function testMatchController() {
  try {
    console.log('🔍 Testando MatchController...');
    
    // Simular req e res
    const req = {
      params: { projectId: '2' },
      user: { id: 2 }
    };
    
    const res = {
      json: (data) => {
        console.log('✅ Resposta do controller:', data);
      },
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Erro ${code}:`, data);
        }
      })
    };
    
    await MatchController.canRequestParticipation(req, res);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testMatchController();

import database from './src/config/database.js';
import MatchService from './src/services/MatchService.js';

async function testMatchService() {
  try {
    console.log('🔍 Testando MatchService.canRequestParticipation...');
    
    const matchService = new MatchService(database);
    const result = await matchService.canRequestParticipation(2, 1);
    
    console.log('✅ Resultado:', result);
    console.log('📋 Tipo:', typeof result);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testMatchService();

import database from './src/config/database.js';
import MatchRepository from './src/repositories/MatchRepository.js';

async function testMatchRepository() {
  try {
    console.log('🔍 Testando MatchRepository.existsByUserAndProject...');
    
    const matchRepo = new MatchRepository(database);
    const exists = await matchRepo.existsByUserAndProject(2, 1);
    
    console.log('✅ Resultado existsByUserAndProject:', exists);
    console.log('📋 Tipo:', typeof exists);
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testMatchRepository();

import MatchService from '../../src/services/MatchService.js';
import pool from '../../src/config/database.js';

async function testMatchService() {
  try {
    console.log('🔄 Testando MatchService...');
    
    const matchService = new MatchService(pool);
    
    // Testar com um usuário que existe
    const testUserId = 1;
    
    console.log('📊 Testando getMatchStats...');
    const stats = await matchService.getMatchStats(testUserId);
    console.log('✅ Estatísticas:', stats);
    
    console.log('📥 Testando getReceivedMatches...');
    const received = await matchService.getReceivedMatches(testUserId);
    console.log('✅ Matches recebidos:', received.length);
    
    console.log('📤 Testando getSentMatches...');
    const sent = await matchService.getSentMatches(testUserId);
    console.log('✅ Matches enviados:', sent.length);
    
    await pool.end();
    console.log('🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
    await pool.end();
  }
}

testMatchService();

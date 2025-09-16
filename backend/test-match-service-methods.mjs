import MatchService from './src/services/MatchService.js';
import pool from './src/config/database.js';

async function testMatchServiceMethods() {
  try {
    console.log('🔄 Testando métodos do MatchService...');
    
    const matchService = new MatchService(pool);
    
    // Testar com um usuário que existe
    const testUserId = 1;
    
    console.log('📊 Testando getMatchStats com userId =', testUserId);
    try {
      const stats = await matchService.getMatchStats(testUserId);
      console.log('✅ Estatísticas obtidas:', stats);
    } catch (error) {
      console.error('❌ Erro em getMatchStats:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
    console.log('📥 Testando getReceivedMatches com userId =', testUserId);
    try {
      const received = await matchService.getReceivedMatches(testUserId);
      console.log('✅ Matches recebidos:', received.length);
    } catch (error) {
      console.error('❌ Erro em getReceivedMatches:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
    console.log('📤 Testando getSentMatches com userId =', testUserId);
    try {
      const sent = await matchService.getSentMatches(testUserId);
      console.log('✅ Matches enviados:', sent.length);
    } catch (error) {
      console.error('❌ Erro em getSentMatches:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
    await pool.end();
    console.log('🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    await pool.end();
  }
}

testMatchServiceMethods();

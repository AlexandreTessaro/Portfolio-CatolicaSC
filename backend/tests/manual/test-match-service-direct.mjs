// Script para testar MatchService diretamente
import MatchService from '../../src/services/MatchService.js';
import pool from '../../src/config/database.js';

async function testMatchService() {
  try {
    console.log('🔄 Testando MatchService diretamente...');
    
    const matchService = new MatchService(pool);
    const userId = 13; // ID da Maria
    
    console.log('📊 Testando getMatchStats...');
    try {
      const stats = await matchService.getMatchStats(userId);
      console.log('✅ Estatísticas:', stats);
    } catch (error) {
      console.error('❌ Erro em getMatchStats:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
    console.log('📥 Testando getReceivedMatches...');
    try {
      const received = await matchService.getReceivedMatches(userId);
      console.log('✅ Matches recebidos:', received.length);
    } catch (error) {
      console.error('❌ Erro em getReceivedMatches:', error.message);
      console.error('❌ Stack:', error.stack);
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
    await pool.end();
  }
}

testMatchService();

// Script para testar inicialização do MatchController
import MatchController from './src/controllers/MatchController.js';

console.log('🔄 Testando inicialização do MatchController...');

try {
  console.log('✅ MatchController importado com sucesso');
  console.log('📊 Métodos disponíveis:', Object.getOwnPropertyNames(MatchController));
  console.log('📊 Tipo:', typeof MatchController);
  
  // Verificar se o matchService foi inicializado
  if (MatchController.matchService) {
    console.log('✅ MatchService inicializado');
  } else {
    console.log('❌ MatchService não inicializado');
  }
  
} catch (error) {
  console.error('❌ Erro na inicialização:', error.message);
  console.error('❌ Stack:', error.stack);
}

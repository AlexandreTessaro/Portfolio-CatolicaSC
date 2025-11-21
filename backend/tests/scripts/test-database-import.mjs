// Script para testar import do database
import database from '../../src/config/database.js';

console.log('🔄 Testando import do database...');

try {
  console.log('✅ Database importado:', typeof database);
  console.log('📊 Database:', database);
  
  if (database && typeof database.query === 'function') {
    console.log('✅ Database tem método query');
  } else {
    console.log('❌ Database não tem método query');
  }
  
} catch (error) {
  console.error('❌ Erro no import:', error.message);
  console.error('❌ Stack:', error.stack);
}

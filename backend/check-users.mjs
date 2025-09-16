// Script para verificar usuários no banco
import pool from './src/config/database.js';

async function checkUsers() {
  try {
    console.log('🔄 Verificando usuários no banco...');
    
    const result = await pool.query('SELECT id, email, name FROM users LIMIT 5');
    
    if (result.rows.length > 0) {
      console.log('📋 Usuários encontrados:');
      result.rows.forEach(user => {
        console.log(`  - ID: ${user.id}, Email: ${user.email}, Nome: ${user.name}`);
      });
    } else {
      console.log('❌ Nenhum usuário encontrado');
    }
    
    await pool.end();
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await pool.end();
  }
}

checkUsers();

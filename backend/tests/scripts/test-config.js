import dotenv from 'dotenv';
import pool from '../../src/config/database.js';

dotenv.config();

console.log('🔧 Testando configuração...');
console.log('📍 NODE_ENV:', process.env.NODE_ENV);
console.log('📍 DB_HOST:', process.env.DB_HOST);
console.log('📍 DB_USER:', process.env.DB_USER);
console.log('📍 DB_NAME:', process.env.DB_NAME);
console.log('📍 REDIS_ENABLED:', process.env.REDIS_ENABLED);

try {
  console.log('🔄 Testando conexão com PostgreSQL...');
  const result = await pool.query('SELECT NOW()');
  console.log('✅ PostgreSQL conectado:', result.rows[0]);
  
  console.log('🔄 Testando tabelas...');
  const tables = await pool.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  console.log('✅ Tabelas encontradas:', tables.rows.map(r => r.table_name));
  
  console.log('🎉 Teste concluído com sucesso!');
  process.exit(0);
} catch (error) {
  console.error('❌ Erro no teste:', error.message);
  process.exit(1);
}


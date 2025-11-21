import pool from '../../src/config/database.js';

async function testConnection() {
  try {
    console.log('🔧 Testando conexão com o banco de dados...');
    
    const client = await pool.connect();
    
    // Testar consulta simples
    const result = await client.query('SELECT NOW() as current_time');
    console.log('✅ Conexão estabelecida com sucesso!');
    console.log(`⏰ Hora atual do banco: ${result.rows[0].current_time}`);
    
    // Verificar tabelas existentes
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      ORDER BY table_name
    `);
    
    console.log('\n📋 Tabelas encontradas:');
    tables.rows.forEach(row => {
      console.log(`   - ${row.table_name}`);
    });
    
    // Verificar dados existentes
    const userCount = await client.query('SELECT COUNT(*) as count FROM users');
    const projectCount = await client.query('SELECT COUNT(*) as count FROM projects');
    const requestCount = await client.query('SELECT COUNT(*) as count FROM collaboration_requests');
    
    console.log('\n📊 Dados existentes:');
    console.log(`   👥 Usuários: ${userCount.rows[0].count}`);
    console.log(`   🚀 Projetos: ${projectCount.rows[0].count}`);
    console.log(`   🤝 Solicitações: ${requestCount.rows[0].count}`);
    
    client.release();
    await pool.end();
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro na conexão:', error.message);
    process.exit(1);
  }
}

testConnection();

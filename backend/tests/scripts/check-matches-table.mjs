import pool from '../../src/config/database.js';

async function checkMatchesTable() {
  try {
    console.log('🔄 Verificando estrutura da tabela matches...');
    
    // Verificar estrutura completa
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable, column_default
      FROM information_schema.columns
      WHERE table_name = 'matches'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estrutura completa da tabela matches:');
    structure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'}) ${row.column_default ? `default: ${row.column_default}` : ''}`);
    });
    
    // Testar uma consulta simples
    console.log('🔍 Testando consulta simples...');
    const count = await pool.query('SELECT COUNT(*) as count FROM matches');
    console.log('📊 Total de matches:', count.rows[0].count);
    
    // Testar inserção de dados de teste
    console.log('🧪 Testando inserção...');
    const testInsert = await pool.query(`
      INSERT INTO matches (project_id, user_id, status, message, created_at, updated_at)
      VALUES (1, 1, 'pending', 'Teste de mensagem com mais de 10 caracteres', NOW(), NOW())
      RETURNING id;
    `);
    console.log('✅ Inserção teste realizada, ID:', testInsert.rows[0].id);
    
    // Limpar dados de teste
    await pool.query('DELETE FROM matches WHERE id = $1', [testInsert.rows[0].id]);
    console.log('🧹 Dados de teste removidos');
    
    await pool.end();
    console.log('🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await pool.end();
  }
}

checkMatchesTable();

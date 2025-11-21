import pool from '../../src/config/database.js';

async function testMatchesTable() {
  try {
    console.log('🔄 Testando tabela matches...');
    
    // Verificar se a tabela existe
    const checkTable = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'matches'
      );
    `);
    
    console.log('✅ Tabela matches existe:', checkTable.rows[0].exists);
    
    // Verificar estrutura da tabela
    const structure = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'matches'
      ORDER BY ordinal_position;
    `);
    
    console.log('📋 Estrutura da tabela:');
    structure.rows.forEach(row => {
      console.log(`  - ${row.column_name}: ${row.data_type} (${row.is_nullable === 'YES' ? 'nullable' : 'not null'})`);
    });
    
    // Testar uma consulta simples
    const count = await pool.query('SELECT COUNT(*) as count FROM matches');
    console.log('📊 Total de matches:', count.rows[0].count);
    
    await pool.end();
    console.log('🎉 Teste concluído!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await pool.end();
  }
}

testMatchesTable();

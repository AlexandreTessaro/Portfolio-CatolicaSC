import pool from './src/config/database.js';

async function checkRelatedTables() {
  try {
    console.log('🔄 Verificando tabelas relacionadas...');
    
    // Verificar se tabelas existem
    const tablesCheck = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('projects', 'users')
      ORDER BY table_name;
    `);
    
    console.log('📋 Tabelas encontradas:');
    tablesCheck.rows.forEach(row => {
      console.log(`  - ${row.table_name}`);
    });
    
    // Verificar estrutura da tabela projects
    if (tablesCheck.rows.some(row => row.table_name === 'projects')) {
      console.log('🔍 Estrutura da tabela projects:');
      const projectsStructure = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'projects'
        ORDER BY ordinal_position;
      `);
      
      projectsStructure.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type}`);
      });
    }
    
    // Verificar estrutura da tabela users
    if (tablesCheck.rows.some(row => row.table_name === 'users')) {
      console.log('🔍 Estrutura da tabela users:');
      const usersStructure = await pool.query(`
        SELECT column_name, data_type
        FROM information_schema.columns
        WHERE table_name = 'users'
        ORDER BY ordinal_position;
      `);
      
      usersStructure.rows.forEach(row => {
        console.log(`  - ${row.column_name}: ${row.data_type}`);
      });
    }
    
    // Testar consulta com JOIN
    console.log('🧪 Testando consulta com JOIN...');
    const joinTest = await pool.query(`
      SELECT m.*, 
             p.id as project_id, p.title as project_title,
             u.id as user_id, u.name as user_name
      FROM matches m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      LIMIT 1;
    `);
    
    console.log('✅ Consulta JOIN funcionando, resultado:', joinTest.rows.length);
    
    await pool.end();
    console.log('🎉 Verificação concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await pool.end();
  }
}

checkRelatedTables();

import pool from './src/config/database.js';

async function checkData() {
  try {
    console.log('🔍 Verificando dados no banco...');
    
    // Verificar usuários
    const users = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log(`👥 Usuários: ${users.rows[0].count}`);
    
    // Verificar projetos
    const projects = await pool.query('SELECT COUNT(*) as count FROM projects');
    console.log(`🚀 Projetos: ${projects.rows[0].count}`);
    
    // Listar alguns usuários
    const userList = await pool.query('SELECT id, email, name FROM users LIMIT 5');
    console.log('📋 Usuários encontrados:', userList.rows);
    
    // Listar alguns projetos
    const projectList = await pool.query('SELECT id, title, creator_id FROM projects LIMIT 5');
    console.log('📋 Projetos encontrados:', projectList.rows);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

checkData();

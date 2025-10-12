import pool from './src/config/database.js';
import bcrypt from 'bcryptjs';

async function testSimpleData() {
  const client = await pool.connect();
  
  try {
    console.log('🧪 Testando inserção simples de dados...');
    
    // Testar inserção de usuário
    const password = await bcrypt.hash('password123', 12);
    const userResult = await client.query(`
      INSERT INTO users (email, password, name, bio, skills, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        name = EXCLUDED.name,
        bio = EXCLUDED.bio,
        skills = EXCLUDED.skills,
        is_verified = EXCLUDED.is_verified
      RETURNING id
    `, [
      'teste@startupcollab.com',
      password,
      'Usuário Teste',
      'Usuário para teste de dados sintéticos',
      JSON.stringify(['JavaScript', 'React', 'Node.js']),
      true
    ]);
    
    const userId = userResult.rows[0].id;
    console.log(`✅ Usuário criado com ID: ${userId}`);
    
    // Testar inserção de projeto
    const projectResult = await client.query(`
      INSERT INTO projects (title, description, objectives, technologies, status, category, creator_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      'Projeto Teste',
      'Projeto para teste de dados sintéticos',
      JSON.stringify(['Objetivo 1', 'Objetivo 2']),
      JSON.stringify(['React', 'Node.js', 'PostgreSQL']),
      'development',
      'general',
      userId
    ]);
    
    if (projectResult.rows.length > 0) {
      const projectId = projectResult.rows[0].id;
      console.log(`✅ Projeto criado com ID: ${projectId}`);
      
      // Testar inserção de solicitação de colaboração
      const requestResult = await client.query(`
        INSERT INTO collaboration_requests (project_id, user_id, status, message)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [
        projectId,
        userId,
        'pending',
        'Mensagem de teste para solicitação de colaboração'
      ]);
      
      if (requestResult.rows.length > 0) {
        console.log(`✅ Solicitação criada com ID: ${requestResult.rows[0].id}`);
      } else {
        console.log('ℹ️ Solicitação já existe (conflito)');
      }
    } else {
      console.log('ℹ️ Projeto já existe (conflito)');
    }
    
    // Verificar dados finais
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_requests
    `);
    
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Solicitações: ${stats.rows[0].total_requests}`);
    
    console.log('\n🎉 Teste simples concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

testSimpleData();

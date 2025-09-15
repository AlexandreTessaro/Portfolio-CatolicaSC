import pool from './src/config/database.js';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
  try {
    console.log('🔄 Iniciando seed do banco de dados...');
    
    // Testar conexão
    await pool.query('SELECT NOW()');
    console.log('✅ Conexão com banco estabelecida');

    // Criar usuário administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await pool.query(`
      INSERT INTO users (email, password, name, bio, skills, is_admin, is_verified)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT (email) DO UPDATE SET
        password = EXCLUDED.password,
        name = EXCLUDED.name,
        bio = EXCLUDED.bio,
        skills = EXCLUDED.skills,
        is_admin = EXCLUDED.is_admin,
        is_verified = EXCLUDED.is_verified
      RETURNING id
    `, [
      'admin@startupcollab.com',
      adminPassword,
      'Administrador',
      'Administrador do sistema Startup Collaboration',
      JSON.stringify(['management', 'leadership', 'strategy']),
      true,
      true
    ]);
    
    console.log('✅ Usuário administrador criado/atualizado');

    // Criar usuário de teste
    const userPassword = await bcrypt.hash('password123', 12);
    const userResult = await pool.query(`
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
      userPassword,
      'Usuário Teste',
      'Usuário para testes',
      JSON.stringify(['JavaScript', 'React', 'Node.js']),
      true
    ]);
    
    console.log('✅ Usuário de teste criado/atualizado');

    // Criar projeto de exemplo
    const projectResult = await pool.query(`
      INSERT INTO projects (title, description, objectives, technologies, status, category, creator_id)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      ON CONFLICT DO NOTHING
      RETURNING id
    `, [
      'Projeto Teste',
      'Um projeto de exemplo para testar a funcionalidade',
      JSON.stringify(['Testar funcionalidades', 'Demonstrar capacidades']),
      JSON.stringify(['React', 'Node.js', 'PostgreSQL']),
      'idea',
      'general',
      userResult.rows[0].id
    ]);
    
    console.log('✅ Projeto de exemplo criado');

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n🔑 Credenciais:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuário: teste@startupcollab.com / password123');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error.message);
    throw error;
  } finally {
    await pool.end();
  }
};

// Executar seed
seedDatabase()
  .then(() => {
    console.log('✅ Seed executado com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha no seed:', error.message);
    process.exit(1);
  });

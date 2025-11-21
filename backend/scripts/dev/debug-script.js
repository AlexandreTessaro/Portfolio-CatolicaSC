import pool from '../../src/config/database.js';
import bcrypt from 'bcryptjs';

async function debugScript() {
  console.log('🔧 Iniciando debug do script...');
  
  try {
    const client = await pool.connect();
    console.log('✅ Cliente conectado');
    
    // Testar inserção de usuário
    console.log('👤 Testando inserção de usuário...');
    const password = await bcrypt.hash('password123', 12);
    console.log('✅ Senha hash gerada');
    
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
      'debug@startupcollab.com',
      password,
      'Usuário Debug',
      'Usuário para debug',
      JSON.stringify(['JavaScript', 'Debug']),
      true
    ]);
    
    console.log('✅ Usuário inserido:', userResult.rows[0]);
    
    client.release();
    await pool.end();
    
    console.log('🎉 Debug concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no debug:', error);
    process.exit(1);
  }
}

debugScript();

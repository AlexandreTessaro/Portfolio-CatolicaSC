import generateRealisticData from './generate-realistic-data.js';
import generateSyntheticData from './generate-synthetic-data.js';
import pool from '../../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedAll() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando geração completa de dados para PRODUÇÃO...');
    console.log('📍 Ambiente:', process.env.NODE_ENV || 'development');
    console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado ✅' : 'Não configurado ⚠️');
    console.log('🏠 DB_HOST:', process.env.DB_HOST || 'Não configurado');
    
    // Verificar conexão
    await client.query('SELECT NOW()');
    console.log('✅ Conexão com banco de dados estabelecida\n');
    
    client.release();
    
    // 1. Seed principal (dados básicos + admin)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('1️⃣ Executando seed principal...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    const { default: seedDatabase } = await import('./seed.js');
    await seedDatabase();
    console.log('✅ Seed principal concluído\n');
    
    // 2. Dados realistas (10 usuários + 10 projetos + matches)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('2️⃣ Executando geração de dados realistas...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await generateRealisticData({
      clearExisting: false,
      includeAdmin: false // Já criado no seed principal
    });
    console.log('✅ Dados realistas gerados\n');
    
    // 3. Dados sintéticos (volume adicional para ter mais dados)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('3️⃣ Executando geração de dados sintéticos...');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    await generateSyntheticData({
      numUsers: 25,
      numProjects: 20,
      numMatches: 50,
      includeAdmin: false,
      clearExisting: false
    });
    console.log('✅ Dados sintéticos gerados\n');
    
    // Estatísticas finais
    const finalClient = await pool.connect();
    const stats = await finalClient.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'pending') as pending_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted') as accepted_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'rejected') as rejected_matches
    `);
    finalClient.release();
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 Geração completa de dados concluída!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de matches: ${stats.rows[0].total_matches}`);
    console.log(`   ⏳ Matches pendentes: ${stats.rows[0].pending_matches}`);
    console.log(`   ✅ Matches aceitos: ${stats.rows[0].accepted_matches}`);
    console.log(`   ❌ Matches rejeitados: ${stats.rows[0].rejected_matches}`);
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: [email]@startupcollab.com / password123');
    
  } catch (error) {
    console.error('\n❌ Erro durante a geração de dados:', error);
    console.error('❌ Mensagem:', error.message);
    if (error.stack) {
      console.error('❌ Stack:', error.stack);
    }
    throw error;
  }
  // Não fechar o pool aqui - pode ser usado por outros módulos
}

// Executar se chamado diretamente (via node ou npm run)
const isMainModule = import.meta.url === `file://${process.argv[1]}` || 
                     process.argv[1]?.endsWith('seed-all.js') ||
                     process.argv[1]?.includes('seed-all.js');

if (isMainModule) {
  seedAll()
    .then(async () => {
      console.log('\n✅ Todos os scripts de seed executados com sucesso');
      await pool.end();
      process.exit(0);
    })
    .catch(async (error) => {
      console.error('\n❌ Falha na execução dos seeds:', error);
      await pool.end();
      process.exit(1);
    });
}

export default seedAll;


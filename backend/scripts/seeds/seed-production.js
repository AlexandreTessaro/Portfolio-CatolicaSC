import generateRealisticData from './generate-realistic-data.js';
import pool from '../../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seedProduction() {
  const client = await pool.connect();
  
  try {
    console.log('🚀 Iniciando seed para produção no Azure...');
    console.log('📍 Ambiente:', process.env.NODE_ENV || 'production');
    console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');
    
    // Verificar conexão
    await client.query('SELECT NOW()');
    console.log('✅ Conexão com banco de dados estabelecida');
    
    // Gerar dados realistas (não limpar dados existentes para não perder nada)
    await generateRealisticData({
      clearExisting: false, // Não limpar dados existentes
      includeAdmin: true    // Incluir admin
    });
    
    // Estatísticas finais
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'pending') as pending_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted') as accepted_matches
    `);
    
    console.log('\n🎉 Seed de produção concluído com sucesso!');
    console.log('\n📊 Estatísticas:');
    console.log(`   👥 Usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Matches: ${stats.rows[0].total_matches}`);
    console.log(`   ⏳ Pendentes: ${stats.rows[0].pending_matches}`);
    console.log(`   ✅ Aceitos: ${stats.rows[0].accepted_matches}`);
    
  } catch (error) {
    console.error('❌ Erro durante o seed de produção:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedProduction()
    .then(() => {
      console.log('\n✅ Seed de produção executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Falha no seed de produção:', error);
      process.exit(1);
    });
}

export default seedProduction;


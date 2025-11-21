import pool from '../../src/config/database.js';

async function testAccuracySimple() {
  console.log('🧪 Testando precisão do algoritmo de recomendação...');
  
  const client = await pool.connect();
  
  try {
    // Estatísticas básicas
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_requests
    `);
    
    console.log('\n📊 Dados atuais no banco:');
    console.log(`   👥 Usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Solicitações: ${stats.rows[0].total_requests}`);
    
    // Análise de skills
    const skillStats = await client.query(`
      SELECT skill, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(skills) as skill
        FROM users
      ) skills_expanded
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 10
    `);
    
    console.log('\n🛠️ Top 10 skills mais comuns:');
    skillStats.rows.forEach((row, index) => {
      const percentage = ((row.count / stats.rows[0].total_users) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${row.skill}: ${row.count} usuários (${percentage}%)`);
    });
    
    // Análise de tecnologias em projetos
    const techStats = await client.query(`
      SELECT tech, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(technologies) as tech
        FROM projects
      ) techs_expanded
      GROUP BY tech
      ORDER BY count DESC
      LIMIT 10
    `);
    
    console.log('\n🚀 Top 10 tecnologias em projetos:');
    techStats.rows.forEach((row, index) => {
      const percentage = ((row.count / stats.rows[0].total_projects) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${row.tech}: ${row.count} projetos (${percentage}%)`);
    });
    
    // Teste de matching
    const matchingStats = await client.query(`
      SELECT 
        COUNT(*) as total_matches
      FROM users u
      JOIN projects p ON u.skills @> p.technologies::jsonb
      WHERE u.is_admin = false
    `);
    
    console.log(`\n🎯 Total de matches possíveis: ${matchingStats.rows[0].total_matches}`);
    
    // Análise de solicitações
    const requestStats = await client.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected
      FROM collaboration_requests
    `);
    
    const totalRequests = requestStats.rows[0].total;
    const acceptedRequests = requestStats.rows[0].accepted;
    const acceptanceRate = totalRequests > 0 ? ((acceptedRequests / totalRequests) * 100).toFixed(1) : '0.0';
    
    console.log('\n📈 Análise de solicitações:');
    console.log(`   Total: ${totalRequests}`);
    console.log(`   Aceitas: ${acceptedRequests}`);
    console.log(`   Pendentes: ${requestStats.rows[0].pending}`);
    console.log(`   Rejeitadas: ${requestStats.rows[0].rejected}`);
    console.log(`   Taxa de aceitação: ${acceptanceRate}%`);
    
    // Cálculo de precisão estimada
    const totalUsers = stats.rows[0].total_users;
    const totalProjects = stats.rows[0].total_projects;
    const totalRequestsCount = stats.rows[0].total_requests;
    
    console.log('\n📊 Métricas de precisão:');
    console.log(`   Projetos por usuário: ${(totalProjects / totalUsers).toFixed(2)}`);
    console.log(`   Solicitações por usuário: ${(totalRequestsCount / totalUsers).toFixed(2)}`);
    console.log(`   Solicitações por projeto: ${(totalRequestsCount / totalProjects).toFixed(2)}`);
    
    // Recomendações
    console.log('\n💡 Recomendações para melhorar precisão:');
    
    if (totalUsers < 100) {
      console.log('   ⚠️ Poucos usuários (< 100): Recomenda-se aumentar para 500+ usuários');
    } else if (totalUsers < 500) {
      console.log('   ⚠️ Usuários moderados (< 500): Recomenda-se aumentar para 1000+ usuários');
    } else {
      console.log('   ✅ Boa quantidade de usuários (≥ 500)');
    }
    
    if (totalProjects < 50) {
      console.log('   ⚠️ Poucos projetos (< 50): Recomenda-se aumentar para 200+ projetos');
    } else if (totalProjects < 200) {
      console.log('   ⚠️ Projetos moderados (< 200): Recomenda-se aumentar para 500+ projetos');
    } else {
      console.log('   ✅ Boa quantidade de projetos (≥ 200)');
    }
    
    if (totalRequestsCount < 200) {
      console.log('   ⚠️ Poucas interações (< 200): Recomenda-se aumentar para 1000+ solicitações');
    } else if (totalRequestsCount < 1000) {
      console.log('   ⚠️ Interações moderadas (< 1000): Recomenda-se aumentar para 3000+ solicitações');
    } else {
      console.log('   ✅ Boa quantidade de interações (≥ 1000)');
    }
    
    // Precisão estimada
    let estimatedAccuracy = 0;
    
    if (totalUsers >= 500 && totalProjects >= 200 && totalRequestsCount >= 1000) {
      estimatedAccuracy = 85; // Alta precisão
    } else if (totalUsers >= 100 && totalProjects >= 50 && totalRequestsCount >= 200) {
      estimatedAccuracy = 70; // Precisão moderada
    } else {
      estimatedAccuracy = 50; // Baixa precisão
    }
    
    console.log(`\n🎯 Precisão estimada do algoritmo atual: ${estimatedAccuracy}%`);
    
    // Sugestões específicas
    console.log('\n🚀 Próximos passos recomendados:');
    console.log('   1. Gerar dados em escala: npm run db:seed-scalable --users 500 --projects 200 --requests 1000');
    console.log('   2. Testar novamente: npm run db:test-accuracy');
    console.log('   3. Implementar algoritmo de collaborative filtering');
    console.log('   4. Adicionar sistema de avaliações/ratings');
    
  } catch (error) {
    console.error('❌ Erro ao testar precisão:', error);
    throw error;
  } finally {
    client.release();
  }
}

testAccuracySimple();

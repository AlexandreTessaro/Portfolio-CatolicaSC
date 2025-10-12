import pool from './src/config/database.js';

// Função para testar precisão do algoritmo de recomendação
async function testRecommendationAccuracy() {
  console.log('🧪 Testando precisão do algoritmo de recomendação...');
  
  const client = await pool.connect();
  
  try {
    // Estatísticas atuais do banco
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
    
    // Análise de diversidade de skills
    const skillStats = await client.query(`
      SELECT skill, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(skills) as skill
        FROM users
      ) skills_expanded
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 20
    `);
    
    console.log('\n🛠️ Distribuição de skills:');
    skillStats.rows.forEach((row, index) => {
      const percentage = ((row.count / stats.rows[0].total_users) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${row.skill}: ${row.count} usuários (${percentage}%)`);
    });
    
    // Análise de diversidade de tecnologias em projetos
    const techStats = await client.query(`
      SELECT tech, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(technologies) as tech
        FROM projects
      ) techs_expanded
      GROUP BY tech
      ORDER BY count DESC
      LIMIT 20
    `);
    
    console.log('\n🚀 Distribuição de tecnologias em projetos:');
    techStats.rows.forEach((row, index) => {
      const percentage = ((row.count / stats.rows[0].total_projects) * 100).toFixed(1);
      console.log(`   ${index + 1}. ${row.tech}: ${row.count} projetos (${percentage}%)`);
    });
    
    // Teste de matching entre skills de usuários e tecnologias de projetos
    const matchingStats = await client.query(`
      SELECT 
        u.id as user_id,
        u.name as user_name,
        u.skills as user_skills,
        COUNT(p.id) as matching_projects
      FROM users u
      LEFT JOIN projects p ON u.skills @> p.technologies::jsonb
      WHERE u.is_admin = false
      GROUP BY u.id, u.name, u.skills
      ORDER BY matching_projects DESC
      LIMIT 10
    `);
    
    console.log('\n🎯 Usuários com mais projetos compatíveis:');
    matchingStats.rows.forEach((row, index) => {
      const skills = JSON.parse(row.user_skills);
      console.log(`   ${index + 1}. ${row.user_name}: ${row.matching_projects} projetos compatíveis`);
      console.log(`      Skills: ${skills.join(', ')}`);
    });
    
    // Análise de solicitações de colaboração
    const requestStats = await client.query(`
      SELECT 
        p.title as project_title,
        p.technologies as project_techs,
        COUNT(cr.id) as total_requests,
        COUNT(CASE WHEN cr.status = 'accepted' THEN 1 END) as accepted_requests,
        COUNT(CASE WHEN cr.status = 'pending' THEN 1 END) as pending_requests,
        COUNT(CASE WHEN cr.status = 'rejected' THEN 1 END) as rejected_requests
      FROM projects p
      LEFT JOIN collaboration_requests cr ON p.id = cr.project_id
      GROUP BY p.id, p.title, p.technologies
      ORDER BY total_requests DESC
      LIMIT 10
    `);
    
    console.log('\n📈 Projetos com mais solicitações:');
    requestStats.rows.forEach((row, index) => {
      const techs = JSON.parse(row.project_techs);
      const acceptanceRate = row.total_requests > 0 ? 
        ((row.accepted_requests / row.total_requests) * 100).toFixed(1) : '0.0';
      console.log(`   ${index + 1}. ${row.project_title}`);
      console.log(`      Tecnologias: ${techs.join(', ')}`);
      console.log(`      Solicitações: ${row.total_requests} (${row.accepted_requests} aceitas, ${row.pending_requests} pendentes, ${row.rejected_requests} rejeitadas)`);
      console.log(`      Taxa de aceitação: ${acceptanceRate}%`);
    });
    
    // Calcular precisão estimada
    const totalUsers = stats.rows[0].total_users;
    const totalProjects = stats.rows[0].total_projects;
    const totalRequests = stats.rows[0].total_requests;
    
    // Métricas de precisão
    const userProjectRatio = totalProjects / totalUsers;
    const requestPerUser = totalRequests / totalUsers;
    const requestPerProject = totalRequests / totalProjects;
    
    console.log('\n📊 Métricas de precisão:');
    console.log(`   Projetos por usuário: ${userProjectRatio.toFixed(2)}`);
    console.log(`   Solicitações por usuário: ${requestPerUser.toFixed(2)}`);
    console.log(`   Solicitações por projeto: ${requestPerProject.toFixed(2)}`);
    
    // Recomendações baseadas nos dados
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
    
    if (totalRequests < 200) {
      console.log('   ⚠️ Poucas interações (< 200): Recomenda-se aumentar para 1000+ solicitações');
    } else if (totalRequests < 1000) {
      console.log('   ⚠️ Interações moderadas (< 1000): Recomenda-se aumentar para 3000+ solicitações');
    } else {
      console.log('   ✅ Boa quantidade de interações (≥ 1000)');
    }
    
    // Análise de cobertura de skills
    const uniqueSkills = skillStats.rows.length;
    const skillCoverage = (uniqueSkills / 50) * 100; // Assumindo ~50 skills principais
    
    console.log(`\n🎯 Cobertura de skills: ${uniqueSkills} skills únicas (${skillCoverage.toFixed(1)}% de cobertura)`);
    
    if (skillCoverage < 60) {
      console.log('   ⚠️ Baixa cobertura de skills: Adicionar mais usuários com skills diversas');
    } else if (skillCoverage < 80) {
      console.log('   ⚠️ Cobertura moderada de skills: Melhorar diversidade de skills');
    } else {
      console.log('   ✅ Boa cobertura de skills');
    }
    
    // Precisão estimada do algoritmo atual
    let estimatedAccuracy = 0;
    
    if (totalUsers >= 500 && totalProjects >= 200 && totalRequests >= 1000) {
      estimatedAccuracy = 85; // Alta precisão
    } else if (totalUsers >= 100 && totalProjects >= 50 && totalRequests >= 200) {
      estimatedAccuracy = 70; // Precisão moderada
    } else {
      estimatedAccuracy = 50; // Baixa precisão
    }
    
    console.log(`\n🎯 Precisão estimada do algoritmo atual: ${estimatedAccuracy}%`);
    
    if (estimatedAccuracy < 70) {
      console.log('   ⚠️ Precisão baixa: Recomenda-se aumentar significativamente os dados');
    } else if (estimatedAccuracy < 85) {
      console.log('   ⚠️ Precisão moderada: Melhorias incrementais recomendadas');
    } else {
      console.log('   ✅ Precisão alta: Algoritmo funcionando bem');
    }
    
    // Sugestões específicas
    console.log('\n🚀 Próximos passos recomendados:');
    console.log('   1. Gerar dados em escala com: npm run db:seed-scalable');
    console.log('   2. Implementar algoritmo de collaborative filtering');
    console.log('   3. Adicionar sistema de avaliações/ratings');
    console.log('   4. Implementar machine learning para personalização');
    console.log('   5. Adicionar análise de comportamento do usuário');
    
  } catch (error) {
    console.error('❌ Erro ao testar precisão:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  testRecommendationAccuracy()
    .then(() => {
      console.log('\n✅ Teste de precisão concluído!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha no teste de precisão:', error);
      process.exit(1);
    });
}

export default testRecommendationAccuracy;

import pool from '../src/config/database.js';
import dotenv from 'dotenv';

dotenv.config();

// Função para limpar todos os dados
async function clearAllData() {
  const client = await pool.connect();
  
  try {
    console.log('🧹 Limpando todos os dados...');
    
    await client.query('DELETE FROM collaboration_requests');
    console.log('✅ Solicitações de colaboração removidas');
    
    await client.query('DELETE FROM projects');
    console.log('✅ Projetos removidos');
    
    await client.query('DELETE FROM users WHERE is_admin = false');
    console.log('✅ Usuários não-admin removidos');
    
    console.log('🎉 Limpeza concluída!');
    
  } catch (error) {
    console.error('❌ Erro durante a limpeza:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para mostrar estatísticas do banco
async function showStats() {
  const client = await pool.connect();
  
  try {
    console.log('📊 Estatísticas do banco de dados:');
    
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM users WHERE is_admin = true) as admin_users,
        (SELECT COUNT(*) FROM users WHERE is_verified = true) as verified_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'idea') as idea_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'planning') as planning_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'development') as development_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'testing') as testing_projects,
        (SELECT COUNT(*) FROM projects WHERE status = 'launched') as launched_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'pending') as pending_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted') as accepted_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'rejected') as rejected_matches
    `);
    
    const data = stats.rows[0];
    
    console.log('\n👥 Usuários:');
    console.log(`   Total: ${data.total_users}`);
    console.log(`   Administradores: ${data.admin_users}`);
    console.log(`   Verificados: ${data.verified_users}`);
    
    console.log('\n🚀 Projetos:');
    console.log(`   Total: ${data.total_projects}`);
    console.log(`   Ideia: ${data.idea_projects}`);
    console.log(`   Planejamento: ${data.planning_projects}`);
    console.log(`   Desenvolvimento: ${data.development_projects}`);
    console.log(`   Testes: ${data.testing_projects}`);
    console.log(`   Lançados: ${data.launched_projects}`);
    
    console.log('\n🤝 Solicitações de Colaboração:');
    console.log(`   Total: ${data.total_matches}`);
    console.log(`   Pendentes: ${data.pending_matches}`);
    console.log(`   Aceitas: ${data.accepted_matches}`);
    console.log(`   Rejeitadas: ${data.rejected_matches}`);
    
    // Mostrar projetos por categoria
    const categories = await client.query(`
      SELECT category, COUNT(*) as count 
      FROM projects 
      GROUP BY category 
      ORDER BY count DESC
    `);
    
    if (categories.rows.length > 0) {
      console.log('\n📂 Projetos por categoria:');
      categories.rows.forEach(row => {
        console.log(`   ${row.category}: ${row.count}`);
      });
    }
    
    // Mostrar skills mais comuns
    const skills = await client.query(`
      SELECT skill, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(skills) as skill
        FROM users
      ) skills_expanded
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 10
    `);
    
    if (skills.rows.length > 0) {
      console.log('\n🛠️ Skills mais comuns:');
      skills.rows.forEach(row => {
        console.log(`   ${row.skill}: ${row.count} usuários`);
      });
    }
    
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para mostrar usuários
async function showUsers(limit = 10) {
  const client = await pool.connect();
  
  try {
    console.log(`👥 Últimos ${limit} usuários:`);
    
    const users = await client.query(`
      SELECT id, name, email, bio, skills, is_admin, is_verified, created_at
      FROM users
      ORDER BY created_at DESC
      LIMIT $1
    `, [limit]);
    
    users.rows.forEach(user => {
      console.log(`\n   ID: ${user.id}`);
      console.log(`   Nome: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Bio: ${user.bio}`);
      console.log(`   Skills: ${JSON.parse(user.skills).join(', ')}`);
      console.log(`   Admin: ${user.is_admin ? 'Sim' : 'Não'}`);
      console.log(`   Verificado: ${user.is_verified ? 'Sim' : 'Não'}`);
      console.log(`   Criado em: ${user.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter usuários:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para mostrar projetos
async function showProjects(limit = 10) {
  const client = await pool.connect();
  
  try {
    console.log(`🚀 Últimos ${limit} projetos:`);
    
    const projects = await client.query(`
      SELECT p.id, p.title, p.description, p.status, p.category, p.technologies, p.created_at,
             u.name as creator_name
      FROM projects p
      JOIN users u ON p.creator_id = u.id
      ORDER BY p.created_at DESC
      LIMIT $1
    `, [limit]);
    
    projects.rows.forEach(project => {
      console.log(`\n   ID: ${project.id}`);
      console.log(`   Título: ${project.title}`);
      console.log(`   Descrição: ${project.description.substring(0, 100)}...`);
      console.log(`   Status: ${project.status}`);
      console.log(`   Categoria: ${project.category}`);
      console.log(`   Tecnologias: ${JSON.parse(project.technologies).join(', ')}`);
      console.log(`   Criador: ${project.creator_name}`);
      console.log(`   Criado em: ${project.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter projetos:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para mostrar matches
async function showMatches(limit = 10) {
  const client = await pool.connect();
  
  try {
    console.log(`🤝 Últimos ${limit} matches:`);
    
    const matches = await client.query(`
      SELECT m.id, m.status, m.message, m.created_at,
             p.title as project_title,
             u.name as user_name
      FROM collaboration_requests m
      JOIN projects p ON m.project_id = p.id
      JOIN users u ON m.user_id = u.id
      ORDER BY m.created_at DESC
      LIMIT $1
    `, [limit]);
    
    matches.rows.forEach(match => {
      console.log(`\n   ID: ${match.id}`);
      console.log(`   Status: ${match.status}`);
      console.log(`   Projeto: ${match.project_title}`);
      console.log(`   Usuário: ${match.user_name}`);
      console.log(`   Mensagem: ${match.message.substring(0, 100)}...`);
      console.log(`   Criado em: ${match.created_at}`);
    });
    
  } catch (error) {
    console.error('❌ Erro ao obter matches:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função para exportar dados
async function exportData() {
  const client = await pool.connect();
  
  try {
    console.log('📤 Exportando dados...');
    
    const users = await client.query('SELECT * FROM users ORDER BY created_at');
    const projects = await client.query('SELECT * FROM projects ORDER BY created_at');
    const matches = await client.query('SELECT * FROM collaboration_requests ORDER BY created_at');
    
    const exportData = {
      users: users.rows,
      projects: projects.rows,
      matches: matches.rows,
      exported_at: new Date().toISOString()
    };
    
    console.log('✅ Dados exportados:');
    console.log(`   Usuários: ${users.rows.length}`);
    console.log(`   Projetos: ${projects.rows.length}`);
    console.log(`   Matches: ${matches.rows.length}`);
    
    return exportData;
    
  } catch (error) {
    console.error('❌ Erro ao exportar dados:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Função principal
async function main() {
  const command = process.argv[2];
  const args = process.argv.slice(3);
  
  try {
    switch (command) {
      case 'stats':
        await showStats();
        break;
        
      case 'users':
        const userLimit = args[0] ? parseInt(args[0]) : 10;
        await showUsers(userLimit);
        break;
        
      case 'projects':
        const projectLimit = args[0] ? parseInt(args[0]) : 10;
        await showProjects(projectLimit);
        break;
        
      case 'matches':
        const matchLimit = args[0] ? parseInt(args[0]) : 10;
        await showMatches(matchLimit);
        break;
        
      case 'clear':
        await clearAllData();
        break;
        
      case 'export':
        const data = await exportData();
        console.log('\n📄 Dados exportados (use JSON.stringify para ver o conteúdo completo)');
        break;
        
      case 'help':
      default:
        console.log('🛠️ Gerenciador de Dados Sintéticos');
        console.log('\nComandos disponíveis:');
        console.log('   node data-manager.js stats                    - Mostrar estatísticas');
        console.log('   node data-manager.js users [limite]          - Mostrar usuários (padrão: 10)');
        console.log('   node data-manager.js projects [limite]       - Mostrar projetos (padrão: 10)');
        console.log('   node data-manager.js matches [limite]        - Mostrar matches (padrão: 10)');
        console.log('   node data-manager.js clear                   - Limpar todos os dados');
        console.log('   node data-manager.js export                  - Exportar dados');
        console.log('   node data-manager.js help                    - Mostrar esta ajuda');
        break;
    }
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
    process.exit(1);
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { clearAllData, showStats, showUsers, showProjects, showMatches, exportData };

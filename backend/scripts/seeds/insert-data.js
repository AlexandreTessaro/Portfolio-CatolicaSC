import pool from '../../src/config/database.js';
import bcrypt from 'bcryptjs';

async function insertData() {
  console.log('🔄 Inserindo dados sintéticos...');
  
  const client = await pool.connect();
  
  try {
    // Inserir usuários
    const users = [
      {
        name: 'João Silva',
        email: 'joao.silva@startupcollab.com',
        bio: 'Desenvolvedor Full Stack com 5 anos de experiência.',
        skills: ['JavaScript', 'React', 'Node.js', 'PostgreSQL']
      },
      {
        name: 'Maria Santos',
        email: 'maria.santos@startupcollab.com',
        bio: 'Designer UX/UI especializada em produtos digitais.',
        skills: ['Figma', 'Adobe XD', 'Prototipagem', 'User Research']
      },
      {
        name: 'Pedro Costa',
        email: 'pedro.costa@startupcollab.com',
        bio: 'Product Manager com background em startups.',
        skills: ['Product Management', 'Agile', 'Scrum', 'Analytics']
      }
    ];
    
    const userIds = [];
    
    for (const user of users) {
      const password = await bcrypt.hash('password123', 12);
      const result = await client.query(`
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
        user.email,
        password,
        user.name,
        user.bio,
        JSON.stringify(user.skills),
        true
      ]);
      
      userIds.push(result.rows[0].id);
      console.log(`✅ Usuário ${user.name} criado com ID: ${result.rows[0].id}`);
    }
    
    // Inserir projetos
    const projects = [
      {
        title: 'EcoTracker - Monitoramento de Pegada de Carbono',
        description: 'Aplicativo mobile para rastrear pegada de carbono.',
        objectives: ['Reduzir pegada de carbono', 'Educar sobre sustentabilidade'],
        technologies: ['React Native', 'Node.js', 'PostgreSQL'],
        status: 'development',
        category: 'sustainability',
        creatorId: userIds[0]
      },
      {
        title: 'LearnFlow - Plataforma de Aprendizado',
        description: 'Sistema de aprendizado online com IA.',
        objectives: ['Personalizar aprendizado', 'Aumentar retenção'],
        technologies: ['React', 'Python', 'TensorFlow'],
        status: 'planning',
        category: 'education',
        creatorId: userIds[1]
      }
    ];
    
    const projectIds = [];
    
    for (const project of projects) {
      const result = await client.query(`
        INSERT INTO projects (title, description, objectives, technologies, status, category, creator_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
        RETURNING id
      `, [
        project.title,
        project.description,
        JSON.stringify(project.objectives),
        JSON.stringify(project.technologies),
        project.status,
        project.category,
        project.creatorId
      ]);
      
      if (result.rows.length > 0) {
        projectIds.push(result.rows[0].id);
        console.log(`✅ Projeto ${project.title} criado com ID: ${result.rows[0].id}`);
      }
    }
    
    // Inserir solicitações de colaboração
    const requests = [
      {
        projectId: projectIds[0],
        userId: userIds[1],
        message: 'Gostaria de contribuir com este projeto! Tenho experiência em design.',
        status: 'pending'
      },
      {
        projectId: projectIds[0],
        userId: userIds[2],
        message: 'Interessante projeto! Posso ajudar com product management.',
        status: 'accepted'
      },
      {
        projectId: projectIds[1],
        userId: userIds[0],
        message: 'Adorei a proposta! Posso contribuir com desenvolvimento.',
        status: 'pending'
      }
    ];
    
    for (const request of requests) {
      if (request.projectId && request.userId) {
        const result = await client.query(`
          INSERT INTO collaboration_requests (project_id, user_id, status, message)
          VALUES ($1, $2, $3, $4)
          ON CONFLICT DO NOTHING
          RETURNING id
        `, [
          request.projectId,
          request.userId,
          request.status,
          request.message
        ]);
        
        if (result.rows.length > 0) {
          console.log(`✅ Solicitação criada com ID: ${result.rows[0].id}`);
        }
      }
    }
    
    // Estatísticas finais
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
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   João Silva: joao.silva@startupcollab.com / password123');
    console.log('   Maria Santos: maria.santos@startupcollab.com / password123');
    console.log('   Pedro Costa: pedro.costa@startupcollab.com / password123');
    
    console.log('\n🎉 Dados sintéticos inseridos com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao inserir dados:', error);
    throw error;
  } finally {
    client.release();
  }
}

insertData();

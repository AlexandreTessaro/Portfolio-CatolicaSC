import pool from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const seedDatabase = async () => {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando seed do banco de dados...');

    // Criar usuário administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    await client.query(`
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

    // Criar usuários de exemplo
    const usersData = [
      {
        email: 'joao@startupcollab.com',
        password: await bcrypt.hash('password123', 12),
        name: 'João Silva',
        bio: 'Desenvolvedor Full Stack apaixonado por inovação e tecnologia',
        skills: ['JavaScript', 'React', 'Node.js', 'Python', 'PostgreSQL']
      },
      {
        email: 'maria@startupcollab.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Maria Santos',
        bio: 'Designer UX/UI com foco em experiências digitais memoráveis',
        skills: ['Figma', 'Adobe XD', 'Prototipagem', 'User Research', 'Design System']
      },
      {
        email: 'pedro@startupcollab.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Pedro Costa',
        bio: 'Especialista em Marketing Digital e Growth Hacking',
        skills: ['Marketing Digital', 'SEO', 'Google Ads', 'Analytics', 'Growth Hacking']
      },
      {
        email: 'ana@startupcollab.com',
        password: await bcrypt.hash('password123', 12),
        name: 'Ana Oliveira',
        bio: 'Product Manager com experiência em startups e produtos digitais',
        skills: ['Product Management', 'Agile', 'User Stories', 'A/B Testing', 'Data Analysis']
      }
    ];

    const userIds = [];
    for (const userData of usersData) {
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
        userData.email,
        userData.password,
        userData.name,
        userData.bio,
        JSON.stringify(userData.skills),
        true
      ]);
      
      userIds.push(result.rows[0].id);
    }
    console.log('✅ Usuários de exemplo criados/atualizados');

    // Criar projetos de exemplo
    const projectsData = [
      {
        title: 'EcoTracker - App de Sustentabilidade',
        description: 'Aplicativo mobile para rastrear e reduzir a pegada de carbono do usuário, com gamificação e desafios sustentáveis.',
        objectives: [
          'Reduzir pegada de carbono em 20%',
          'Educar usuários sobre sustentabilidade',
          'Criar comunidade engajada'
        ],
        technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Firebase'],
        status: 'planning',
        category: 'sustainability',
        creatorId: userIds[0]
      },
      {
        title: 'LearnFlow - Plataforma de Educação',
        description: 'Plataforma online de aprendizado adaptativo que personaliza o conteúdo baseado no perfil e progresso do aluno.',
        objectives: [
          'Personalizar experiência de aprendizado',
          'Aumentar retenção de conhecimento',
          'Suportar múltiplos formatos de conteúdo'
        ],
        technologies: ['React', 'TypeScript', 'Python', 'TensorFlow', 'MongoDB'],
        status: 'development',
        category: 'education',
        creatorId: userIds[3]
      },
      {
        title: 'HealthConnect - Telemedicina',
        description: 'Plataforma de telemedicina que conecta pacientes a médicos especialistas, com agendamento online e consultas por vídeo.',
        objectives: [
          'Facilitar acesso à saúde',
          'Reduzir tempo de espera',
          'Melhorar experiência do paciente'
        ],
        technologies: ['Vue.js', 'Laravel', 'WebRTC', 'Redis', 'MySQL'],
        status: 'testing',
        category: 'healthcare',
        creatorId: userIds[1]
      },
      {
        title: 'SmartHome Hub',
        description: 'Sistema centralizado para automação residencial, controlando iluminação, segurança, temperatura e entretenimento.',
        objectives: [
          'Automatizar tarefas domésticas',
          'Melhorar segurança residencial',
          'Reduzir consumo de energia'
        ],
        technologies: ['Python', 'IoT', 'MQTT', 'Docker', 'InfluxDB'],
        status: 'idea',
        category: 'iot',
        creatorId: userIds[2]
      }
    ];

    for (const projectData of projectsData) {
      await client.query(`
        INSERT INTO projects (title, description, objectives, technologies, status, category, creator_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        ON CONFLICT DO NOTHING
      `, [
        projectData.title,
        projectData.description,
        JSON.stringify(projectData.objectives),
        JSON.stringify(projectData.technologies),
        projectData.status,
        projectData.category,
        projectData.creatorId
      ]);
    }
    console.log('✅ Projetos de exemplo criados');

    // Criar algumas solicitações de colaboração
    const collaborationRequests = [
      {
        projectId: 1,
        userId: userIds[1],
        message: 'Gostaria de contribuir com o design UX/UI do EcoTracker!'
      },
      {
        projectId: 2,
        userId: userIds[0],
        message: 'Posso ajudar com o desenvolvimento frontend do LearnFlow.'
      },
      {
        projectId: 3,
        userId: userIds[2],
        message: 'Interessado em contribuir com estratégias de marketing para o HealthConnect.'
      }
    ];

    for (const request of collaborationRequests) {
      await client.query(`
        INSERT INTO collaboration_requests (project_id, user_id, message)
        VALUES ($1, $2, $3)
        ON CONFLICT DO NOTHING
      `, [request.projectId, request.userId, request.message]);
    }
    console.log('✅ Solicitações de colaboração criadas');

    console.log('🎉 Seed do banco de dados concluído com sucesso!');
    console.log('\n📋 Dados criados:');
    console.log(`   👥 Usuários: ${userIds.length + 1} (incluindo admin)`);
    console.log(`   🚀 Projetos: ${projectsData.length}`);
    console.log(`   🤝 Solicitações de colaboração: ${collaborationRequests.length}`);
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: email@startupcollab.com / password123');
    
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

// Executar seed se o arquivo for executado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => {
      console.log('✅ Seed executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha no seed:', error);
      process.exit(1);
    });
}

export default seedDatabase;

import pool from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Dados sintéticos simplificados
const USERS = [
  {
    name: 'João Silva',
    email: 'joao.silva@startupcollab.com',
    bio: 'Desenvolvedor Full Stack com 5 anos de experiência em React, Node.js e PostgreSQL.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS']
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@startupcollab.com',
    bio: 'Designer UX/UI especializada em produtos digitais e design systems.',
    skills: ['Figma', 'Adobe XD', 'Prototipagem', 'User Research', 'Design System']
  },
  {
    name: 'Pedro Costa',
    email: 'pedro.costa@startupcollab.com',
    bio: 'Product Manager com background em startups e análise de dados.',
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Growth Hacking']
  },
  {
    name: 'Ana Oliveira',
    email: 'ana.oliveira@startupcollab.com',
    bio: 'Especialista em Marketing Digital e Growth com experiência em SEO e Google Ads.',
    skills: ['Marketing Digital', 'SEO', 'Google Ads', 'Content Marketing', 'Analytics']
  },
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes@startupcollab.com',
    bio: 'Engenheiro de Software com expertise em arquitetura de sistemas distribuídos.',
    skills: ['Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'Microservices']
  }
];

const PROJECTS = [
  {
    title: 'EcoTracker - Monitoramento de Pegada de Carbono',
    description: 'Aplicativo mobile que permite aos usuários rastrear sua pegada de carbono diária através de atividades como transporte, alimentação e consumo de energia.',
    objectives: ['Reduzir pegada de carbono em 25%', 'Educar sobre práticas sustentáveis', 'Criar comunidade engajada'],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Firebase'],
    status: 'development',
    category: 'sustainability'
  },
  {
    title: 'LearnFlow - Plataforma de Aprendizado Adaptativo',
    description: 'Sistema de aprendizado online que utiliza IA para personalizar o conteúdo educacional baseado no perfil e progresso de cada aluno.',
    objectives: ['Personalizar experiência de aprendizado', 'Aumentar retenção de conhecimento', 'Suportar múltiplos formatos'],
    technologies: ['React', 'TypeScript', 'Python', 'TensorFlow', 'MongoDB'],
    status: 'planning',
    category: 'education'
  },
  {
    title: 'HealthConnect - Plataforma de Telemedicina',
    description: 'Sistema completo de telemedicina que conecta pacientes a médicos especialistas com agendamento online e consultas por vídeo.',
    objectives: ['Facilitar acesso à saúde', 'Reduzir tempo de espera', 'Melhorar experiência do paciente'],
    technologies: ['Vue.js', 'Laravel', 'WebRTC', 'Redis', 'MySQL'],
    status: 'testing',
    category: 'healthcare'
  },
  {
    title: 'FinTechFlow - Plataforma de Gestão Financeira',
    description: 'Aplicativo de gestão financeira pessoal e empresarial com IA para categorização automática e insights de gastos.',
    objectives: ['Automatizar categorização de gastos', 'Fornecer insights financeiros', 'Facilitar planejamento'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    status: 'development',
    category: 'fintech'
  },
  {
    title: 'LocalMarket - Marketplace de Produtos Locais',
    description: 'Plataforma de e-commerce focada em conectar produtores locais com consumidores com sistema de avaliações.',
    objectives: ['Apoiar produtores locais', 'Reduzir custos de logística', 'Promover consumo consciente'],
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    status: 'idea',
    category: 'ecommerce'
  }
];

const REQUESTS = [
  'Gostaria muito de contribuir com este projeto! Tenho experiência na área e acredito que posso agregar valor.',
  'Interessante projeto! Posso ajudar com desenvolvimento e tenho algumas ideias que podem ser úteis.',
  'Adorei a proposta! Posso contribuir com desenvolvimento e estou disponível para colaborar.',
  'Excelente ideia! Tenho experiência em projetos similares e gostaria de participar.',
  'Interessado em colaborar! Posso ajudar com desenvolvimento e tenho disponibilidade para dedicar tempo ao projeto.',
  'Projeto alinhado com meus interesses! Posso contribuir com desenvolvimento e trazer novas perspectivas.',
  'Gostaria de fazer parte desta iniciativa! Tenho experiência e estou motivado para contribuir.',
  'Projeto inovador! Posso ajudar com desenvolvimento e tenho ideias para potencializar os resultados.',
  'Adorei a proposta! Tenho background relevante e gostaria de colaborar ativamente.',
  'Interessante iniciativa! Posso contribuir com desenvolvimento e trazer experiência valiosa.'
];

async function generateSimpleData() {
  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando geração de dados sintéticos simplificados...');

    const userIds = [];

    // Criar usuário administrador
    const adminPassword = await bcrypt.hash('admin123', 12);
    const adminResult = await client.query(`
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
    userIds.push(adminResult.rows[0].id);
    console.log('✅ Usuário administrador criado/atualizado');

    // Criar usuários sintéticos
    console.log('👥 Criando usuários sintéticos...');
    for (const userData of USERS) {
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
        userData.email,
        password,
        userData.name,
        userData.bio,
        JSON.stringify(userData.skills),
        true
      ]);
      
      userIds.push(result.rows[0].id);
    }
    console.log(`✅ ${USERS.length} usuários sintéticos criados`);

    // Criar projetos sintéticos
    console.log('🚀 Criando projetos sintéticos...');
    const projectIds = [];
    for (let i = 0; i < PROJECTS.length; i++) {
      const project = PROJECTS[i];
      // Atribuir criador aleatório (exceto admin)
      const creatorId = userIds[Math.floor(Math.random() * (userIds.length - 1)) + 1];
      
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
        creatorId
      ]);
      
      if (result.rows.length > 0) {
        projectIds.push(result.rows[0].id);
      }
    }
    console.log(`✅ ${projectIds.length} projetos sintéticos criados`);

    // Criar solicitações de colaboração
    console.log('🤝 Criando solicitações de colaboração...');
    let requestsCreated = 0;
    
    for (const projectId of projectIds) {
      // Criar 2-3 solicitações por projeto
      const numRequests = Math.floor(Math.random() * 2) + 2;
      
      for (let j = 0; j < numRequests; j++) {
        // Escolher usuário aleatório (não pode ser o criador do projeto)
        let userId;
        let attempts = 0;
        do {
          userId = userIds[Math.floor(Math.random() * userIds.length)];
          attempts++;
        } while (userId === (await client.query('SELECT creator_id FROM projects WHERE id = $1', [projectId])).rows[0]?.creator_id && attempts < 10);
        
        // Verificar se já existe solicitação
        const existingRequest = await client.query(
          'SELECT id FROM collaboration_requests WHERE user_id = $1 AND project_id = $2',
          [userId, projectId]
        );
        
        if (existingRequest.rows.length === 0) {
          const message = REQUESTS[Math.floor(Math.random() * REQUESTS.length)];
          const statuses = ['pending', 'accepted', 'rejected'];
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          
          await client.query(`
            INSERT INTO collaboration_requests (project_id, user_id, status, message)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [projectId, userId, status, message]);
          
          requestsCreated++;
        }
      }
    }
    console.log(`✅ ${requestsCreated} solicitações de colaboração criadas`);

    // Estatísticas finais
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_requests,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'pending') as pending_requests,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted') as accepted_requests,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'rejected') as rejected_requests
    `);

    console.log('\n🎉 Geração de dados sintéticos simplificados concluída!');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de solicitações: ${stats.rows[0].total_requests}`);
    console.log(`   ⏳ Solicitações pendentes: ${stats.rows[0].pending_requests}`);
    console.log(`   ✅ Solicitações aceitas: ${stats.rows[0].accepted_requests}`);
    console.log(`   ❌ Solicitações rejeitadas: ${stats.rows[0].rejected_requests}`);
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: [email específico] / password123');
    
    console.log('\n👥 Usuários criados:');
    USERS.forEach(user => {
      console.log(`   - ${user.name}: ${user.email}`);
    });
    
  } catch (error) {
    console.error('❌ Erro durante a geração de dados:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSimpleData()
    .then(() => {
      console.log('✅ Geração de dados sintéticos simplificados executada com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na geração de dados sintéticos simplificados:', error);
      process.exit(1);
    });
}

export default generateSimpleData;

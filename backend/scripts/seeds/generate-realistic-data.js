import pool from '../../src/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Dados mais realistas e específicos
const REALISTIC_USERS = [
  {
    name: 'João Silva',
    email: 'joao.silva@startupcollab.com',
    bio: 'Desenvolvedor Full Stack com 5 anos de experiência em React, Node.js e PostgreSQL. Apaixonado por criar soluções escaláveis e inovadoras.',
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Git']
  },
  {
    name: 'Maria Santos',
    email: 'maria.santos@startupcollab.com',
    bio: 'Designer UX/UI especializada em produtos digitais. Experiência em design systems, prototipagem e pesquisa de usuários.',
    skills: ['Figma', 'Adobe XD', 'Prototipagem', 'User Research', 'Design System', 'HTML5', 'CSS3', 'JavaScript']
  },
  {
    name: 'Pedro Costa',
    email: 'pedro.costa@startupcollab.com',
    bio: 'Product Manager com background em startups. Foco em estratégia de produto, análise de dados e growth hacking.',
    skills: ['Product Management', 'Agile', 'Scrum', 'Analytics', 'Growth Hacking', 'A/B Testing', 'Data Analysis']
  },
  {
    name: 'Ana Oliveira',
    email: 'ana.oliveira@startupcollab.com',
    bio: 'Especialista em Marketing Digital e Growth. Experiência em SEO, Google Ads, redes sociais e automação de marketing.',
    skills: ['Marketing Digital', 'SEO', 'Google Ads', 'Facebook Ads', 'Content Marketing', 'Email Marketing', 'Analytics']
  },
  {
    name: 'Carlos Mendes',
    email: 'carlos.mendes@startupcollab.com',
    bio: 'Engenheiro de Software com expertise em arquitetura de sistemas distribuídos e DevOps. Experiência em Python, Java e cloud.',
    skills: ['Python', 'Java', 'Docker', 'Kubernetes', 'AWS', 'Terraform', 'Jenkins', 'Microservices']
  },
  {
    name: 'Lucia Fernandes',
    email: 'lucia.fernandes@startupcollab.com',
    bio: 'Data Scientist com foco em Machine Learning e análise preditiva. Experiência em Python, TensorFlow e visualização de dados.',
    skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'NumPy', 'SQL', 'Tableau', 'Statistics']
  },
  {
    name: 'Roberto Alves',
    email: 'roberto.alves@startupcollab.com',
    bio: 'Desenvolvedor Mobile especializado em React Native e Flutter. Experiência em apps nativos e híbridos.',
    skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase', 'App Store', 'Google Play', 'Mobile UX']
  },
  {
    name: 'Juliana Rocha',
    email: 'juliana.rocha@startupcollab.com',
    bio: 'Especialista em Fintech e Blockchain. Experiência em desenvolvimento de soluções financeiras e contratos inteligentes.',
    skills: ['Blockchain', 'Solidity', 'Web3.js', 'Ethereum', 'DeFi', 'Smart Contracts', 'Cryptocurrency', 'Financial APIs']
  },
  {
    name: 'Marcos Pereira',
    email: 'marcos.pereira@startupcollab.com',
    bio: 'Consultor em Transformação Digital e Inovação. Experiência em estratégia tecnológica e implementação de soluções enterprise.',
    skills: ['Digital Transformation', 'Strategy', 'Enterprise Architecture', 'Change Management', 'Innovation', 'Consulting']
  },
  {
    name: 'Camila Lima',
    email: 'camila.lima@startupcollab.com',
    bio: 'Especialista em Sustentabilidade e Impacto Social. Experiência em projetos ESG e tecnologias verdes.',
    skills: ['Sustainability', 'ESG', 'Green Technology', 'Impact Measurement', 'Social Innovation', 'Environmental Science']
  }
];

const REALISTIC_PROJECTS = [
  {
    title: 'EcoTracker - Monitoramento de Pegada de Carbono',
    description: 'Aplicativo mobile que permite aos usuários rastrear sua pegada de carbono diária através de atividades como transporte, alimentação e consumo de energia. Inclui gamificação, desafios sustentáveis e recomendações personalizadas para reduzir o impacto ambiental.',
    objectives: [
      'Reduzir pegada de carbono dos usuários em 25%',
      'Educar sobre práticas sustentáveis',
      'Criar comunidade engajada em sustentabilidade',
      'Fornecer dados para políticas públicas'
    ],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Firebase', 'IoT Sensors'],
    status: 'development',
    category: 'sustainability',
    creatorId: null // Será definido dinamicamente
  },
  {
    title: 'LearnFlow - Plataforma de Aprendizado Adaptativo',
    description: 'Sistema de aprendizado online que utiliza IA para personalizar o conteúdo educacional baseado no perfil, progresso e estilo de aprendizado de cada aluno. Suporta múltiplos formatos de conteúdo e oferece feedback em tempo real.',
    objectives: [
      'Personalizar experiência de aprendizado',
      'Aumentar retenção de conhecimento em 40%',
      'Suportar múltiplos estilos de aprendizado',
      'Fornecer analytics detalhados para educadores'
    ],
    technologies: ['React', 'TypeScript', 'Python', 'TensorFlow', 'MongoDB', 'Docker'],
    status: 'planning',
    category: 'education',
    creatorId: null
  },
  {
    title: 'HealthConnect - Plataforma de Telemedicina',
    description: 'Sistema completo de telemedicina que conecta pacientes a médicos especialistas. Inclui agendamento online, consultas por vídeo, prescrições digitais, histórico médico e integração com laboratórios.',
    objectives: [
      'Facilitar acesso à saúde em áreas remotas',
      'Reduzir tempo de espera em 60%',
      'Melhorar experiência do paciente',
      'Integrar com sistemas de saúde existentes'
    ],
    technologies: ['Vue.js', 'Laravel', 'WebRTC', 'Redis', 'MySQL', 'Docker'],
    status: 'testing',
    category: 'healthcare',
    creatorId: null
  },
  {
    title: 'SmartHome Hub - Automação Residencial Inteligente',
    description: 'Sistema centralizado para automação residencial que controla iluminação, segurança, temperatura, entretenimento e eletrodomésticos. Inclui IA para aprendizado de padrões e otimização automática.',
    objectives: [
      'Automatizar 80% das tarefas domésticas',
      'Reduzir consumo de energia em 30%',
      'Melhorar segurança residencial',
      'Criar experiência de usuário intuitiva'
    ],
    technologies: ['Python', 'IoT', 'MQTT', 'Docker', 'InfluxDB', 'Raspberry Pi'],
    status: 'idea',
    category: 'iot',
    creatorId: null
  },
  {
    title: 'FinTechFlow - Plataforma de Gestão Financeira',
    description: 'Aplicativo de gestão financeira pessoal e empresarial com IA para categorização automática, insights de gastos, planejamento de investimentos e integração com bancos e corretoras.',
    objectives: [
      'Automatizar categorização de gastos',
      'Fornecer insights financeiros personalizados',
      'Facilitar planejamento de investimentos',
      'Integrar com múltiplas instituições financeiras'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker'],
    status: 'development',
    category: 'fintech',
    creatorId: null
  },
  {
    title: 'LocalMarket - Marketplace de Produtos Locais',
    description: 'Plataforma de e-commerce focada em conectar produtores locais com consumidores. Inclui sistema de avaliações, logística otimizada e suporte a pagamentos locais.',
    objectives: [
      'Apoiar produtores locais e artesanais',
      'Reduzir custos de logística',
      'Promover consumo consciente',
      'Criar rede de economia local'
    ],
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'Redis'],
    status: 'planning',
    category: 'ecommerce',
    creatorId: null
  },
  {
    title: 'SocialImpact - Rede de Impacto Social',
    description: 'Plataforma que conecta organizações sociais, voluntários e doadores. Inclui sistema de crowdfunding, gestão de voluntariado e métricas de impacto social.',
    objectives: [
      'Amplificar impacto de organizações sociais',
      'Facilitar engajamento de voluntários',
      'Aumentar transparência em doações',
      'Medir e reportar impacto social'
    ],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker'],
    status: 'idea',
    category: 'social',
    creatorId: null
  },
  {
    title: 'CodeReview - Plataforma de Revisão de Código',
    description: 'Ferramenta colaborativa para revisão de código com IA para detecção automática de bugs, análise de qualidade e sugestões de melhoria. Integra com repositórios Git.',
    objectives: [
      'Melhorar qualidade de código em 50%',
      'Reduzir tempo de revisão',
      'Educar sobre boas práticas',
      'Facilitar colaboração em equipe'
    ],
    technologies: ['React', 'Python', 'PostgreSQL', 'GitHub API', 'Docker', 'AWS'],
    status: 'development',
    category: 'general',
    creatorId: null
  },
  {
    title: 'MentorMatch - Sistema de Mentoria Inteligente',
    description: 'Plataforma que conecta mentores e mentorados baseado em objetivos, experiência e disponibilidade. Inclui sistema de matching por IA e ferramentas de acompanhamento.',
    objectives: [
      'Conectar mentores e mentorados eficientemente',
      'Facilitar troca de conhecimento',
      'Acelerar desenvolvimento profissional',
      'Criar rede de mentoria sustentável'
    ],
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Machine Learning', 'AWS', 'Docker'],
    status: 'planning',
    category: 'general',
    creatorId: null
  },
  {
    title: 'GreenEnergy - Monitoramento de Energia Sustentável',
    description: 'Sistema de monitoramento de consumo energético com recomendações de economia, integração com fontes renováveis e relatórios de sustentabilidade para empresas.',
    objectives: [
      'Reduzir consumo energético em 35%',
      'Promover uso de energias renováveis',
      'Fornecer dados para certificações ESG',
      'Otimizar custos energéticos'
    ],
    technologies: ['React', 'Python', 'InfluxDB', 'IoT', 'Docker', 'AWS'],
    status: 'testing',
    category: 'sustainability',
    creatorId: null
  }
];

const REALISTIC_MATCHES = [
  {
    message: 'Gostaria muito de contribuir com o desenvolvimento do EcoTracker! Tenho experiência em React Native e Node.js, e sou apaixonado por projetos de sustentabilidade.',
    status: 'pending'
  },
  {
    message: 'Adorei a proposta do LearnFlow! Posso ajudar com o desenvolvimento do frontend em React e tenho experiência em sistemas de aprendizado adaptativo.',
    status: 'accepted'
  },
  {
    message: 'Interessante projeto de telemedicina! Posso contribuir com o design UX/UI e tenho experiência em produtos de saúde digital.',
    status: 'pending'
  },
  {
    message: 'Excelente ideia para automação residencial! Tenho experiência em IoT e Python, e posso ajudar com a arquitetura do sistema.',
    status: 'accepted'
  },
  {
    message: 'Projeto muito promissor! Posso contribuir com estratégias de marketing digital e growth hacking para o FinTechFlow.',
    status: 'pending'
  },
  {
    message: 'Adorei a proposta do LocalMarket! Posso ajudar com o desenvolvimento backend e tenho experiência em marketplaces.',
    status: 'rejected'
  },
  {
    message: 'Projeto alinhado com meus interesses em impacto social! Posso contribuir com análise de dados e métricas de impacto.',
    status: 'accepted'
  },
  {
    message: 'Interessado em colaborar com o CodeReview! Tenho experiência em desenvolvimento e posso ajudar com a implementação da IA.',
    status: 'pending'
  },
  {
    message: 'Gostaria de fazer parte do MentorMatch! Posso contribuir com o design da experiência do usuário e tenho experiência em plataformas de networking.',
    status: 'pending'
  },
  {
    message: 'Projeto inovador de energia sustentável! Posso ajudar com análise de dados e visualização de métricas de consumo.',
    status: 'accepted'
  }
];

// Função para gerar dados realistas
async function generateRealisticData(options = {}) {
  const {
    clearExisting = false,
    includeAdmin = true
  } = options;

  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando geração de dados realistas...');

    // Limpar dados existentes se solicitado
    if (clearExisting) {
      console.log('🧹 Limpando dados existentes...');
      await client.query('DELETE FROM collaboration_requests');
      await client.query('DELETE FROM projects');
      await client.query('DELETE FROM users WHERE is_admin = false');
      console.log('✅ Dados existentes removidos');
    }

    const userIds = [];

    // Criar usuário administrador
    if (includeAdmin) {
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
    }

    // Criar usuários realistas
    console.log('👥 Criando usuários realistas...');
    for (const userData of REALISTIC_USERS) {
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
    console.log(`✅ ${REALISTIC_USERS.length} usuários realistas criados`);

    // Criar projetos realistas
    console.log('🚀 Criando projetos realistas...');
    const projectIds = [];
    for (let i = 0; i < REALISTIC_PROJECTS.length; i++) {
      const project = REALISTIC_PROJECTS[i];
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
    console.log(`✅ ${projectIds.length} projetos realistas criados`);

    // Criar matches realistas
    console.log('🤝 Criando matches realistas...');
    let matchesCreated = 0;
    
    for (let i = 0; i < projectIds.length; i++) {
      const projectId = projectIds[i];
      
      // Criar 2-4 matches por projeto
      const numMatches = Math.floor(Math.random() * 3) + 2;
      
      for (let j = 0; j < numMatches; j++) {
        // Escolher usuário aleatório (não pode ser o criador do projeto)
        let userId;
        let attempts = 0;
        do {
          userId = userIds[Math.floor(Math.random() * userIds.length)];
          attempts++;
        } while (userId === (await client.query('SELECT creator_id FROM projects WHERE id = $1', [projectId])).rows[0]?.creator_id && attempts < 10);
        
        // Verificar se já existe match
        const existingMatch = await client.query(
          'SELECT id FROM collaboration_requests WHERE user_id = $1 AND project_id = $2',
          [userId, projectId]
        );
        
        if (existingMatch.rows.length === 0) {
          const matchData = REALISTIC_MATCHES[Math.floor(Math.random() * REALISTIC_MATCHES.length)];
          
          await client.query(`
            INSERT INTO collaboration_requests (project_id, user_id, status, message)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT DO NOTHING
          `, [projectId, userId, matchData.status, matchData.message]);
          
          matchesCreated++;
        }
      }
    }
    console.log(`✅ ${matchesCreated} matches realistas criados`);

    // Estatísticas finais
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'pending') as pending_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'accepted') as accepted_matches,
        (SELECT COUNT(*) FROM collaboration_requests WHERE status = 'rejected') as rejected_matches
    `);

    console.log('\n🎉 Geração de dados realistas concluída!');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de matches: ${stats.rows[0].total_matches}`);
    console.log(`   ⏳ Matches pendentes: ${stats.rows[0].pending_matches}`);
    console.log(`   ✅ Matches aceitos: ${stats.rows[0].accepted_matches}`);
    console.log(`   ❌ Matches rejeitados: ${stats.rows[0].rejected_matches}`);
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: [email específico] / password123');
    
    console.log('\n👥 Usuários criados:');
    REALISTIC_USERS.forEach(user => {
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
  const args = process.argv.slice(2);
  const options = {};
  
  // Parse argumentos da linha de comando
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i]?.replace('--', '');
    const value = args[i + 1];
    
    switch (key) {
      case 'clear':
        options.clearExisting = value === 'true';
        break;
      case 'no-admin':
        options.includeAdmin = false;
        break;
    }
  }
  
  generateRealisticData(options)
    .then(() => {
      console.log('✅ Geração de dados realistas executada com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na geração de dados realistas:', error);
      process.exit(1);
    });
}

export default generateRealisticData;

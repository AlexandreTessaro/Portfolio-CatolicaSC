import pool from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Dados sintéticos para geração
const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Fernando', 'Carla',
  'Ricardo', 'Patricia', 'Roberto', 'Juliana', 'Marcos', 'Camila', 'André',
  'Beatriz', 'Felipe', 'Gabriela', 'Rafael', 'Isabela', 'Diego', 'Mariana',
  'Thiago', 'Larissa', 'Bruno', 'Amanda', 'Gustavo', 'Carolina', 'Eduardo',
  'Natália', 'Leonardo', 'Priscila', 'Rodrigo', 'Vanessa', 'Alexandre',
  'Renata', 'Daniel', 'Tatiana', 'Lucas', 'Bianca', 'Vinicius', 'Adriana',
  'Paulo', 'Cristina', 'Antonio', 'Monica', 'Fabio', 'Sandra', 'Marcelo',
  'Claudia', 'Sergio', 'Eliane', 'Mauricio', 'Regina', 'Wagner', 'Silvia'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
  'Pereira', 'Lima', 'Gomes', 'Ribeiro', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro',
  'Cardoso', 'Reis', 'Araujo', 'Castro', 'Nascimento', 'Moreira', 'Correia',
  'Martins', 'Ramos', 'Mendes', 'Freitas', 'Machado', 'Azevedo', 'Cavalcanti',
  'Nunes', 'Teixeira', 'Melo', 'Campos', 'Pinto', 'Costa', 'Morais', 'Nogueira',
  'Guimaraes', 'Moura', 'Borges', 'Coelho', 'Viana', 'Pires', 'Duarte'
];

const SKILLS = [
  // Frontend
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3',
  'SASS', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'Nuxt.js', 'Gatsby',
  
  // Backend
  'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails',
  
  // Mobile
  'React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin',
  
  // Database
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server',
  
  // Cloud & DevOps
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins',
  'Git', 'GitHub Actions', 'Terraform', 'Ansible',
  
  // Design
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'InDesign',
  'Prototipagem', 'User Research', 'Design System', 'UI/UX Design',
  
  // Business
  'Product Management', 'Agile', 'Scrum', 'Kanban', 'Lean Startup',
  'Business Analysis', 'Project Management', 'Marketing Digital',
  'Growth Hacking', 'SEO', 'Google Ads', 'Analytics', 'Data Analysis',
  
  // AI/ML
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas',
  'NumPy', 'Scikit-learn', 'Natural Language Processing', 'Computer Vision',
  
  // Other
  'Blockchain', 'IoT', 'Cybersecurity', 'API Development', 'Microservices',
  'GraphQL', 'REST APIs', 'WebSocket', 'Testing', 'Jest', 'Cypress'
];

const PROJECT_CATEGORIES = [
  'general', 'sustainability', 'education', 'healthcare', 'fintech',
  'ecommerce', 'social', 'gaming', 'iot', 'ai', 'blockchain', 'mobile',
  'web', 'desktop', 'enterprise', 'startup', 'nonprofit'
];

const PROJECT_STATUSES = ['idea', 'planning', 'development', 'testing', 'launched'];

const PROJECT_TITLES = [
  'EcoTracker - App de Sustentabilidade',
  'LearnFlow - Plataforma de Educação',
  'HealthConnect - Telemedicina',
  'SmartHome Hub',
  'FoodieFinder - App de Restaurantes',
  'TaskMaster - Gerenciador de Tarefas',
  'FitTracker - Acompanhamento Fitness',
  'BudgetWise - Controle Financeiro',
  'StudyBuddy - Plataforma de Estudos',
  'PetCare - Cuidados com Animais',
  'TravelPlanner - Planejador de Viagens',
  'EventHub - Gestão de Eventos',
  'CodeReview - Plataforma de Code Review',
  'MentorMatch - Sistema de Mentoria',
  'LocalMarket - Marketplace Local',
  'GreenEnergy - Monitoramento Energético',
  'SocialImpact - Rede de Impacto Social',
  'TechNews - Agregador de Notícias',
  'SkillShare - Compartilhamento de Habilidades',
  'InnovationLab - Laboratório de Inovação'
];

const PROJECT_DESCRIPTIONS = [
  'Aplicativo mobile para rastrear e reduzir a pegada de carbono do usuário, com gamificação e desafios sustentáveis.',
  'Plataforma online de aprendizado adaptativo que personaliza o conteúdo baseado no perfil e progresso do aluno.',
  'Plataforma de telemedicina que conecta pacientes a médicos especialistas, com agendamento online e consultas por vídeo.',
  'Sistema centralizado para automação residencial, controlando iluminação, segurança, temperatura e entretenimento.',
  'Aplicativo que ajuda usuários a descobrir restaurantes locais com base em preferências alimentares e avaliações.',
  'Sistema completo de gerenciamento de tarefas com colaboração em equipe e relatórios de produtividade.',
  'App de fitness que monitora exercícios, dieta e progresso com integração a wearables e redes sociais.',
  'Ferramenta de controle financeiro pessoal com categorização automática e insights de gastos.',
  'Plataforma colaborativa de estudos com salas virtuais, flashcards e sistema de recompensas.',
  'Aplicativo para cuidados com pets incluindo agendamento veterinário, lembretes de vacinas e dicas de saúde.',
  'Sistema inteligente de planejamento de viagens com sugestões personalizadas e orçamento automático.',
  'Plataforma completa para organização de eventos com vendas de ingressos, networking e feedback.',
  'Ferramenta colaborativa para revisão de código com integração a repositórios Git e métricas de qualidade.',
  'Sistema de matching entre mentores e mentorados baseado em objetivos, experiência e disponibilidade.',
  'Marketplace local conectando produtores e consumidores com foco em produtos artesanais e orgânicos.',
  'Sistema de monitoramento de consumo energético com recomendações de economia e relatórios detalhados.',
  'Rede social focada em projetos de impacto social com crowdfunding e voluntariado.',
  'Agregador inteligente de notícias de tecnologia com curadoria por IA e personalização.',
  'Plataforma para compartilhamento de habilidades com sistema de troca e avaliação por pares.',
  'Laboratório virtual de inovação com ferramentas de brainstorming, prototipagem e validação de ideias.'
];

const PROJECT_OBJECTIVES = [
  ['Reduzir pegada de carbono em 20%', 'Educar usuários sobre sustentabilidade', 'Criar comunidade engajada'],
  ['Personalizar experiência de aprendizado', 'Aumentar retenção de conhecimento', 'Suportar múltiplos formatos'],
  ['Facilitar acesso à saúde', 'Reduzir tempo de espera', 'Melhorar experiência do paciente'],
  ['Automatizar tarefas domésticas', 'Melhorar segurança residencial', 'Reduzir consumo de energia'],
  ['Conectar usuários a restaurantes locais', 'Melhorar experiência gastronômica', 'Apoiar negócios locais'],
  ['Aumentar produtividade pessoal', 'Melhorar colaboração em equipe', 'Fornecer insights de performance'],
  ['Motivar prática de exercícios', 'Acompanhar progresso fitness', 'Criar comunidade ativa'],
  ['Educar sobre finanças pessoais', 'Reduzir gastos desnecessários', 'Aumentar poupança'],
  ['Facilitar aprendizado colaborativo', 'Melhorar retenção de conhecimento', 'Criar ambiente motivador'],
  ['Melhorar cuidados com pets', 'Facilitar acesso veterinário', 'Educar sobre saúde animal'],
  ['Simplificar planejamento de viagens', 'Otimizar orçamento de viagem', 'Melhorar experiência turística'],
  ['Facilitar organização de eventos', 'Aumentar participação', 'Melhorar networking'],
  ['Melhorar qualidade de código', 'Facilitar colaboração', 'Educar sobre boas práticas'],
  ['Conectar mentores e mentorados', 'Facilitar troca de conhecimento', 'Acelerar desenvolvimento profissional'],
  ['Apoiar produtores locais', 'Facilitar acesso a produtos artesanais', 'Fortalecer economia local'],
  ['Conscientizar sobre consumo energético', 'Reduzir custos de energia', 'Promover sustentabilidade'],
  ['Amplificar impacto social', 'Facilitar doações', 'Conectar voluntários'],
  ['Manter usuários informados', 'Facilitar descoberta de conteúdo', 'Promover discussões qualificadas'],
  ['Facilitar troca de conhecimentos', 'Criar rede de aprendizado', 'Valorizar habilidades diversas'],
  ['Acelerar processo de inovação', 'Facilitar validação de ideias', 'Conectar inovadores']
];

const TECHNOLOGIES_BY_CATEGORY = {
  'sustainability': ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Firebase', 'IoT'],
  'education': ['React', 'TypeScript', 'Python', 'TensorFlow', 'MongoDB', 'Docker'],
  'healthcare': ['Vue.js', 'Laravel', 'WebRTC', 'Redis', 'MySQL', 'Docker'],
  'iot': ['Python', 'MQTT', 'Docker', 'InfluxDB', 'Raspberry Pi', 'Arduino'],
  'fintech': ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker'],
  'ecommerce': ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AWS', 'Redis'],
  'social': ['React', 'Node.js', 'PostgreSQL', 'Socket.io', 'AWS', 'Redis'],
  'gaming': ['Unity', 'C#', 'Photon', 'AWS', 'MongoDB', 'Docker'],
  'ai': ['Python', 'TensorFlow', 'PyTorch', 'FastAPI', 'PostgreSQL', 'Docker'],
  'blockchain': ['Solidity', 'Web3.js', 'Node.js', 'IPFS', 'Ethereum', 'Docker'],
  'mobile': ['React Native', 'Flutter', 'Firebase', 'AWS', 'MongoDB', 'Docker'],
  'web': ['React', 'Vue.js', 'Angular', 'Node.js', 'PostgreSQL', 'AWS'],
  'desktop': ['Electron', 'React', 'Node.js', 'SQLite', 'AWS', 'Docker'],
  'enterprise': ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kubernetes', 'AWS'],
  'startup': ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis'],
  'nonprofit': ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS', 'Docker'],
  'general': ['React', 'Node.js', 'PostgreSQL', 'AWS', 'Docker', 'Redis']
};

const MATCH_MESSAGES = [
  'Gostaria muito de contribuir com este projeto! Tenho experiência na área e acredito que posso agregar valor.',
  'Interessante projeto! Posso ajudar com desenvolvimento e tenho algumas ideias que podem ser úteis.',
  'Adorei a proposta! Tenho skills em {skill} e gostaria de fazer parte da equipe.',
  'Projeto muito promissor! Posso contribuir com {skill} e estou disponível para colaborar.',
  'Excelente ideia! Tenho experiência em projetos similares e gostaria de participar.',
  'Interessado em colaborar! Posso ajudar com {skill} e tenho disponibilidade para dedicar tempo ao projeto.',
  'Projeto alinhado com meus interesses! Posso contribuir com {skill} e trazer novas perspectivas.',
  'Gostaria de fazer parte desta iniciativa! Tenho experiência em {skill} e estou motivado para contribuir.',
  'Projeto inovador! Posso ajudar com {skill} e tenho ideias para potencializar os resultados.',
  'Adorei a proposta! Tenho background em {skill} e gostaria de colaborar ativamente.'
];

// Função para gerar nome aleatório
function generateRandomName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

// Função para gerar email baseado no nome
function generateEmail(name) {
  const cleanName = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.');
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'hotmail.com', 'startupcollab.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}@${domain}`;
}

// Função para gerar bio aleatória
function generateBio() {
  const bios = [
    'Desenvolvedor apaixonado por tecnologia e inovação',
    'Designer UX/UI focado em experiências digitais memoráveis',
    'Product Manager com experiência em startups e produtos digitais',
    'Especialista em Marketing Digital e Growth Hacking',
    'Engenheiro de Software com foco em soluções escaláveis',
    'Consultor em transformação digital e estratégia tecnológica',
    'Empreendedor serial com experiência em múltiplos setores',
    'Pesquisador em Inteligência Artificial e Machine Learning',
    'Especialista em DevOps e arquitetura de sistemas',
    'Consultor em sustentabilidade e impacto social',
    'Especialista em fintech e soluções financeiras inovadoras',
    'Designer de produto com foco em usabilidade e acessibilidade',
    'Desenvolvedor full-stack com experiência em startups',
    'Especialista em e-commerce e marketplaces digitais',
    'Consultor em inovação e desenvolvimento de negócios'
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

// Função para gerar skills aleatórias
function generateSkills() {
  const numSkills = Math.floor(Math.random() * 8) + 3; // 3-10 skills
  const shuffled = [...SKILLS].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numSkills);
}

// Função para gerar projeto aleatório
function generateProject(creatorId, index) {
  const category = PROJECT_CATEGORIES[Math.floor(Math.random() * PROJECT_CATEGORIES.length)];
  const title = PROJECT_TITLES[index % PROJECT_TITLES.length];
  const description = PROJECT_DESCRIPTIONS[index % PROJECT_DESCRIPTIONS.length];
  const objectives = PROJECT_OBJECTIVES[index % PROJECT_OBJECTIVES.length];
  const technologies = TECHNOLOGIES_BY_CATEGORY[category] || TECHNOLOGIES_BY_CATEGORY.general;
  const selectedTechs = technologies
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 6) + 3); // 3-8 technologies
  
  return {
    title,
    description,
    objectives,
    technologies: selectedTechs,
    status: PROJECT_STATUSES[Math.floor(Math.random() * PROJECT_STATUSES.length)],
    category,
    creatorId
  };
}

// Função para gerar mensagem de match
function generateMatchMessage(userSkills) {
  const message = MATCH_MESSAGES[Math.floor(Math.random() * MATCH_MESSAGES.length)];
  const skill = userSkills[Math.floor(Math.random() * userSkills.length)];
  return message.replace('{skill}', skill);
}

// Função principal para gerar dados sintéticos
async function generateSyntheticData(options = {}) {
  const {
    numUsers = 50,
    numProjects = 30,
    numMatches = 100,
    includeAdmin = true
  } = options;

  const client = await pool.connect();
  
  try {
    console.log('🔄 Iniciando geração de dados sintéticos...');
    console.log(`📊 Configuração: ${numUsers} usuários, ${numProjects} projetos, ${numMatches} matches`);

    // Limpar dados existentes (opcional)
    if (options.clearExisting) {
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

    // Gerar usuários sintéticos
    console.log('👥 Gerando usuários sintéticos...');
    for (let i = 0; i < numUsers; i++) {
      const name = generateRandomName();
      const email = generateEmail(name);
      const password = await bcrypt.hash('password123', 12);
      const bio = generateBio();
      const skills = generateSkills();
      
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
        email,
        password,
        name,
        bio,
        JSON.stringify(skills),
        Math.random() > 0.2 // 80% dos usuários verificados
      ]);
      
      userIds.push(result.rows[0].id);
      
      if ((i + 1) % 10 === 0) {
        console.log(`   ✅ ${i + 1}/${numUsers} usuários criados`);
      }
    }
    console.log(`✅ ${numUsers} usuários sintéticos criados`);

    // Gerar projetos sintéticos
    console.log('🚀 Gerando projetos sintéticos...');
    const projectIds = [];
    for (let i = 0; i < numProjects; i++) {
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      const project = generateProject(creatorId, i);
      
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
      }
      
      if ((i + 1) % 5 === 0) {
        console.log(`   ✅ ${i + 1}/${numProjects} projetos criados`);
      }
    }
    console.log(`✅ ${projectIds.length} projetos sintéticos criados`);

    // Gerar matches sintéticos
    console.log('🤝 Gerando matches sintéticos...');
    let matchesCreated = 0;
    const maxAttempts = numMatches * 3; // Evitar loop infinito
    let attempts = 0;
    
    while (matchesCreated < numMatches && attempts < maxAttempts) {
      attempts++;
      
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
      
      // Verificar se o usuário não é o criador do projeto
      const projectResult = await client.query('SELECT creator_id FROM projects WHERE id = $1', [projectId]);
      if (projectResult.rows.length === 0 || projectResult.rows[0].creator_id === userId) {
        continue;
      }
      
      // Verificar se já existe um match
      const existingMatch = await client.query(
        'SELECT id FROM collaboration_requests WHERE user_id = $1 AND project_id = $2',
        [userId, projectId]
      );
      if (existingMatch.rows.length > 0) {
        continue;
      }
      
      // Buscar skills do usuário para a mensagem
      const userResult = await client.query('SELECT skills FROM users WHERE id = $1', [userId]);
      const userSkills = userResult.rows[0]?.skills ? JSON.parse(userResult.rows[0].skills) : ['desenvolvimento'];
      
      const message = generateMatchMessage(userSkills);
      const statuses = ['pending', 'accepted', 'rejected'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await client.query(`
        INSERT INTO collaboration_requests (project_id, user_id, status, message)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [projectId, userId, status, message]);
      
      matchesCreated++;
      
      if (matchesCreated % 20 === 0) {
        console.log(`   ✅ ${matchesCreated}/${numMatches} matches criados`);
      }
    }
    console.log(`✅ ${matchesCreated} matches sintéticos criados`);

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

    console.log('\n🎉 Geração de dados sintéticos concluída!');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de matches: ${stats.rows[0].total_matches}`);
    console.log(`   ⏳ Matches pendentes: ${stats.rows[0].pending_matches}`);
    console.log(`   ✅ Matches aceitos: ${stats.rows[0].accepted_matches}`);
    console.log(`   ❌ Matches rejeitados: ${stats.rows[0].rejected_matches}`);
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: [email] / password123');
    
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
      case 'users':
        options.numUsers = parseInt(value);
        break;
      case 'projects':
        options.numProjects = parseInt(value);
        break;
      case 'matches':
        options.numMatches = parseInt(value);
        break;
      case 'clear':
        options.clearExisting = value === 'true';
        break;
      case 'no-admin':
        options.includeAdmin = false;
        break;
    }
  }
  
  generateSyntheticData(options)
    .then(() => {
      console.log('✅ Geração de dados sintéticos executada com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na geração de dados sintéticos:', error);
      process.exit(1);
    });
}

export default generateSyntheticData;

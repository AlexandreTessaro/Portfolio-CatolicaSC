import pool from '../src/config/database.js';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Dados expandidos para geração em escala
const TECH_CATEGORIES = {
  frontend: ['JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3', 'SASS', 'Tailwind CSS', 'Bootstrap', 'Next.js', 'Nuxt.js'],
  backend: ['Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust', 'Express.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', 'Rails'],
  mobile: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Ionic', 'Xamarin'],
  database: ['PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Oracle', 'SQL Server', 'Firebase'],
  cloud: ['AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Jenkins', 'Git', 'GitHub Actions', 'Terraform'],
  design: ['Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator', 'Prototipagem', 'User Research', 'Design System'],
  business: ['Product Management', 'Agile', 'Scrum', 'Kanban', 'Analytics', 'Growth Hacking', 'Marketing Digital', 'SEO'],
  ai: ['Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Pandas', 'NumPy', 'Scikit-learn', 'NLP'],
  blockchain: ['Blockchain', 'Solidity', 'Web3.js', 'Ethereum', 'Smart Contracts', 'DeFi'],
  iot: ['IoT', 'MQTT', 'Arduino', 'Raspberry Pi', 'Embedded Systems']
};

const PROJECT_CATEGORIES = [
  'sustainability', 'education', 'healthcare', 'fintech', 'ecommerce', 
  'social', 'gaming', 'iot', 'ai', 'blockchain', 'mobile', 'web', 
  'desktop', 'enterprise', 'startup', 'nonprofit', 'general'
];

const PROJECT_STATUSES = ['idea', 'planning', 'development', 'testing', 'launched'];

const FIRST_NAMES = [
  'João', 'Maria', 'Pedro', 'Ana', 'Carlos', 'Lucia', 'Fernando', 'Carla',
  'Ricardo', 'Patricia', 'Roberto', 'Juliana', 'Marcos', 'Camila', 'André',
  'Beatriz', 'Felipe', 'Gabriela', 'Rafael', 'Isabela', 'Diego', 'Mariana',
  'Thiago', 'Larissa', 'Bruno', 'Amanda', 'Gustavo', 'Carolina', 'Eduardo',
  'Natália', 'Leonardo', 'Priscila', 'Rodrigo', 'Vanessa', 'Alexandre',
  'Renata', 'Daniel', 'Tatiana', 'Lucas', 'Bianca', 'Vinicius', 'Adriana',
  'Paulo', 'Cristina', 'Antonio', 'Monica', 'Fabio', 'Sandra', 'Marcelo',
  'Claudia', 'Sergio', 'Eliane', 'Mauricio', 'Regina', 'Wagner', 'Silvia',
  'Cesar', 'Debora', 'Henrique', 'Fernanda', 'Guilherme', 'Leticia', 'Igor',
  'Simone', 'Rafaela', 'Leandro', 'Cristiane', 'Mauricio', 'Adriana', 'Cesar',
  'Patricia', 'Henrique', 'Fernanda', 'Guilherme', 'Leticia', 'Igor', 'Simone'
];

const LAST_NAMES = [
  'Silva', 'Santos', 'Oliveira', 'Souza', 'Rodrigues', 'Ferreira', 'Alves',
  'Pereira', 'Lima', 'Gomes', 'Ribeiro', 'Carvalho', 'Almeida', 'Lopes',
  'Soares', 'Fernandes', 'Vieira', 'Barbosa', 'Rocha', 'Dias', 'Monteiro',
  'Cardoso', 'Reis', 'Araujo', 'Castro', 'Nascimento', 'Moreira', 'Correia',
  'Martins', 'Ramos', 'Mendes', 'Freitas', 'Machado', 'Azevedo', 'Cavalcanti',
  'Nunes', 'Teixeira', 'Melo', 'Campos', 'Pinto', 'Costa', 'Morais', 'Nogueira',
  'Guimaraes', 'Moura', 'Borges', 'Coelho', 'Viana', 'Pires', 'Duarte', 'Santana',
  'Cunha', 'Farias', 'Peixoto', 'Vasconcelos', 'Cavalcante', 'Barros', 'Macedo'
];

const PROJECT_TEMPLATES = [
  {
    title: 'EcoTracker - Monitoramento de Pegada de Carbono',
    description: 'Aplicativo mobile que permite aos usuários rastrear sua pegada de carbono diária através de atividades como transporte, alimentação e consumo de energia.',
    objectives: ['Reduzir pegada de carbono em 25%', 'Educar sobre práticas sustentáveis', 'Criar comunidade engajada'],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS', 'Firebase'],
    category: 'sustainability'
  },
  {
    title: 'LearnFlow - Plataforma de Aprendizado Adaptativo',
    description: 'Sistema de aprendizado online que utiliza IA para personalizar o conteúdo educacional baseado no perfil e progresso de cada aluno.',
    objectives: ['Personalizar experiência de aprendizado', 'Aumentar retenção de conhecimento', 'Suportar múltiplos formatos'],
    technologies: ['React', 'TypeScript', 'Python', 'TensorFlow', 'MongoDB'],
    category: 'education'
  },
  {
    title: 'HealthConnect - Plataforma de Telemedicina',
    description: 'Sistema completo de telemedicina que conecta pacientes a médicos especialistas com agendamento online e consultas por vídeo.',
    objectives: ['Facilitar acesso à saúde', 'Reduzir tempo de espera', 'Melhorar experiência do paciente'],
    technologies: ['Vue.js', 'Laravel', 'WebRTC', 'Redis', 'MySQL'],
    category: 'healthcare'
  },
  {
    title: 'FinTechFlow - Plataforma de Gestão Financeira',
    description: 'Aplicativo de gestão financeira pessoal e empresarial com IA para categorização automática e insights de gastos.',
    objectives: ['Automatizar categorização de gastos', 'Fornecer insights financeiros', 'Facilitar planejamento'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    category: 'fintech'
  },
  {
    title: 'LocalMarket - Marketplace de Produtos Locais',
    description: 'Plataforma de e-commerce focada em conectar produtores locais com consumidores com sistema de avaliações.',
    objectives: ['Apoiar produtores locais', 'Reduzir custos de logística', 'Promover consumo consciente'],
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe', 'AWS'],
    category: 'ecommerce'
  },
  {
    title: 'SocialImpact - Rede de Impacto Social',
    description: 'Plataforma que conecta organizações sociais, voluntários e doadores com sistema de crowdfunding.',
    objectives: ['Amplificar impacto social', 'Facilitar engajamento', 'Aumentar transparência'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe', 'AWS'],
    category: 'social'
  },
  {
    title: 'CodeReview - Plataforma de Revisão de Código',
    description: 'Ferramenta colaborativa para revisão de código com IA para detecção automática de bugs e análise de qualidade.',
    objectives: ['Melhorar qualidade de código', 'Reduzir tempo de revisão', 'Educar sobre boas práticas'],
    technologies: ['React', 'Python', 'PostgreSQL', 'GitHub API', 'Docker'],
    category: 'general'
  },
  {
    title: 'MentorMatch - Sistema de Mentoria Inteligente',
    description: 'Plataforma que conecta mentores e mentorados baseado em objetivos, experiência e disponibilidade.',
    objectives: ['Conectar mentores eficientemente', 'Facilitar troca de conhecimento', 'Acelerar desenvolvimento'],
    technologies: ['Vue.js', 'Node.js', 'PostgreSQL', 'Machine Learning', 'AWS'],
    category: 'general'
  },
  {
    title: 'GreenEnergy - Monitoramento de Energia Sustentável',
    description: 'Sistema de monitoramento de consumo energético com recomendações de economia e relatórios de sustentabilidade.',
    objectives: ['Reduzir consumo energético', 'Promover energias renováveis', 'Otimizar custos'],
    technologies: ['React', 'Python', 'InfluxDB', 'IoT', 'Docker'],
    category: 'sustainability'
  },
  {
    title: 'TechNews - Agregador de Notícias de Tecnologia',
    description: 'Agregador inteligente de notícias de tecnologia com curadoria por IA e personalização de conteúdo.',
    objectives: ['Manter usuários informados', 'Facilitar descoberta de conteúdo', 'Promover discussões'],
    technologies: ['Next.js', 'Python', 'MongoDB', 'NLP', 'Redis'],
    category: 'general'
  }
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

// Função para gerar bio baseada nas skills
function generateBio(skills) {
  const bios = [
    `Desenvolvedor especializado em ${skills.slice(0, 2).join(' e ')} com experiência em projetos inovadores.`,
    `Profissional com expertise em ${skills.slice(0, 3).join(', ')} e paixão por tecnologia.`,
    `Especialista em ${skills[0]} com background em ${skills.slice(1, 3).join(' e ')}.`,
    `Desenvolvedor full-stack focado em ${skills.slice(0, 2).join(' e ')} para soluções escaláveis.`,
    `Consultor em ${skills[0]} com experiência em ${skills.slice(1, 2).join(' e ')}.`
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

// Função para gerar skills baseadas em categorias
function generateSkills() {
  const numCategories = Math.floor(Math.random() * 3) + 2; // 2-4 categorias
  const selectedCategories = Object.keys(TECH_CATEGORIES)
    .sort(() => 0.5 - Math.random())
    .slice(0, numCategories);
  
  const skills = [];
  selectedCategories.forEach(category => {
    const categorySkills = TECH_CATEGORIES[category];
    const numSkills = Math.floor(Math.random() * 3) + 1; // 1-3 skills por categoria
    const selectedSkills = categorySkills
      .sort(() => 0.5 - Math.random())
      .slice(0, numSkills);
    skills.push(...selectedSkills);
  });
  
  return [...new Set(skills)]; // Remove duplicatas
}

// Função para gerar projeto baseado em template
function generateProject(template, index) {
  const variations = [
    'Pro', 'Advanced', 'Smart', 'AI-Powered', 'Next-Gen', 'Ultimate', 'Elite', 'Premium'
  ];
  
  const variation = variations[Math.floor(Math.random() * variations.length)];
  const title = `${variation} ${template.title}`;
  
  // Variar tecnologias baseadas no template
  const baseTechs = [...template.technologies];
  const additionalTechs = [];
  
  // Adicionar tecnologias relacionadas
  template.technologies.forEach(tech => {
    Object.values(TECH_CATEGORIES).forEach(category => {
      if (category.includes(tech)) {
        const relatedTechs = category.filter(t => t !== tech);
        if (relatedTechs.length > 0) {
          const randomTech = relatedTechs[Math.floor(Math.random() * relatedTechs.length)];
          if (!baseTechs.includes(randomTech) && !additionalTechs.includes(randomTech)) {
            additionalTechs.push(randomTech);
          }
        }
      }
    });
  });
  
  const technologies = [...baseTechs, ...additionalTechs.slice(0, 3)];
  
  return {
    title,
    description: template.description,
    objectives: template.objectives,
    technologies,
    status: PROJECT_STATUSES[Math.floor(Math.random() * PROJECT_STATUSES.length)],
    category: template.category
  };
}

// Função para gerar mensagem de solicitação
function generateRequestMessage(userSkills, projectTechs) {
  const commonSkills = userSkills.filter(skill => projectTechs.includes(skill));
  const messages = [
    `Gostaria muito de contribuir com este projeto! Tenho experiência em ${commonSkills.join(', ')} e acredito que posso agregar valor.`,
    `Interessante projeto! Posso ajudar com ${commonSkills[0] || 'desenvolvimento'} e tenho algumas ideias que podem ser úteis.`,
    `Adorei a proposta! Posso contribuir com ${commonSkills.slice(0, 2).join(' e ')} e estou disponível para colaborar.`,
    `Excelente ideia! Tenho experiência em projetos similares usando ${commonSkills.join(', ')} e gostaria de participar.`,
    `Interessado em colaborar! Posso ajudar com ${commonSkills[0] || 'desenvolvimento'} e tenho disponibilidade para dedicar tempo ao projeto.`,
    `Projeto alinhado com meus interesses! Posso contribuir com ${commonSkills.slice(0, 2).join(' e ')} e trazer novas perspectivas.`,
    `Gostaria de fazer parte desta iniciativa! Tenho background em ${commonSkills.join(', ')} e estou motivado para contribuir.`,
    `Projeto inovador! Posso ajudar com ${commonSkills[0] || 'desenvolvimento'} e tenho ideias para potencializar os resultados.`
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}

// Função principal para gerar dados em escala
async function generateScalableData(options = {}) {
  const {
    numUsers = 100,
    numProjects = 50,
    numRequests = 200,
    clearExisting = false
  } = options;

  console.log('🔄 Iniciando geração de dados em escala...');
  console.log(`📊 Configuração: ${numUsers} usuários, ${numProjects} projetos, ${numRequests} solicitações`);

  const client = await pool.connect();
  
  try {
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

    // Gerar usuários sintéticos
    console.log('👥 Gerando usuários sintéticos...');
    for (let i = 0; i < numUsers; i++) {
      const name = generateRandomName();
      const email = generateEmail(name);
      const password = await bcrypt.hash('password123', 12);
      const skills = generateSkills();
      const bio = generateBio(skills);
      
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
        Math.random() > 0.2 // 80% verificados
      ]);
      
      userIds.push(result.rows[0].id);
      
      if ((i + 1) % 20 === 0) {
        console.log(`   ✅ ${i + 1}/${numUsers} usuários criados`);
      }
    }
    console.log(`✅ ${numUsers} usuários sintéticos criados`);

    // Gerar projetos sintéticos
    console.log('🚀 Gerando projetos sintéticos...');
    const projectIds = [];
    for (let i = 0; i < numProjects; i++) {
      const template = PROJECT_TEMPLATES[i % PROJECT_TEMPLATES.length];
      const project = generateProject(template, i);
      const creatorId = userIds[Math.floor(Math.random() * userIds.length)];
      
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
      
      if ((i + 1) % 10 === 0) {
        console.log(`   ✅ ${i + 1}/${numProjects} projetos criados`);
      }
    }
    console.log(`✅ ${projectIds.length} projetos sintéticos criados`);

    // Gerar solicitações de colaboração
    console.log('🤝 Gerando solicitações de colaboração...');
    let requestsCreated = 0;
    const maxAttempts = numRequests * 3;
    let attempts = 0;
    
    while (requestsCreated < numRequests && attempts < maxAttempts) {
      attempts++;
      
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
      
      // Verificar se o usuário não é o criador do projeto
      const projectResult = await client.query('SELECT creator_id FROM projects WHERE id = $1', [projectId]);
      if (projectResult.rows.length === 0 || projectResult.rows[0].creator_id === userId) {
        continue;
      }
      
      // Verificar se já existe uma solicitação
      const existingRequest = await client.query(
        'SELECT id FROM collaboration_requests WHERE user_id = $1 AND project_id = $2',
        [userId, projectId]
      );
      if (existingRequest.rows.length > 0) {
        continue;
      }
      
      // Buscar skills do usuário e tecnologias do projeto
      const userResult = await client.query('SELECT skills FROM users WHERE id = $1', [userId]);
      const projectResult2 = await client.query('SELECT technologies FROM projects WHERE id = $1', [projectId]);
      
      const userSkills = userResult.rows[0]?.skills ? JSON.parse(userResult.rows[0].skills) : [];
      const projectTechs = projectResult2.rows[0]?.technologies ? JSON.parse(projectResult2.rows[0].technologies) : [];
      
      const message = generateRequestMessage(userSkills, projectTechs);
      const statuses = ['pending', 'accepted', 'rejected'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await client.query(`
        INSERT INTO collaboration_requests (project_id, user_id, status, message)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [projectId, userId, status, message]);
      
      requestsCreated++;
      
      if (requestsCreated % 50 === 0) {
        console.log(`   ✅ ${requestsCreated}/${numRequests} solicitações criadas`);
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

    // Análise de diversidade de skills
    const skillStats = await client.query(`
      SELECT skill, COUNT(*) as count
      FROM (
        SELECT jsonb_array_elements_text(skills) as skill
        FROM users
      ) skills_expanded
      GROUP BY skill
      ORDER BY count DESC
      LIMIT 15
    `);

    console.log('\n🎉 Geração de dados em escala concluída!');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de solicitações: ${stats.rows[0].total_requests}`);
    console.log(`   ⏳ Solicitações pendentes: ${stats.rows[0].pending_requests}`);
    console.log(`   ✅ Solicitações aceitas: ${stats.rows[0].accepted_requests}`);
    console.log(`   ❌ Solicitações rejeitadas: ${stats.rows[0].rejected_requests}`);
    
    console.log('\n🛠️ Skills mais comuns:');
    skillStats.rows.forEach(row => {
      console.log(`   ${row.skill}: ${row.count} usuários`);
    });
    
    console.log('\n🔑 Credenciais de acesso:');
    console.log('   Admin: admin@startupcollab.com / admin123');
    console.log('   Usuários: [email gerado] / password123');
    
    // Recomendações para melhorar precisão
    console.log('\n💡 Recomendações para melhorar precisão:');
    console.log('   - Aumentar para 500+ usuários para melhor cobertura de skills');
    console.log('   - Adicionar 200+ projetos para maior diversidade');
    console.log('   - Gerar 1000+ solicitações para histórico de interações');
    console.log('   - Implementar algoritmo de recomendação baseado em colaborative filtering');
    
  } catch (error) {
    console.error('❌ Erro durante a geração de dados:', error);
    throw error;
  } finally {
    client.release();
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
      case 'requests':
        options.numRequests = parseInt(value);
        break;
      case 'clear':
        options.clearExisting = value === 'true';
        break;
    }
  }
  
  generateScalableData(options)
    .then(() => {
      console.log('✅ Geração de dados em escala executada com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha na geração de dados em escala:', error);
      process.exit(1);
    });
}

export default generateScalableData;

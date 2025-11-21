import pool from '../../src/config/database.js';
import bcrypt from 'bcryptjs';

// Dados para geração em escala
const TECH_SKILLS = [
  'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'HTML5', 'CSS3',
  'Node.js', 'Python', 'Java', 'C#', 'PHP', 'Ruby', 'Go', 'Rust',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite',
  'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes',
  'Figma', 'Adobe XD', 'Sketch', 'Photoshop',
  'Product Management', 'Agile', 'Scrum', 'Analytics',
  'Machine Learning', 'TensorFlow', 'PyTorch', 'Pandas',
  'Blockchain', 'Solidity', 'Web3.js', 'Ethereum',
  'React Native', 'Flutter', 'Swift', 'Kotlin'
];

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
  'Nunes', 'Teixeira', 'Melo', 'Campos', 'Pinto', 'Costa', 'Morais', 'Nogueira'
];

const PROJECT_TEMPLATES = [
  {
    title: 'EcoTracker - Monitoramento de Pegada de Carbono',
    description: 'Aplicativo mobile para rastrear pegada de carbono com gamificação.',
    objectives: ['Reduzir pegada de carbono', 'Educar sobre sustentabilidade'],
    technologies: ['React Native', 'Node.js', 'PostgreSQL', 'AWS'],
    category: 'sustainability'
  },
  {
    title: 'LearnFlow - Plataforma de Aprendizado',
    description: 'Sistema de aprendizado online com IA para personalização.',
    objectives: ['Personalizar aprendizado', 'Aumentar retenção'],
    technologies: ['React', 'Python', 'TensorFlow', 'MongoDB'],
    category: 'education'
  },
  {
    title: 'HealthConnect - Telemedicina',
    description: 'Plataforma de telemedicina com agendamento e consultas por vídeo.',
    objectives: ['Facilitar acesso à saúde', 'Reduzir tempo de espera'],
    technologies: ['Vue.js', 'Laravel', 'WebRTC', 'MySQL'],
    category: 'healthcare'
  },
  {
    title: 'FinTechFlow - Gestão Financeira',
    description: 'App de gestão financeira com IA para categorização automática.',
    objectives: ['Automatizar categorização', 'Fornecer insights'],
    technologies: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
    category: 'fintech'
  },
  {
    title: 'LocalMarket - Marketplace Local',
    description: 'Plataforma de e-commerce para conectar produtores locais.',
    objectives: ['Apoiar produtores locais', 'Reduzir logística'],
    technologies: ['Next.js', 'Node.js', 'MongoDB', 'Stripe'],
    category: 'ecommerce'
  }
];

function generateRandomName() {
  const firstName = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
  const lastName = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
  return `${firstName} ${lastName}`;
}

function generateEmail(name) {
  const cleanName = name.toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '.');
  const domains = ['gmail.com', 'outlook.com', 'yahoo.com', 'startupcollab.com'];
  const domain = domains[Math.floor(Math.random() * domains.length)];
  return `${cleanName}@${domain}`;
}

function generateSkills() {
  const numSkills = Math.floor(Math.random() * 6) + 3; // 3-8 skills
  return TECH_SKILLS
    .sort(() => 0.5 - Math.random())
    .slice(0, numSkills);
}

function generateBio(skills) {
  const bios = [
    `Desenvolvedor especializado em ${skills.slice(0, 2).join(' e ')} com experiência em projetos inovadores.`,
    `Profissional com expertise em ${skills.slice(0, 3).join(', ')} e paixão por tecnologia.`,
    `Especialista em ${skills[0]} com background em ${skills.slice(1, 3).join(' e ')}.`,
    `Desenvolvedor full-stack focado em ${skills.slice(0, 2).join(' e ')} para soluções escaláveis.`
  ];
  return bios[Math.floor(Math.random() * bios.length)];
}

function generateProject(template, index) {
  const variations = ['Pro', 'Advanced', 'Smart', 'AI-Powered', 'Next-Gen'];
  const variation = variations[Math.floor(Math.random() * variations.length)];
  const title = `${variation} ${template.title}`;
  
  // Adicionar tecnologias relacionadas
  const baseTechs = [...template.technologies];
  const additionalTechs = TECH_SKILLS
    .filter(tech => !baseTechs.includes(tech))
    .sort(() => 0.5 - Math.random())
    .slice(0, Math.floor(Math.random() * 3) + 1);
  
  const technologies = [...baseTechs, ...additionalTechs];
  
  return {
    title,
    description: template.description,
    objectives: template.objectives,
    technologies,
    status: ['idea', 'planning', 'development', 'testing', 'launched'][Math.floor(Math.random() * 5)],
    category: template.category
  };
}

async function generateScaleData() {
  console.log('🔄 Gerando dados em escala para melhorar precisão do algoritmo...');
  
  const client = await pool.connect();
  
  try {
    const userIds = [];
    
    // Gerar usuários
    console.log('👥 Gerando usuários...');
    for (let i = 0; i < 300; i++) {
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
        true
      ]);
      
      userIds.push(result.rows[0].id);
      
      if ((i + 1) % 50 === 0) {
        console.log(`   ✅ ${i + 1}/300 usuários criados`);
      }
    }
    
    // Gerar projetos
    console.log('🚀 Gerando projetos...');
    const projectIds = [];
    for (let i = 0; i < 150; i++) {
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
      
      if ((i + 1) % 30 === 0) {
        console.log(`   ✅ ${i + 1}/150 projetos criados`);
      }
    }
    
    // Gerar solicitações de colaboração
    console.log('🤝 Gerando solicitações de colaboração...');
    let requestsCreated = 0;
    
    for (let i = 0; i < 800; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];
      const projectId = projectIds[Math.floor(Math.random() * projectIds.length)];
      
      // Verificar se o usuário não é o criador
      const projectResult = await client.query('SELECT creator_id FROM projects WHERE id = $1', [projectId]);
      if (projectResult.rows.length === 0 || projectResult.rows[0].creator_id === userId) {
        continue;
      }
      
      // Verificar se já existe solicitação
      const existingRequest = await client.query(
        'SELECT id FROM collaboration_requests WHERE user_id = $1 AND project_id = $2',
        [userId, projectId]
      );
      if (existingRequest.rows.length > 0) {
        continue;
      }
      
      const messages = [
        'Gostaria muito de contribuir com este projeto! Tenho experiência na área.',
        'Interessante projeto! Posso ajudar com desenvolvimento.',
        'Adorei a proposta! Posso contribuir com desenvolvimento.',
        'Excelente ideia! Tenho experiência em projetos similares.',
        'Interessado em colaborar! Posso ajudar com desenvolvimento.'
      ];
      
      const message = messages[Math.floor(Math.random() * messages.length)];
      const statuses = ['pending', 'accepted', 'rejected'];
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      
      await client.query(`
        INSERT INTO collaboration_requests (project_id, user_id, status, message)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT DO NOTHING
      `, [projectId, userId, status, message]);
      
      requestsCreated++;
      
      if (requestsCreated % 100 === 0) {
        console.log(`   ✅ ${requestsCreated}/800 solicitações criadas`);
      }
    }
    
    // Estatísticas finais
    const stats = await client.query(`
      SELECT 
        (SELECT COUNT(*) FROM users) as total_users,
        (SELECT COUNT(*) FROM projects) as total_projects,
        (SELECT COUNT(*) FROM collaboration_requests) as total_requests
    `);
    
    console.log('\n🎉 Geração de dados em escala concluída!');
    console.log('\n📊 Estatísticas finais:');
    console.log(`   👥 Total de usuários: ${stats.rows[0].total_users}`);
    console.log(`   🚀 Total de projetos: ${stats.rows[0].total_projects}`);
    console.log(`   🤝 Total de solicitações: ${stats.rows[0].total_requests}`);
    
    console.log('\n💡 Próximos passos:');
    console.log('   1. Testar precisão: node test-accuracy-simple.js');
    console.log('   2. Se precisar de mais dados: aumentar números no script');
    console.log('   3. Implementar algoritmo de collaborative filtering');
    
  } catch (error) {
    console.error('❌ Erro ao gerar dados:', error);
    throw error;
  } finally {
    client.release();
  }
}

generateScaleData();

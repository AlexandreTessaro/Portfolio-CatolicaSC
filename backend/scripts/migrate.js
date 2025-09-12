import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

async function createTables() {
  const useDatabaseUrl = Boolean(process.env.DATABASE_URL);
  const isProduction = process.env.NODE_ENV === 'production';

  console.log(`🔧 Iniciando migração - Ambiente: ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
  console.log(`🔗 Tipo de conexão: ${useDatabaseUrl ? 'DATABASE_URL' : 'Parâmetros individuais'}`);

  // Quando usando DATABASE_URL (produção), não criar banco – conectar direto
  if (!useDatabaseUrl) {
    // Primeiro, conectar ao postgres para criar o banco se não existir
    const postgresPool = new Pool({
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 5432,
      user: process.env.DB_USER || 'user',
      password: process.env.DB_PASSWORD || 'password',
      database: 'postgres', // Conectar ao banco padrão primeiro
    });

    try {
      // Verificar se o banco existe
      const dbExists = await postgresPool.query(
        "SELECT 1 FROM pg_database WHERE datname = $1",
        [process.env.DB_NAME || 'mydb']
      );

      if (dbExists.rows.length === 0) {
        console.log(`📝 Criando banco de dados '${process.env.DB_NAME || 'mydb'}'...`);
        await postgresPool.query(
          `CREATE DATABASE "${process.env.DB_NAME || 'mydb'}"`
        );
        console.log(`✅ Banco de dados '${process.env.DB_NAME || 'mydb'}' criado com sucesso!`);
      } else {
        console.log(`✅ Banco de dados '${process.env.DB_NAME || 'mydb'}' já existe.`);
      }
    } catch (error) {
      console.error('❌ Erro ao verificar/criar banco:', error.message);
      throw error;
    } finally {
      await postgresPool.end();
    }
  } else {
    console.log('ℹ️ DATABASE_URL detectado. Pulando criação de banco (Produção).');
  }

  // Agora conectar ao banco específico para criar as tabelas
  const pool = new Pool(
    useDatabaseUrl
      ? {
          connectionString: process.env.DATABASE_URL,
          ssl: isProduction ? { rejectUnauthorized: false } : false,
        }
      : {
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT) || 5432,
          user: process.env.DB_USER || 'user',
          password: process.env.DB_PASSWORD || 'password',
          database: process.env.DB_NAME || 'mydb',
          ssl: false, // SSL desabilitado para desenvolvimento local
        }
  );

  try {
    console.log('🔧 Criando tabelas...');
    // Log da conexão ativa
    console.log('ℹ️ Conectando com', useDatabaseUrl ? 'DATABASE_URL (Produção)' : `${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 5432}/${process.env.DB_NAME || 'mydb'}`);

    // Garantir schema public e search_path
    await pool.query('CREATE SCHEMA IF NOT EXISTS public');
    await pool.query("SET search_path TO public");

    // Criar tabela de usuários
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(100) NOT NULL,
        bio TEXT,
        skills JSONB DEFAULT '[]',
        social_links JSONB DEFAULT '{}',
        profile_image VARCHAR(500),
        is_admin BOOLEAN DEFAULT FALSE,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela users criada/verificada');

    // Criar tabela de projetos
    await pool.query(`
      CREATE TABLE IF NOT EXISTS projects (
        id SERIAL PRIMARY KEY,
        title VARCHAR(100) NOT NULL,
        description TEXT NOT NULL,
        objectives JSONB DEFAULT '[]',
        technologies JSONB DEFAULT '[]',
        status VARCHAR(20) DEFAULT 'idea',
        category VARCHAR(50) DEFAULT 'general',
        creator_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        team_members JSONB DEFAULT '[]',
        collaborators JSONB DEFAULT '[]',
        images JSONB DEFAULT '[]',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela projects criada/verificada');

    // Criar tabela de solicitações de colaboração
    await pool.query(`
      CREATE TABLE IF NOT EXISTS collaboration_requests (
        id SERIAL PRIMARY KEY,
        project_id INTEGER REFERENCES projects(id) ON DELETE CASCADE,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        message TEXT,
        status VARCHAR(20) DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(project_id, user_id)
      )
    `);
    console.log('✅ Tabela collaboration_requests criada/verificada');

    // Criar tabela de mensagens
    await pool.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        project_id INTEGER REFERENCES projects(id) ON DELETE SET NULL,
        content TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela messages criada/verificada');

    // Criar tabela de notificações
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(100) NOT NULL,
        message TEXT NOT NULL,
        data JSONB DEFAULT '{}',
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela notifications criada/verificada');

    // Criar tabela de logs de auditoria
    await pool.query(`
      CREATE TABLE IF NOT EXISTS audit_logs (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
        action VARCHAR(100) NOT NULL,
        resource_type VARCHAR(50),
        resource_id INTEGER,
        details JSONB DEFAULT '{}',
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Tabela audit_logs criada/verificada');

    // Criar índices para melhor performance
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_skills ON users USING GIN(skills);
      CREATE INDEX IF NOT EXISTS idx_projects_creator_id ON projects(creator_id);
      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
      CREATE INDEX IF NOT EXISTS idx_projects_category ON projects(category);
      CREATE INDEX IF NOT EXISTS idx_projects_technologies ON projects USING GIN(technologies);
      CREATE INDEX IF NOT EXISTS idx_collaboration_requests_project_id ON collaboration_requests(project_id);
      CREATE INDEX IF NOT EXISTS idx_collaboration_requests_user_id ON collaboration_requests(user_id);
      CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
      CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
      CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);
      CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
    `);
    console.log('✅ Índices criados/verificados');

    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro durante a migração:', error);
    throw error;
  } finally {
    await pool.end();
  }
};

// Executar migração sempre que este script for chamado diretamente via Node
createTables()
  .then(() => {
    console.log('✅ Migração executada com sucesso');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Falha na migração:', error);
    process.exit(1);
  });

export default createTables;

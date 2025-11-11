import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Configuração de ambiente
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
const useDatabaseUrl = Boolean(process.env.DATABASE_URL);

// Parse DATABASE_URL para ambientes de produção
function parseDatabaseUrl(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    return {
      user: urlObj.username,
      password: urlObj.password,
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 5432,
      database: urlObj.pathname.slice(1),
    };
  } catch (error) {
    console.error('❌ Erro ao fazer parse da DATABASE_URL:', error);
    return null;
  }
}

// Configuração do banco de dados baseada no ambiente
const dbConfig = useDatabaseUrl
  ? (() => {
      console.log('🔧 Configurando conexão com DATABASE_URL (Produção)...');
      
      return {
        connectionString: process.env.DATABASE_URL,
        ssl: isProduction ? { rejectUnauthorized: false } : false,
        // Otimizado para suportar 1000+ usuários simultâneos
        max: parseInt(process.env.DB_POOL_MAX) || 100, // Aumentado de 20 para 100
        min: parseInt(process.env.DB_POOL_MIN) || 10, // Mínimo de conexões mantidas
        idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
        connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
        // Permitir que o pool crie conexões sob demanda
        allowExitOnIdle: false,
      };
    })()
  : (() => {
      // Configuração para desenvolvimento local (Docker Compose)
      console.log('🔧 Configurando conexão local PostgreSQL...');
      
      return {
        user: process.env.DB_USER || 'user',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'mydb',
        password: process.env.DB_PASSWORD || 'password',
        port: parseInt(process.env.DB_PORT) || 5432,
        ssl: false, // SSL desabilitado para desenvolvimento local
        // Otimizado para suportar 1000+ usuários simultâneos
        max: parseInt(process.env.DB_POOL_MAX) || 50, // Aumentado de 20 para 50 (dev)
        min: parseInt(process.env.DB_POOL_MIN) || 5, // Mínimo de conexões mantidas
        idleTimeoutMillis: parseInt(process.env.DB_POOL_IDLE_TIMEOUT) || 30000,
        connectionTimeoutMillis: parseInt(process.env.DB_POOL_CONNECTION_TIMEOUT) || 2000,
        keepAlive: true,
        allowExitOnIdle: false,
      };
    })();

const pool = new Pool(dbConfig);

// Logs de conexão
pool.on('connect', (_client) => {
  console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err, _client) => {
  console.error('❌ Erro na conexão com o banco:', err);
});

// Teste de conexão na inicialização
pool.connect()
  .then(client => {
    console.log('✅ Pool de conexões PostgreSQL inicializado com sucesso');
    console.log(`📍 Ambiente: ${isProduction ? 'Produção' : 'Desenvolvimento'}`);
    console.log(`🔗 Tipo de conexão: ${useDatabaseUrl ? 'DATABASE_URL' : 'Parâmetros individuais'}`);
    client.release();
  })
  .catch(err => {
    console.error('❌ Erro ao inicializar pool de conexões:', err);
    if (isDevelopment) {
      console.log('💡 Dica: Certifique-se de que o PostgreSQL está rodando via Docker Compose');
    }
  });

export default pool;

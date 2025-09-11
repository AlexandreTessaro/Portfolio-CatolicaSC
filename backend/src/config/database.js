import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// In production, use individual environment variables to avoid IPv6 issues
const useIndividualParams = process.env.NODE_ENV === 'production' && process.env.DB_HOST;
const useDatabaseUrl = Boolean(process.env.DATABASE_URL) && !useIndividualParams;

// Parse DATABASE_URL for production environments to avoid IPv6 issues
function parseDatabaseUrl(url) {
  if (!url) return null;
  
  try {
    const urlObj = new URL(url);
    
    // Force IPv4 by resolving hostname to IPv4 address
    const hostname = urlObj.hostname;
    
    // For Supabase, use the direct IPv4 address if available
    if (hostname.includes('supabase.co')) {
      // Try to resolve to IPv4 - for now, we'll use a workaround
      console.log('🔧 Usando hostname Supabase:', hostname);
    }
    
    return {
      user: urlObj.username,
      password: urlObj.password,
      host: hostname,
      port: parseInt(urlObj.port) || 5432,
      database: urlObj.pathname.slice(1),
    };
  } catch (error) {
    console.error('❌ Erro ao fazer parse da DATABASE_URL:', error);
    return null;
  }
}

// Use Supavisor connection string for production (IPv4 compatible)
const dbConfig = useIndividualParams
  ? (() => {
      console.log('🔧 Configurando conexão com Supavisor (IPv4)...');
      
      // Use Supavisor connection string for IPv4 compatibility
      // Use the correct Supavisor URL for your specific project
      const supavisorUrl = `postgresql://postgres.kdqmxqftmwmtyxmrauhy:${process.env.DB_PASSWORD}@aws-0-us-west-1.pooler.supabase.com:6543/postgres`;
      
      console.log('🔗 Supavisor URL configurada');
      console.log('👤 User:', process.env.DB_USER);
      console.log('🗄️ Database:', process.env.DB_NAME);
      
      return {
        connectionString: supavisorUrl,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
      };
    })()
  : useDatabaseUrl
  ? {
      // Use connection string (development)
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 10000,
    }
  : (() => {
      // Try to parse DATABASE_URL first, then fallback to defaults
      const parsed = parseDatabaseUrl(process.env.DATABASE_URL);
      return parsed ? {
        ...parsed,
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      } : {
        user: process.env.DB_USER || 'user',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'mydb',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      };
    })();

const pool = new Pool(dbConfig);

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o banco:', err);
});

export default pool;

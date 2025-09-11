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

// Use direct Supabase connection with multiple fallback strategies
const dbConfig = useIndividualParams
  ? (() => {
      console.log('🔧 Configurando conexão com Supabase (múltiplas estratégias)...');
      
      // Strategy 1: Try with IPv4 forcing
      const directUrl = `postgresql://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
      
      console.log('🔗 URL direta configurada');
      console.log('🏠 Host:', process.env.DB_HOST);
      console.log('👤 User:', process.env.DB_USER);
      console.log('🗄️ Database:', process.env.DB_NAME);
      
      return {
        connectionString: directUrl,
        ssl: { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 0,
        // Multiple IPv4 forcing strategies
        lookup: (hostname, options, callback) => {
          console.log('🔍 DNS lookup for:', hostname);
          const dns = require('dns');
          
          // Try IPv4 first
          dns.lookup(hostname, { family: 4 }, (err, address) => {
            if (err) {
              console.error('❌ IPv4 DNS lookup error:', err);
              // Fallback to any address
              dns.lookup(hostname, (err2, address2) => {
                if (err2) {
                  console.error('❌ Fallback DNS lookup error:', err2);
                  return callback(err2);
                }
                console.log('⚠️ Fallback resolved to:', address2);
                callback(null, address2, 4);
              });
            } else {
              console.log('✅ Resolved to IPv4:', address);
              callback(null, address, 4);
            }
          });
        }
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

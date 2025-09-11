import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Prefer DATABASE_URL (e.g., Supabase) when provided; fall back to discrete params
const useDatabaseUrl = Boolean(process.env.DATABASE_URL);

const pool = new Pool(
  useDatabaseUrl
    ? {
        connectionString: process.env.DATABASE_URL,
        // Supabase requires SSL in most environments
        ssl: process.env.DB_SSL === 'false' ? false : { rejectUnauthorized: false },
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000, // Increased timeout for external connections
      }
    : {
        user: process.env.DB_USER || 'user',
        host: process.env.DB_HOST || 'localhost',
        database: process.env.DB_NAME || 'mydb',
        password: process.env.DB_PASSWORD || 'password',
        port: process.env.DB_PORT || 5432,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      }
);

// Teste de conexão
pool.on('connect', () => {
  console.log('✅ Conectado ao banco de dados PostgreSQL');
});

pool.on('error', (err) => {
  console.error('❌ Erro na conexão com o banco:', err);
});

export default pool;

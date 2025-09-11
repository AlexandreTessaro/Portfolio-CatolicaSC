import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'express-async-errors';

// Importar rotas
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';

// Importar configurações
import pool from './src/config/database.js';
import redisClient from './src/config/redis.js';

// Carregar variáveis de ambiente
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 5000;
let serverInstance = null;

// Middleware de segurança
app.use(helmet());

// Configuração CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // limite de 100 requisições por IP
  message: {
    success: false,
    message: 'Muitas requisições deste IP, tente novamente mais tarde'
  }
});
app.use('/api/', limiter);

// Middleware para parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Startup Collaboration API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      projects: '/api/projects',
      health: '/health'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Middleware para rotas não encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Rota não encontrada'
  });
});

// Função para inicializar conexões
async function initializeConnections() {
  try {
    // Testar conexão com PostgreSQL
    console.log('🔄 Tentando conectar ao banco de dados...');
    console.log('📍 DATABASE_URL:', process.env.DATABASE_URL ? 'Configurado' : 'Não configurado');
    console.log('🔒 SSL:', process.env.DB_SSL || 'true');
    
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado ao banco de dados PostgreSQL');
    
    // Testar conexão com Redis (opcional)
    const hasRedisUrl = Boolean(process.env.REDIS_URL);
    if (hasRedisUrl) {
      try {
        await redisClient.connect();
        console.log('✅ Conectado ao Redis');
      } catch (redisError) {
        console.warn('⚠️ Não foi possível conectar ao Redis. Continuando sem cache.', redisError?.message || redisError);
      }
    } else {
      console.log('ℹ️ REDIS_URL não definido. Pulando conexão com Redis.');
    }
    
    // Iniciar servidor com fallback de porta se estiver em uso
    await startServerWithFallback(PORT);
  } catch (error) {
    console.error('❌ Erro ao inicializar conexões:', error);
    process.exit(1);
  }
}

// Tenta iniciar o servidor; se a porta estiver em uso, tenta as próximas portas
function startServer(port) {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      const actualPort = server.address().port;
      console.log(`🚀 Servidor rodando em http://localhost:${actualPort}`);
      console.log(`📊 Health check: http://localhost:${actualPort}/health`);
      resolve(server);
    });
    server.on('error', (err) => {
      reject(err);
    });
  });
}

async function startServerWithFallback(initialPort, maxAttempts = 5) {
  let attempt = 0;
  let portToTry = initialPort;
  while (attempt < maxAttempts) {
    try {
      serverInstance = await startServer(portToTry);
      return;
    } catch (err) {
      if (err && err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Porta ${portToTry} em uso. Tentando ${portToTry + 1}...`);
        portToTry += 1;
        attempt += 1;
      } else {
        throw err;
      }
    }
  }
  throw new Error(`Não foi possível iniciar o servidor após ${maxAttempts} tentativas.`);
}

// Inicializar aplicação
initializeConnections();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('🔄 Recebido SIGTERM, encerrando aplicação...');
  
  try {
    await pool.end();
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(() => resolve()));
    }
    if (redisClient?.isOpen) {
      await redisClient.quit();
    }
    console.log('✅ Conexões encerradas com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao encerrar conexões:', error);
    process.exit(1);
  }
});

process.on('SIGINT', async () => {
  console.log('🔄 Recebido SIGINT, encerrando aplicação...');
  
  try {
    await pool.end();
    if (serverInstance) {
      await new Promise((resolve) => serverInstance.close(() => resolve()));
    }
    if (redisClient?.isOpen) {
      await redisClient.quit();
    }
    console.log('✅ Conexões encerradas com sucesso');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao encerrar conexões:', error);
    process.exit(1);
  }
});

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
import matchRoutes from './src/routes/matchRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import userConnectionRoutes from './src/routes/userConnectionRoutes.js';

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
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // 100 em produção, 1000 em desenvolvimento
  message: {
    success: false,
    message: 'Muitas requisições deste IP, tente novamente mais tarde'
  },
  standardHeaders: true, // Retorna rate limit info nos headers `RateLimit-*`
  legacyHeaders: false, // Desabilita headers `X-RateLimit-*`
  skip: (req) => {
    // Pular rate limiting para localhost em desenvolvimento
    if (process.env.NODE_ENV !== 'production' && req.ip === '::1') {
      return true;
    }
    return false;
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



// Test endpoint for debugging authentication
app.get('/api/test-auth-debug', async (req, res) => {
  try {
    console.log('🔍 Test auth debug endpoint chamado');
    
    // Apply authentication middleware first
    const { authenticateToken } = await import('./src/middleware/auth.js');
    
    authenticateToken(req, res, () => {
      console.log('✅ Middleware de autenticação passou');
      console.log('📋 req.user:', req.user);
      res.json({
        success: true,
        message: 'Test auth debug funcionando',
        user: req.user
      });
    });
  } catch (error) {
    console.error('❌ Erro no test auth debug endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Erro no test auth debug endpoint',
      error: error.message
    });
  }
});

// Test endpoint for debugging route
app.get('/api/test-route-debug', async (req, res) => {
  try {
    console.log('🔍 Test route debug endpoint chamado');
    
    // Simular exatamente o que a rota faz
    const matchController = (await import('./src/controllers/MatchController.js')).default;
    const { authenticateToken } = await import('./src/middleware/auth.js');
    
    // Simular req com autenticação válida (pular middleware)
    const mockReq = {
      params: { projectId: '2' },
      user: { id: 2 }
    };
    
    const mockRes = {
      json: (data) => {
        console.log('✅ Resposta da rota:', data);
        res.json({
          success: true,
          message: 'Test route debug funcionando',
          routeResponse: data
        });
      },
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Erro ${code} da rota:`, data);
          res.status(code).json({
            success: false,
            message: 'Erro na rota',
            routeError: data,
            statusCode: code
          });
        }
      })
    };
    
    // Pular middleware de autenticação e chamar diretamente o controller
    await matchController.canRequestParticipation(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Erro no test route debug endpoint:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no test route debug endpoint',
      error: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint for debugging MatchController
app.get('/api/test-controller-debug', async (req, res) => {
  try {
    console.log('🔍 Test controller debug endpoint chamado');
    
    // Importar MatchController diretamente
    const matchController = (await import('./src/controllers/MatchController.js')).default;
    
    // Simular req e res
    const mockReq = {
      params: { projectId: '2' },
      user: { id: 2 }
    };
    
    const mockRes = {
      json: (data) => {
        console.log('✅ Resposta do controller:', data);
        res.json({
          success: true,
          message: 'Test controller debug funcionando',
          controllerResponse: data
        });
      },
      status: (code) => ({
        json: (data) => {
          console.log(`❌ Erro ${code} do controller:`, data);
          res.status(code).json({
            success: false,
            message: 'Erro no controller',
            controllerError: data,
            statusCode: code
          });
        }
      })
    };
    
    await matchController.canRequestParticipation(mockReq, mockRes);
    
  } catch (error) {
    console.error('❌ Erro no test controller debug endpoint:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no test controller debug endpoint',
      error: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint for debugging match functionality
app.get('/api/test-match-debug', async (req, res) => {
  try {
    console.log('🔍 Test match debug endpoint chamado');
    
    // Simular o que o canRequestParticipation faz
    const projectId = '2';
    const userId = 2;
    
    console.log('📋 Parâmetros:', { projectId, userId });
    
    // Importar MatchService diretamente
    const MatchService = (await import('./src/services/MatchService.js')).default;
    const database = (await import('./src/config/database.js')).default;
    
    const matchService = new MatchService(database);
    const result = await matchService.canRequestParticipation(userId, projectId);
    
    console.log('✅ Resultado:', result);
    
    res.json({
      success: true,
      message: 'Test match debug funcionando',
      data: result
    });
  } catch (error) {
    console.error('❌ Erro no test match debug endpoint:', error);
    console.error('❌ Stack:', error.stack);
    res.status(500).json({ 
      success: false, 
      message: 'Erro no test match debug endpoint',
      error: error.message,
      stack: error.stack
    });
  }
});

// Test endpoint for debugging
app.get('/api/test-match', async (req, res) => {
  try {
    console.log('🔍 Test endpoint chamado');
    res.json({ success: true, message: 'Test endpoint funcionando' });
  } catch (error) {
    console.error('❌ Erro no test endpoint:', error);
    res.status(500).json({ success: false, message: 'Erro no test endpoint' });
  }
});

// Rotas da API
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/user-connections', userConnectionRoutes);

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
      matches: '/api/matches',
      health: '/health'
    }
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, _next) => {
  console.error('Erro não tratado:', err);
  console.error('Erro detalhado:', err.message);
  console.error('Stack:', err.stack);
  
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
    console.log('🏠 DB_HOST:', process.env.DB_HOST || 'Não configurado');
    console.log('🔒 SSL:', process.env.DB_SSL || 'true');
    console.log('🌍 NODE_ENV:', process.env.NODE_ENV || 'development');
    
    const useIndividual = process.env.NODE_ENV === 'production' && process.env.DB_HOST;
    const useConnectionString = Boolean(process.env.DATABASE_URL) && !useIndividual;
    
    console.log('🔧 Modo de conexão:', useIndividual ? 'Variáveis individuais' : useConnectionString ? 'Connection String' : 'Fallback');
    
    // Test database connection with retry logic
    let retries = 3;
    let connected = false;
    
    while (retries > 0 && !connected) {
      try {
        await pool.query('SELECT NOW()');
        console.log('✅ Conectado ao banco de dados PostgreSQL');
        connected = true;
      } catch (dbError) {
        retries--;
        console.warn(`⚠️ Tentativa de conexão falhou. Tentativas restantes: ${retries}`);
        if (retries === 0) {
          throw dbError;
        }
        await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds before retry
      }
    }
    
    // Testar conexão com Redis (opcional)
    const hasRedisUrl = Boolean(process.env.REDIS_URL);
    const redisEnabled = process.env.REDIS_ENABLED !== 'false';
    
    if (hasRedisUrl && redisEnabled) {
      try {
        await redisClient.connect();
        console.log('✅ Conectado ao Redis');
      } catch (redisError) {
        console.warn('⚠️ Não foi possível conectar ao Redis. Continuando sem cache.', redisError?.message || redisError);
      }
    } else {
      console.log('ℹ️ Redis desabilitado ou não configurado. Usando modo mock.');
    }
    
    // Iniciar servidor com fallback de porta se estiver em uso
    await startServerWithFallback(PORT);
  } catch (error) {
    console.error('❌ Erro ao inicializar conexões:', error);
    console.error('❌ Detalhes do erro:', error.message);
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

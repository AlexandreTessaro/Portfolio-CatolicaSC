import dotenv from 'dotenv';
import app from './app.js';
import pool from './src/config/database.js';
import redisClient from './src/config/redis.js';
import { setupSocketIO } from './src/config/socket.js';

dotenv.config();
// Azure App Service usa porta 8080 por padrão
// Koyeb e outros podem usar 5000
const PORT = Number(process.env.PORT) || 5000;
let serverInstance = null;

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

// (Demais rotas, middlewares e health estão definidos em app.js)

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
      
      // Configurar Socket.io
      const io = setupSocketIO(server);
      console.log('🔌 Socket.io configurado');
      
      // Exportar io para uso em outros módulos
      app.set('io', io);
      
      // Heartbeat para manter o processo ativo no Azure App Service
      // Azure mata processos sem output por 60 segundos
      const heartbeatInterval = setInterval(() => {
        console.log('💓 Heartbeat - Servidor ativo');
      }, 30000); // A cada 30 segundos
      
      // Limpar intervalo ao encerrar
      server.on('close', () => {
        clearInterval(heartbeatInterval);
      });
      
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

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import 'express-async-errors';

// Rotas
import userRoutes from './src/routes/userRoutes.js';
import projectRoutes from './src/routes/projectRoutes.js';
import matchRoutes from './src/routes/matchRoutes.js';
import recommendationRoutes from './src/routes/recommendationRoutes.js';
import userConnectionRoutes from './src/routes/userConnectionRoutes.js';
import createTables from './scripts/migrate.js';

dotenv.config();

const app = express();

// Segurança
app.use(helmet());

// CORS com validação flexível de origin (inclui variações com/sem esquema)
const configuredFrontend = process.env.FRONTEND_URL || 'http://localhost:3000';
const frontendHost = configuredFrontend.replace(/^https?:\/\//, '');
const allowedOrigins = new Set([
  configuredFrontend,
  `https://${frontendHost}`,
  `http://${frontendHost}`,
  frontendHost // caso algum proxy/env injete sem esquema
]);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.has(origin)) return callback(null, true);
    // Permitir prévias do Vercel se forem do mesmo host base
    if (origin.endsWith('.vercel.app')) return callback(null, true);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

// Rate limit
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: process.env.NODE_ENV === 'production' ? 100 : 1000,
  message: {
    success: false,
    message: 'Muitas requisições deste IP, tente novamente mais tarde'
  },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => {
    if (process.env.NODE_ENV !== 'production' && req.ip === '::1') {
      return true;
    }
    return false;
  }
});
app.use('/api/', limiter);

// Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas principais
app.use('/api/users', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/matches', matchRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/user-connections', userConnectionRoutes);

// Endpoint seguro para migrações (executar uma vez no ambiente)
app.post('/api/admin/run-migrations', async (req, res) => {
  try {
    const token = req.headers['x-migration-token'];
    if (!process.env.MIGRATION_TOKEN || token !== process.env.MIGRATION_TOKEN) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    await createTables();
    res.json({ success: true, message: 'Migrações executadas com sucesso' });
  } catch (error) {
    console.error('Erro ao executar migrações:', error);
    res.status(500).json({ success: false, message: 'Falha ao executar migrações' });
  }
});

// Alternativa GET temporária para migrações (mesma proteção por token)
app.get('/api/admin/run-migrations', async (req, res) => {
  try {
    const token = req.headers['x-migration-token'] || req.query.token;
    if (!process.env.MIGRATION_TOKEN || token !== process.env.MIGRATION_TOKEN) {
      return res.status(403).json({ success: false, message: 'Acesso negado' });
    }
    await createTables();
    res.json({ success: true, message: 'Migrações executadas com sucesso' });
  } catch (error) {
    console.error('Erro ao executar migrações (GET):', error);
    res.status(500).json({ success: false, message: 'Falha ao executar migrações' });
  }
});

// Health
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'API funcionando corretamente',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Root
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

// Errors
app.use((err, _req, res, _next) => {
  console.error('Erro não tratado:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404
app.use('*', (_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});

export default app;



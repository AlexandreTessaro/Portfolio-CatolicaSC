import dotenv from 'dotenv';

dotenv.config();

// Verificar se Redis está habilitado
const redisEnabled = process.env.REDIS_ENABLED !== 'false';

// Criar um cliente mock para quando Redis não estiver disponível
const mockClient = {
  async connect() {
    console.log('ℹ️ Redis mock - conectado');
  },
  async disconnect() {
    console.log('ℹ️ Redis mock - desconectado');
  },
  async get() {
    return null;
  },
  async set() {
    return 'OK';
  },
  async del() {
    return 1;
  },
  async exists() {
    return 0;
  },
  async expire() {
    return 1;
  },
  async flushAll() {
    return 'OK';
  },
  async quit() {
    console.log('ℹ️ Redis mock - quit');
  },
  isOpen: true,
  on: () => {},
  off: () => {}
};

let client = mockClient;

if (redisEnabled) {
  try {
    // Importar Redis apenas quando necessário
    const { createClient } = await import('redis');
    
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    client = createClient({
      url: redisUrl
    });

    client.on('error', (err) => {
      console.error('❌ Erro no Redis:', err);
    });

    client.on('connect', () => {
      console.log('✅ Conectado ao Redis');
    });

    client.on('ready', () => {
      console.log('✅ Redis pronto para uso');
    });
  } catch (error) {
    console.log('⚠️ Redis desabilitado devido a erro:', error.message);
    client = mockClient;
  }
} else {
  console.log('ℹ️ Redis desabilitado por configuração');
}

export default client;

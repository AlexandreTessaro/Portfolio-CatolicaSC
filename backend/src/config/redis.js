import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const client = createClient({
  url: process.env.REDIS_URL || 'redis://localhost:6379'
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

export default client;

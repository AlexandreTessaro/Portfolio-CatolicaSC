// Script para testar autenticação no frontend
import { useAuthStore } from './src/stores/authStore.js';

console.log('🔄 Testando estado de autenticação...');

const authStore = useAuthStore.getState();
console.log('📊 Estado de autenticação:', {
  isAuthenticated: authStore.isAuthenticated,
  hasAccessToken: !!authStore.getAccessToken(),
  tokenPreview: authStore.getAccessToken()?.substring(0, 20) + '...'
});

if (authStore.getAccessToken()) {
  console.log('✅ Token encontrado');
} else {
  console.log('❌ Token não encontrado');
}

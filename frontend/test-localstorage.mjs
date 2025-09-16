// Script para verificar localStorage
console.log('🔄 Verificando localStorage...');

if (typeof localStorage !== 'undefined') {
  const authData = localStorage.getItem('auth-storage');
  console.log('📊 Dados de auth no localStorage:', authData);
  
  if (authData) {
    try {
      const parsed = JSON.parse(authData);
      console.log('📊 Dados parseados:', parsed);
    } catch (error) {
      console.error('❌ Erro ao fazer parse:', error);
    }
  } else {
    console.log('❌ Nenhum dado de auth encontrado');
  }
} else {
  console.log('❌ localStorage não disponível');
}

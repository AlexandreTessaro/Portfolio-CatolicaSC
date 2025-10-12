import generateSyntheticData from './scripts/generate-synthetic-data.js';
import generateRealisticData from './scripts/generate-realistic-data.js';

// Teste básico de geração de dados sintéticos
async function testSyntheticData() {
  try {
    console.log('🧪 Testando geração de dados sintéticos...');
    
    // Teste com dados mínimos
    await generateSyntheticData({
      numUsers: 5,
      numProjects: 3,
      numMatches: 5,
      includeAdmin: true,
      clearExisting: false
    });
    
    console.log('✅ Teste de dados sintéticos concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste de dados sintéticos:', error.message);
  }
}

// Teste básico de geração de dados realistas
async function testRealisticData() {
  try {
    console.log('🧪 Testando geração de dados realistas...');
    
    await generateRealisticData({
      clearExisting: false,
      includeAdmin: true
    });
    
    console.log('✅ Teste de dados realistas concluído com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro no teste de dados realistas:', error.message);
  }
}

// Executar testes
async function runTests() {
  console.log('🚀 Iniciando testes de geração de dados...\n');
  
  await testSyntheticData();
  console.log('');
  await testRealisticData();
  
  console.log('\n🎉 Todos os testes concluídos!');
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  runTests()
    .then(() => {
      console.log('✅ Testes executados com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha nos testes:', error);
      process.exit(1);
    });
}

export { testSyntheticData, testRealisticData };


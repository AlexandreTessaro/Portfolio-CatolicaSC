// Exemplos de uso dos scripts de geração de dados sintéticos

import generateSyntheticData from './generate-synthetic-data.js';
import generateRealisticData from './generate-realistic-data.js';
import { showStats, clearAllData } from './data-manager.js';

// Exemplo 1: Gerar dados realistas para desenvolvimento
async function exemploDesenvolvimento() {
  console.log('📝 Exemplo 1: Dados para desenvolvimento');
  
  try {
    // Limpar dados existentes
    await clearAllData();
    
    // Gerar dados realistas
    await generateRealisticData({
      clearExisting: false,
      includeAdmin: true
    });
    
    // Mostrar estatísticas
    await showStats();
    
    console.log('✅ Dados de desenvolvimento gerados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Exemplo 2: Gerar dados sintéticos para testes
async function exemploTestes() {
  console.log('📝 Exemplo 2: Dados para testes');
  
  try {
    // Gerar dados sintéticos em volume
    await generateSyntheticData({
      numUsers: 100,
      numProjects: 50,
      numMatches: 200,
      includeAdmin: true,
      clearExisting: true
    });
    
    // Mostrar estatísticas
    await showStats();
    
    console.log('✅ Dados de teste gerados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Exemplo 3: Gerar dados personalizados
async function exemploPersonalizado() {
  console.log('📝 Exemplo 3: Dados personalizados');
  
  try {
    // Gerar dados com configuração específica
    await generateSyntheticData({
      numUsers: 25,
      numProjects: 15,
      numMatches: 50,
      includeAdmin: false, // Sem admin
      clearExisting: true
    });
    
    // Mostrar estatísticas
    await showStats();
    
    console.log('✅ Dados personalizados gerados com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Exemplo 4: Workflow completo
async function exemploWorkflowCompleto() {
  console.log('📝 Exemplo 4: Workflow completo');
  
  try {
    console.log('1. Limpando dados existentes...');
    await clearAllData();
    
    console.log('2. Gerando dados realistas...');
    await generateRealisticData({
      clearExisting: false,
      includeAdmin: true
    });
    
    console.log('3. Mostrando estatísticas...');
    await showStats();
    
    console.log('4. Adicionando mais dados sintéticos...');
    await generateSyntheticData({
      numUsers: 20,
      numProjects: 10,
      numMatches: 30,
      includeAdmin: false,
      clearExisting: false
    });
    
    console.log('5. Estatísticas finais...');
    await showStats();
    
    console.log('✅ Workflow completo executado com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro:', error.message);
  }
}

// Função para executar todos os exemplos
async function executarTodosExemplos() {
  console.log('🚀 Executando todos os exemplos...\n');
  
  await exemploDesenvolvimento();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploTestes();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploPersonalizado();
  console.log('\n' + '='.repeat(50) + '\n');
  
  await exemploWorkflowCompleto();
  
  console.log('\n🎉 Todos os exemplos executados!');
}

// Executar exemplo específico baseado no argumento
async function main() {
  const exemplo = process.argv[2];
  
  switch (exemplo) {
    case 'desenvolvimento':
      await exemploDesenvolvimento();
      break;
    case 'testes':
      await exemploTestes();
      break;
    case 'personalizado':
      await exemploPersonalizado();
      break;
    case 'workflow':
      await exemploWorkflowCompleto();
      break;
    case 'todos':
      await executarTodosExemplos();
      break;
    default:
      console.log('🛠️ Exemplos de uso dos scripts de dados sintéticos');
      console.log('\nComandos disponíveis:');
      console.log('   node scripts/examples.js desenvolvimento  - Dados para desenvolvimento');
      console.log('   node scripts/examples.js testes          - Dados para testes');
      console.log('   node scripts/examples.js personalizado   - Dados personalizados');
      console.log('   node scripts/examples.js workflow        - Workflow completo');
      console.log('   node scripts/examples.js todos           - Executar todos os exemplos');
      break;
  }
}

// Executar se chamado diretamente
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
    .then(() => {
      console.log('✅ Exemplo executado com sucesso');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Falha no exemplo:', error);
      process.exit(1);
    });
}

export { 
  exemploDesenvolvimento, 
  exemploTestes, 
  exemploPersonalizado, 
  exemploWorkflowCompleto,
  executarTodosExemplos 
};


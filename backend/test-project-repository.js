import database from './src/config/database.js';
import ProjectRepository from './src/repositories/ProjectRepository.js';

async function testProjectRepository() {
  try {
    console.log('🔍 Testando ProjectRepository.findById...');
    
    const projectRepo = new ProjectRepository(database);
    const project = await projectRepo.findById(1);
    
    console.log('✅ Projeto encontrado:', project);
    console.log('📋 Tipo do projeto:', typeof project);
    console.log('📋 Propriedades:', Object.keys(project || {}));
    
    if (project) {
      console.log('📋 project.creatorId:', project.creatorId);
      console.log('📋 project.id:', project.id);
    }
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

testProjectRepository();

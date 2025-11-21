import database from '../../src/config/database.js';
import ProjectRepository from '../../src/repositories/ProjectRepository.js';

async function listProjects() {
  try {
    console.log('🔍 Listando todos os projetos...');
    
    const projectRepo = new ProjectRepository(database);
    const projects = await projectRepo.findAll();
    
    console.log('✅ Projetos encontrados:');
    projects.forEach((project, index) => {
      console.log(`${index + 1}. ID: ${project.id}, Título: ${project.title}, Criador: ${project.creatorId}`);
    });
    
  } catch (error) {
    console.error('❌ Erro:', error);
    console.error('❌ Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

listProjects();

import { ProjectRepository } from '../repositories/ProjectRepository.js';
import { UserRepository } from '../repositories/UserRepository.js';
import { Project } from '../domain/Project.js';

export class ProjectService {
  constructor() {
    this.projectRepository = new ProjectRepository();
    this.userRepository = new UserRepository();
  }

  async createProject(projectData, creatorId) {
    try {
      // Validar dados do projeto
      const project = new Project(projectData);
      const validationErrors = project.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Verificar se o criador existe
      const creator = await this.userRepository.findById(creatorId);
      if (!creator) {
        throw new Error('Usuário criador não encontrado');
      }

      // Criar projeto
      const newProject = await this.projectRepository.create({
        ...projectData,
        creatorId
      });

      return newProject.toPublicView();
    } catch (error) {
      throw new Error(`Erro ao criar projeto: ${error.message}`);
    }
  }

  async getProject(projectId, userId = null) {
    try {
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      // Se o usuário é o criador ou membro da equipe, retornar visão completa
      if (userId && (project.creatorId === userId || project.teamMembers.includes(userId))) {
        return project.toPublicView();
      }

      // Caso contrário, retornar visão pública
      return project.toPublicView();
    } catch (error) {
      throw new Error(`Erro ao buscar projeto: ${error.message}`);
    }
  }

  async updateProject(projectId, updates, userId) {
    try {
      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      if (project.creatorId !== userId) {
        throw new Error('Apenas o criador pode editar o projeto');
      }

      // Validar dados de atualização
      const updatedProject = new Project({ ...project, ...updates });
      const validationErrors = updatedProject.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Atualizar projeto
      const result = await this.projectRepository.update(projectId, updates);
      if (!result) {
        throw new Error('Erro ao atualizar projeto');
      }

      return result.toPublicView();
    } catch (error) {
      throw new Error(`Erro ao atualizar projeto: ${error.message}`);
    }
  }

  async deleteProject(projectId, userId) {
    try {
      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      if (project.creatorId !== userId) {
        throw new Error('Apenas o criador pode deletar o projeto');
      }

      // Deletar projeto
      const deleted = await this.projectRepository.delete(projectId);
      if (!deleted) {
        throw new Error('Erro ao deletar projeto');
      }

      return { message: 'Projeto deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar projeto: ${error.message}`);
    }
  }

  async searchProjects(filters = {}, limit = 20, offset = 0) {
    try {
      const projects = await this.projectRepository.findAll(limit, offset, filters);
      return projects.map(project => project.toSummary());
    } catch (error) {
      throw new Error(`Erro ao buscar projetos: ${error.message}`);
    }
  }

  async searchProjectsByText(searchTerm, limit = 20) {
    try {
      const projects = await this.projectRepository.searchByText(searchTerm, limit);
      return projects.map(project => project.toSummary());
    } catch (error) {
      throw new Error(`Erro ao buscar projetos por texto: ${error.message}`);
    }
  }

  async getUserProjects(userId, limit = 20, offset = 0) {
    try {
      const projects = await this.projectRepository.findByCreatorId(userId, limit, offset);
      return projects.map(project => project.toSummary());
    } catch (error) {
      throw new Error(`Erro ao buscar projetos do usuário: ${error.message}`);
    }
  }

  async addTeamMember(projectId, userId, newMemberId) {
    try {
      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      if (project.creatorId !== userId) {
        throw new Error('Apenas o criador pode adicionar membros da equipe');
      }

      // Verificar se o novo membro existe
      const newMember = await this.userRepository.findById(newMemberId);
      if (!newMember) {
        throw new Error('Usuário não encontrado');
      }

      // Verificar se já é membro da equipe
      if (project.teamMembers.includes(newMemberId)) {
        throw new Error('Usuário já é membro da equipe');
      }

      // Adicionar membro à equipe
      project.addTeamMember(newMemberId);
      
      // Atualizar projeto no banco
      const updatedProject = await this.projectRepository.update(projectId, {
        teamMembers: project.teamMembers
      });

      return updatedProject.toPublicView();
    } catch (error) {
      throw new Error(`Erro ao adicionar membro da equipe: ${error.message}`);
    }
  }

  async removeTeamMember(projectId, userId, memberId) {
    try {
      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      if (project.creatorId !== userId) {
        throw new Error('Apenas o criador pode remover membros da equipe');
      }

      // Verificar se o membro existe na equipe
      if (!project.teamMembers.includes(memberId)) {
        throw new Error('Usuário não é membro da equipe');
      }

      // Remover membro da equipe
      project.removeTeamMember(memberId);
      
      // Atualizar projeto no banco
      const updatedProject = await this.projectRepository.update(projectId, {
        teamMembers: project.teamMembers
      });

      return updatedProject.toPublicView();
    } catch (error) {
      throw new Error(`Erro ao remover membro da equipe: ${error.message}`);
    }
  }

  async getRecommendedProjects(userId, limit = 10) {
    try {
      // Buscar usuário e suas habilidades
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Buscar projetos que correspondam às habilidades do usuário
      const projects = await this.projectRepository.findAll(limit, 0, {
        technologies: user.skills
      });

      return projects.map(project => project.toSummary());
    } catch (error) {
      throw new Error(`Erro ao buscar projetos recomendados: ${error.message}`);
    }
  }
}

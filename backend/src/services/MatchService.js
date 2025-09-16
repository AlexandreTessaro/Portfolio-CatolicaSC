import Match from '../domain/Match.js';
import MatchRepository from '../repositories/MatchRepository.js';
import ProjectRepository from '../repositories/ProjectRepository.js';
import UserRepository from '../repositories/UserRepository.js';

class MatchService {
  constructor(database) {
    this.matchRepository = new MatchRepository(database);
    this.projectRepository = new ProjectRepository(database);
    this.userRepository = new UserRepository(database);
  }

  // Criar uma nova solicitação de match
  async createMatch(userId, projectId, message) {
    try {
      // Validar se o projeto existe
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      // Validar se o usuário não é o criador do projeto
      if (project.creatorId === userId) {
        throw new Error('Você não pode solicitar participação no seu próprio projeto');
      }

      // Validar se já existe uma solicitação
      const existingMatch = await this.matchRepository.existsByUserAndProject(userId, projectId);
      if (existingMatch) {
        throw new Error('Você já enviou uma solicitação para este projeto');
      }

      // Validar mensagem
      if (!Match.validateMessage(message)) {
        throw new Error('Mensagem deve ter entre 10 e 500 caracteres');
      }

      // Criar o match
      const matchData = {
        projectId,
        userId,
        status: 'pending',
        message,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const match = await this.matchRepository.create(matchData);
      return match;
    } catch (error) {
      throw new Error(`Erro ao criar match: ${error.message}`);
    }
  }

  // Buscar matches recebidos (para criadores de projeto)
  async getReceivedMatches(userId, status = null) {
    try {
      // Buscar projetos criados pelo usuário
      const projects = await this.projectRepository.findByCreatorId(userId);
      const projectIds = projects.map(p => p.id);

      if (projectIds.length === 0) {
        return [];
      }

      // Buscar matches para esses projetos
      const allMatches = [];
      for (const projectId of projectIds) {
        const matches = await this.matchRepository.findByProjectId(projectId, status);
        allMatches.push(...matches);
      }

      return allMatches.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      throw new Error(`Erro ao buscar matches recebidos: ${error.message}`);
    }
  }

  // Buscar matches enviados (para usuários que solicitaram)
  async getSentMatches(userId, status = null) {
    try {
      return await this.matchRepository.findByUserId(userId, status);
    } catch (error) {
      throw new Error(`Erro ao buscar matches enviados: ${error.message}`);
    }
  }

  // Aceitar um match
  async acceptMatch(matchId, userId) {
    try {
      const match = await this.matchRepository.findById(matchId);
      if (!match) {
        throw new Error('Match não encontrado');
      }

      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(match.projectId);
      if (!project || project.creatorId !== userId) {
        throw new Error('Você não tem permissão para aceitar este match');
      }

      // Verificar se o match pode ser aceito
      if (!match.canBeAccepted()) {
        throw new Error('Este match não pode ser aceito');
      }

      // Atualizar status
      const updatedMatch = await this.matchRepository.updateStatus(matchId, 'accepted');
      return updatedMatch;
    } catch (error) {
      throw new Error(`Erro ao aceitar match: ${error.message}`);
    }
  }

  // Rejeitar um match
  async rejectMatch(matchId, userId) {
    try {
      const match = await this.matchRepository.findById(matchId);
      if (!match) {
        throw new Error('Match não encontrado');
      }

      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(match.projectId);
      if (!project || project.creatorId !== userId) {
        throw new Error('Você não tem permissão para rejeitar este match');
      }

      // Verificar se o match pode ser rejeitado
      if (!match.canBeRejected()) {
        throw new Error('Este match não pode ser rejeitado');
      }

      // Atualizar status
      const updatedMatch = await this.matchRepository.updateStatus(matchId, 'rejected');
      return updatedMatch;
    } catch (error) {
      throw new Error(`Erro ao rejeitar match: ${error.message}`);
    }
  }

  // Bloquear um match
  async blockMatch(matchId, userId) {
    try {
      const match = await this.matchRepository.findById(matchId);
      if (!match) {
        throw new Error('Match não encontrado');
      }

      // Verificar se o usuário é o criador do projeto
      const project = await this.projectRepository.findById(match.projectId);
      if (!project || project.creatorId !== userId) {
        throw new Error('Você não tem permissão para bloquear este match');
      }

      // Verificar se o match pode ser bloqueado
      if (!match.canBeBlocked()) {
        throw new Error('Este match não pode ser bloqueado');
      }

      // Atualizar status
      const updatedMatch = await this.matchRepository.updateStatus(matchId, 'blocked');
      return updatedMatch;
    } catch (error) {
      throw new Error(`Erro ao bloquear match: ${error.message}`);
    }
  }

  // Cancelar um match (para quem enviou)
  async cancelMatch(matchId, userId) {
    try {
      const match = await this.matchRepository.findById(matchId);
      if (!match) {
        throw new Error('Match não encontrado');
      }

      // Verificar se o usuário é quem enviou o match
      if (match.userId !== userId) {
        throw new Error('Você não tem permissão para cancelar este match');
      }

      // Verificar se o match ainda está pendente
      if (!match.isPending()) {
        throw new Error('Apenas matches pendentes podem ser cancelados');
      }

      // Deletar o match
      const deleted = await this.matchRepository.delete(matchId);
      return deleted;
    } catch (error) {
      throw new Error(`Erro ao cancelar match: ${error.message}`);
    }
  }

  // Buscar match por ID
  async getMatchById(matchId) {
    try {
      return await this.matchRepository.findById(matchId);
    } catch (error) {
      throw new Error(`Erro ao buscar match: ${error.message}`);
    }
  }

  // Obter estatísticas de matches
  async getMatchStats(userId) {
    try {
      const sentMatches = await this.matchRepository.findByUserId(userId);
      const receivedMatches = await this.getReceivedMatches(userId);

      const stats = {
        sent: {
          total: sentMatches.length,
          pending: sentMatches.filter(m => m.status === 'pending').length,
          accepted: sentMatches.filter(m => m.status === 'accepted').length,
          rejected: sentMatches.filter(m => m.status === 'rejected').length,
          blocked: sentMatches.filter(m => m.status === 'blocked').length
        },
        received: {
          total: receivedMatches.length,
          pending: receivedMatches.filter(m => m.status === 'pending').length,
          accepted: receivedMatches.filter(m => m.status === 'accepted').length,
          rejected: receivedMatches.filter(m => m.status === 'rejected').length,
          blocked: receivedMatches.filter(m => m.status === 'blocked').length
        }
      };

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }

  // Verificar se usuário pode solicitar participação em projeto
  async canRequestParticipation(userId, projectId) {
    try {
      // Verificar se o projeto existe
      const project = await this.projectRepository.findById(projectId);
      if (!project) {
        return { canRequest: false, reason: 'Projeto não encontrado' };
      }

      // Verificar se não é o criador
      if (project.creatorId === userId) {
        return { canRequest: false, reason: 'Você não pode solicitar participação no seu próprio projeto' };
      }

      // Verificar se já existe solicitação
      const existingMatch = await this.matchRepository.existsByUserAndProject(userId, projectId);
      if (existingMatch) {
        return { canRequest: false, reason: 'Você já enviou uma solicitação para este projeto' };
      }

      return { canRequest: true };
    } catch (error) {
      return { canRequest: false, reason: 'Erro interno' };
    }
  }
}

export default MatchService;

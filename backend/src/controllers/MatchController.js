import MatchService from '../services/MatchService.js';
import pool from '../config/database.js';

class MatchController {
  constructor() {
    this.matchService = new MatchService(pool);
  }

  // Criar uma nova solicitação de match
  async createMatch(req, res) {
    try {
      const { projectId, message } = req.body;
      const userId = req.user?.userId;
      
      // Validações básicas
      if (!projectId || !message) {
        return res.status(400).json({
          success: false,
          message: 'ProjectId e message são obrigatórios'
        });
      }

      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      // Usar o serviço através do getter
      const match = await this.matchService.createMatch(userId, projectId, message);

      res.status(201).json({
        success: true,
        message: 'Solicitação enviada com sucesso',
        data: match.toJSON()
      });
    } catch (error) {
      console.error('Erro ao criar match:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar matches recebidos (para criadores de projeto)
  getReceivedMatches = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { status } = req.query || {};

      const matches = await this.matchService.getReceivedMatches(userId, status);

      res.json({
        success: true,
        data: matches.map(match => match.toJSON())
      });
    } catch (error) {
      console.error('Erro ao buscar matches recebidos:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar matches enviados (para usuários que solicitaram)
  getSentMatches = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { status } = req.query || {};

      const matches = await this.matchService.getSentMatches(userId, status);

      res.json({
        success: true,
        data: matches.map(match => match.toJSON())
      });
    } catch (error) {
      console.error('Erro ao buscar matches enviados:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Aceitar um match
  async acceptMatch(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;

      const match = await this.matchService.acceptMatch(matchId, userId);

      res.json({
        success: true,
        message: 'Match aceito com sucesso',
        data: match.toJSON()
      });
    } catch (error) {
      console.error('Erro ao aceitar match:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Rejeitar um match
  async rejectMatch(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;

      const match = await this.matchService.rejectMatch(matchId, userId);

      res.json({
        success: true,
        message: 'Match rejeitado com sucesso',
        data: match.toJSON()
      });
    } catch (error) {
      console.error('Erro ao rejeitar match:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Bloquear um match
  async blockMatch(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;

      const match = await this.matchService.blockMatch(matchId, userId);

      res.json({
        success: true,
        message: 'Match bloqueado com sucesso',
        data: match.toJSON()
      });
    } catch (error) {
      console.error('Erro ao bloquear match:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Cancelar um match
  async cancelMatch(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;

      const deleted = await this.matchService.cancelMatch(matchId, userId);

      if (deleted) {
        res.json({
          success: true,
          message: 'Match cancelado com sucesso'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Match não encontrado'
        });
      }
    } catch (error) {
      console.error('Erro ao cancelar match:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar match por ID
  async getMatchById(req, res) {
    try {
      const { matchId } = req.params;
      const userId = req.user.userId;

      const match = await this.matchService.getMatchById(matchId, userId);

      if (!match) {
        return res.status(404).json({
          success: false,
          message: 'Match não encontrado'
        });
      }

      res.json({
        success: true,
        data: match.toJSON()
      });
    } catch (error) {
      console.error('Erro ao buscar match:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Obter estatísticas de matches
  getMatchStats = async (req, res) => {
    try {
      const userId = req.user.userId;
      
      const stats = await this.matchService.getMatchStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas:', error);
      console.error('Erro detalhado:', error.message);
      console.error('Stack:', error.stack);
      res.status(500).json({
        success: false,
        message: `Erro interno do servidor: ${error.message}`
      });
    }
  }

  // Verificar se pode solicitar participação
  async canRequestParticipation(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.userId;
      
      const result = await this.matchService.canRequestParticipation(userId, projectId);

      res.json({
        success: true,
        data: result
      });
    } catch (error) {
      console.error('Erro ao verificar permissão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

export default MatchController;

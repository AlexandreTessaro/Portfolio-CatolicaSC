import MatchService from '../services/MatchService.js';
import database from '../config/database.js';

class MatchController {
  constructor() {
    this._matchService = null;
  }

  get matchService() {
    if (!this._matchService) {
      console.log('🔧 Inicializando MatchService...');
      this._matchService = new MatchService(database);
      console.log('✅ MatchService inicializado');
    }
    return this._matchService;
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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const match = await matchService.createMatch(userId, projectId, message);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const matches = await matchService.getReceivedMatches(userId, status);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const matches = await matchService.getSentMatches(userId, status);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const match = await matchService.acceptMatch(matchId, userId);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const match = await matchService.rejectMatch(matchId, userId);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const match = await matchService.blockMatch(matchId, userId);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const deleted = await matchService.cancelMatch(matchId, userId);

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

      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const match = await matchService.getMatchById(matchId, userId);

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
      
      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const stats = await matchService.getMatchStats(userId);

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
      
      // Inicializar MatchService diretamente
      const matchService = new MatchService(database);
      const result = await matchService.canRequestParticipation(userId, projectId);

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

export default new MatchController();

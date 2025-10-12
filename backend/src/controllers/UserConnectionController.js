import { UserConnectionService } from '../services/UserConnectionService.js';
import { body, validationResult } from 'express-validator';

export class UserConnectionController {
  constructor() {
    this.userConnectionService = new UserConnectionService();
  }

  // Validações para criar conexão
  validateCreateConnection() {
    return [
      body('receiverId').isInt({ min: 1 }).withMessage('ID do receptor deve ser um número inteiro válido'),
      body('message').optional().isLength({ max: 500 }).withMessage('Mensagem deve ter no máximo 500 caracteres')
    ];
  }

  // Criar uma nova solicitação de conexão
  async createConnection(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Dados inválidos',
          errors: errors.array()
        });
      }

      const { receiverId, message } = req.body;
      const requesterId = req.user.userId;

      const connection = await this.userConnectionService.createConnection(requesterId, receiverId, message);

      res.status(201).json({
        success: true,
        message: 'Solicitação de conexão enviada com sucesso',
        data: connection.toJSON()
      });
    } catch (error) {
      console.error('Erro ao criar conexão:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Aceitar uma conexão
  async acceptConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.userId;

      const connection = await this.userConnectionService.acceptConnection(connectionId, userId);

      res.json({
        success: true,
        message: 'Conexão aceita com sucesso',
        data: connection.toJSON()
      });
    } catch (error) {
      console.error('Erro ao aceitar conexão:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Rejeitar uma conexão
  async rejectConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.userId;

      const connection = await this.userConnectionService.rejectConnection(connectionId, userId);

      res.json({
        success: true,
        message: 'Conexão rejeitada',
        data: connection.toJSON()
      });
    } catch (error) {
      console.error('Erro ao rejeitar conexão:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Bloquear uma conexão
  async blockConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.userId;

      const connection = await this.userConnectionService.blockConnection(connectionId, userId);

      res.json({
        success: true,
        message: 'Conexão bloqueada',
        data: connection.toJSON()
      });
    } catch (error) {
      console.error('Erro ao bloquear conexão:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar conexões recebidas
  async getReceivedConnections(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;

      const connections = await this.userConnectionService.getReceivedConnections(userId, status);

      res.json({
        success: true,
        data: connections
      });
    } catch (error) {
      console.error('Erro ao buscar conexões recebidas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar conexões enviadas
  async getSentConnections(req, res) {
    try {
      const userId = req.user.userId;
      const { status } = req.query;

      const connections = await this.userConnectionService.getSentConnections(userId, status);

      res.json({
        success: true,
        data: connections
      });
    } catch (error) {
      console.error('Erro ao buscar conexões enviadas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Buscar conexões aceitas (amigos)
  async getAcceptedConnections(req, res) {
    try {
      const userId = req.user.userId;

      const connections = await this.userConnectionService.getAcceptedConnections(userId);

      res.json({
        success: true,
        data: connections
      });
    } catch (error) {
      console.error('Erro ao buscar conexões aceitas:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Verificar status de conexão entre dois usuários
  async getConnectionStatus(req, res) {
    try {
      const { userId } = req.params;
      const currentUserId = req.user.userId;

      const connectionStatus = await this.userConnectionService.areUsersConnected(currentUserId, userId);

      res.json({
        success: true,
        data: connectionStatus
      });
    } catch (error) {
      console.error('Erro ao verificar status de conexão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }

  // Deletar conexão
  async deleteConnection(req, res) {
    try {
      const { connectionId } = req.params;
      const userId = req.user.userId;

      const connection = await this.userConnectionService.deleteConnection(connectionId, userId);

      res.json({
        success: true,
        message: 'Conexão removida com sucesso',
        data: connection.toJSON()
      });
    } catch (error) {
      console.error('Erro ao deletar conexão:', error);
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obter estatísticas de conexões
  async getConnectionStats(req, res) {
    try {
      const userId = req.user.userId;

      const stats = await this.userConnectionService.getConnectionStats(userId);

      res.json({
        success: true,
        data: stats
      });
    } catch (error) {
      console.error('Erro ao obter estatísticas de conexão:', error);
      res.status(500).json({
        success: false,
        message: 'Erro interno do servidor'
      });
    }
  }
}

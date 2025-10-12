import { UserConnectionRepository } from '../repositories/UserConnectionRepository.js';

export class UserConnectionService {
  constructor() {
    this.userConnectionRepository = new UserConnectionRepository();
  }

  // Criar uma nova solicitação de conexão
  async createConnection(requesterId, receiverId, message = null) {
    try {
      // Validar se não é o mesmo usuário
      if (requesterId === receiverId) {
        throw new Error('Você não pode se conectar consigo mesmo');
      }

      // Verificar se já existe conexão entre os usuários
      const existingConnection = await this.userConnectionRepository.existsBetweenUsers(requesterId, receiverId);
      if (existingConnection) {
        throw new Error('Já existe uma conexão entre estes usuários');
      }

      // Criar a conexão
      const connectionData = {
        requesterId: parseInt(requesterId),
        receiverId: parseInt(receiverId),
        status: 'pending',
        message
      };

      const connection = await this.userConnectionRepository.create(connectionData);
      return connection;
    } catch (error) {
      throw new Error(`Erro ao criar conexão: ${error.message}`);
    }
  }

  // Aceitar uma conexão
  async acceptConnection(connectionId, userId) {
    try {
      const connection = await this.userConnectionRepository.findById(connectionId);
      
      if (!connection) {
        throw new Error('Conexão não encontrada');
      }

      // Verificar se o usuário é o receptor da conexão
      if (connection.receiverId !== userId) {
        throw new Error('Você não tem permissão para aceitar esta conexão');
      }

      // Verificar se a conexão pode ser aceita
      if (!connection.canBeAccepted()) {
        throw new Error('Esta conexão não pode ser aceita');
      }

      // Atualizar status para aceito
      const updatedConnection = await this.userConnectionRepository.updateStatus(connectionId, 'accepted');
      return updatedConnection;
    } catch (error) {
      throw new Error(`Erro ao aceitar conexão: ${error.message}`);
    }
  }

  // Rejeitar uma conexão
  async rejectConnection(connectionId, userId) {
    try {
      const connection = await this.userConnectionRepository.findById(connectionId);
      
      if (!connection) {
        throw new Error('Conexão não encontrada');
      }

      // Verificar se o usuário é o receptor da conexão
      if (connection.receiverId !== userId) {
        throw new Error('Você não tem permissão para rejeitar esta conexão');
      }

      // Verificar se a conexão pode ser rejeitada
      if (!connection.canBeRejected()) {
        throw new Error('Esta conexão não pode ser rejeitada');
      }

      // Atualizar status para rejeitado
      const updatedConnection = await this.userConnectionRepository.updateStatus(connectionId, 'rejected');
      return updatedConnection;
    } catch (error) {
      throw new Error(`Erro ao rejeitar conexão: ${error.message}`);
    }
  }

  // Bloquear uma conexão
  async blockConnection(connectionId, userId) {
    try {
      const connection = await this.userConnectionRepository.findById(connectionId);
      
      if (!connection) {
        throw new Error('Conexão não encontrada');
      }

      // Verificar se o usuário é parte da conexão
      if (connection.requesterId !== userId && connection.receiverId !== userId) {
        throw new Error('Você não tem permissão para bloquear esta conexão');
      }

      // Verificar se a conexão pode ser bloqueada
      if (!connection.canBeBlocked()) {
        throw new Error('Esta conexão não pode ser bloqueada');
      }

      // Atualizar status para bloqueado
      const updatedConnection = await this.userConnectionRepository.updateStatus(connectionId, 'blocked');
      return updatedConnection;
    } catch (error) {
      throw new Error(`Erro ao bloquear conexão: ${error.message}`);
    }
  }

  // Buscar conexões recebidas
  async getReceivedConnections(userId, status = null) {
    try {
      return await this.userConnectionRepository.findReceivedConnections(userId, status);
    } catch (error) {
      throw new Error(`Erro ao buscar conexões recebidas: ${error.message}`);
    }
  }

  // Buscar conexões enviadas
  async getSentConnections(userId, status = null) {
    try {
      return await this.userConnectionRepository.findSentConnections(userId, status);
    } catch (error) {
      throw new Error(`Erro ao buscar conexões enviadas: ${error.message}`);
    }
  }

  // Buscar conexões aceitas (amigos)
  async getAcceptedConnections(userId) {
    try {
      return await this.userConnectionRepository.findAcceptedConnections(userId);
    } catch (error) {
      throw new Error(`Erro ao buscar conexões aceitas: ${error.message}`);
    }
  }

  // Verificar se usuários estão conectados
  async areUsersConnected(userId1, userId2) {
    try {
      const connection = await this.userConnectionRepository.findByRequesterAndReceiver(userId1, userId2);
      
      if (!connection) {
        return { status: 'none', connected: false };
      }

      return {
        status: connection.status,
        connected: connection.status === 'accepted',
        connectionId: connection.id
      };
    } catch (error) {
      throw new Error(`Erro ao verificar conexão: ${error.message}`);
    }
  }

  // Deletar conexão
  async deleteConnection(connectionId, userId) {
    try {
      const connection = await this.userConnectionRepository.findById(connectionId);
      
      if (!connection) {
        throw new Error('Conexão não encontrada');
      }

      // Verificar se o usuário é parte da conexão
      if (connection.requesterId !== userId && connection.receiverId !== userId) {
        throw new Error('Você não tem permissão para deletar esta conexão');
      }

      // Deletar a conexão
      const deletedConnection = await this.userConnectionRepository.delete(connectionId);
      return deletedConnection;
    } catch (error) {
      throw new Error(`Erro ao deletar conexão: ${error.message}`);
    }
  }

  // Obter estatísticas de conexões
  async getConnectionStats(userId) {
    try {
      const [
        receivedConnections,
        sentConnections,
        acceptedConnections
      ] = await Promise.all([
        this.userConnectionRepository.findReceivedConnections(userId),
        this.userConnectionRepository.findSentConnections(userId),
        this.userConnectionRepository.findAcceptedConnections(userId)
      ]);

      const stats = {
        total: receivedConnections.length + sentConnections.length,
        received: {
          total: receivedConnections.length,
          pending: receivedConnections.filter(c => c.status === 'pending').length,
          accepted: receivedConnections.filter(c => c.status === 'accepted').length,
          rejected: receivedConnections.filter(c => c.status === 'rejected').length
        },
        sent: {
          total: sentConnections.length,
          pending: sentConnections.filter(c => c.status === 'pending').length,
          accepted: sentConnections.filter(c => c.status === 'accepted').length,
          rejected: sentConnections.filter(c => c.status === 'rejected').length
        },
        friends: acceptedConnections.length
      };

      return stats;
    } catch (error) {
      throw new Error(`Erro ao obter estatísticas: ${error.message}`);
    }
  }
}

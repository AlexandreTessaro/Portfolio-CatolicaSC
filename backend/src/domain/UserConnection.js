export class UserConnection {
  constructor({
    id,
    requesterId,
    receiverId,
    status = 'pending',
    message = null,
    createdAt = new Date(),
    updatedAt = new Date()
  }) {
    this.id = id;
    this.requesterId = requesterId;
    this.receiverId = receiverId;
    this.status = status;
    this.message = message;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  // Validações
  static validateStatus(status) {
    const validStatuses = ['pending', 'accepted', 'rejected', 'blocked'];
    return validStatuses.includes(status);
  }

  static validateMessage(message) {
    if (!message) return true; // Mensagem é opcional
    return message.length >= 0 && message.length <= 500;
  }

  // Métodos de validação
  isValid() {
    return this.requesterId && 
           this.receiverId && 
           this.requesterId !== this.receiverId &&
           UserConnection.validateStatus(this.status) &&
           UserConnection.validateMessage(this.message);
  }

  canBeAccepted() {
    return this.status === 'pending';
  }

  canBeRejected() {
    return this.status === 'pending';
  }

  canBeBlocked() {
    return this.status === 'pending' || this.status === 'accepted';
  }

  // Converter para JSON
  toJSON() {
    return {
      id: this.id,
      requesterId: this.requesterId,
      receiverId: this.receiverId,
      status: this.status,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  // Converter para JSON público (sem informações sensíveis)
  toPublicJSON() {
    return {
      id: this.id,
      status: this.status,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }
}

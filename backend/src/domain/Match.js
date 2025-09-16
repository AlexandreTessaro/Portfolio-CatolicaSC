class Match {
  constructor({
    id,
    projectId,
    userId,
    status, // 'pending', 'accepted', 'rejected', 'blocked'
    message,
    createdAt,
    updatedAt,
    project = null,
    user = null
  }) {
    this.id = id;
    this.projectId = projectId;
    this.userId = userId;
    this.status = status;
    this.message = message;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.project = project;
    this.user = user;
  }

  // Validações
  static validateStatus(status) {
    const validStatuses = ['pending', 'accepted', 'rejected', 'blocked'];
    return validStatuses.includes(status);
  }

  static validateMessage(message) {
    if (!message || typeof message !== 'string') {
      return false;
    }
    return message.length >= 10 && message.length <= 500;
  }

  // Métodos de negócio
  canBeAccepted() {
    return this.status === 'pending';
  }

  canBeRejected() {
    return this.status === 'pending';
  }

  canBeBlocked() {
    return this.status === 'pending';
  }

  isActive() {
    return this.status === 'accepted';
  }

  isPending() {
    return this.status === 'pending';
  }

  // Serialização para API
  toJSON() {
    return {
      id: this.id,
      projectId: this.projectId,
      userId: this.userId,
      status: this.status,
      message: this.message,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      project: this.project ? {
        id: this.project.id,
        title: this.project.title,
        description: this.project.description,
        status: this.project.status,
        technologies: this.project.technologies,
        creatorId: this.project.creatorId
      } : null,
      user: this.user ? {
        id: this.user.id,
        name: this.user.name,
        email: this.user.email,
        bio: this.user.bio,
        skills: this.user.skills,
        avatar: this.user.avatar
      } : null
    };
  }

  // Factory methods
  static createPendingMatch(projectId, userId, message) {
    const now = new Date();
    return new Match({
      projectId,
      userId,
      status: 'pending',
      message,
      createdAt: now,
      updatedAt: now
    });
  }

  static createAcceptedMatch(projectId, userId, message) {
    const now = new Date();
    return new Match({
      projectId,
      userId,
      status: 'accepted',
      message,
      createdAt: now,
      updatedAt: now
    });
  }
}

export default Match;

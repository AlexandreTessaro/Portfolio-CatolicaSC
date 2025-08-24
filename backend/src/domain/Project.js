export class Project {
  constructor({
    id,
    title,
    description,
    objectives,
    technologies,
    status,
    category,
    creatorId,
    teamMembers,
    collaborators,
    images,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.objectives = objectives || [];
    this.technologies = technologies || [];
    this.status = status || 'idea'; // idea, planning, development, testing, launched
    this.category = category || 'general';
    this.creatorId = creatorId;
    this.teamMembers = teamMembers || [];
    this.collaborators = collaborators || [];
    this.images = images || [];
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Validações de domínio
  validate() {
    const errors = [];

    if (!this.title || this.title.trim().length < 3) {
      errors.push('Título deve ter pelo menos 3 caracteres');
    }

    if (!this.description || this.description.trim().length < 10) {
      errors.push('Descrição deve ter pelo menos 10 caracteres');
    }

    if (this.title && this.title.length > 100) {
      errors.push('Título deve ter no máximo 100 caracteres');
    }

    if (this.description && this.description.length > 2000) {
      errors.push('Descrição deve ter no máximo 2000 caracteres');
    }

    if (this.technologies && this.technologies.length > 15) {
      errors.push('Máximo de 15 tecnologias permitidas');
    }

    if (this.objectives && this.objectives.length > 10) {
      errors.push('Máximo de 10 objetivos permitidos');
    }

    const validStatuses = ['idea', 'planning', 'development', 'testing', 'launched'];
    if (this.status && !validStatuses.includes(this.status)) {
      errors.push('Status inválido');
    }

    return errors;
  }

  // Métodos de negócio
  addTechnology(tech) {
    if (!this.technologies.includes(tech) && this.technologies.length < 15) {
      this.technologies.push(tech);
      this.updatedAt = new Date();
    }
  }

  removeTechnology(tech) {
    this.technologies = this.technologies.filter(t => t !== tech);
    this.updatedAt = new Date();
  }

  addObjective(objective) {
    if (!this.objectives.includes(objective) && this.objectives.length < 10) {
      this.objectives.push(objective);
      this.updatedAt = new Date();
    }
  }

  updateStatus(newStatus) {
    const validStatuses = ['idea', 'planning', 'development', 'testing', 'launched'];
    if (validStatuses.includes(newStatus)) {
      this.status = newStatus;
      this.updatedAt = new Date();
    }
  }

  addTeamMember(userId) {
    if (!this.teamMembers.includes(userId)) {
      this.teamMembers.push(userId);
      this.updatedAt = new Date();
    }
  }

  removeTeamMember(userId) {
    this.teamMembers = this.teamMembers.filter(id => id !== userId);
    this.updatedAt = new Date();
  }

  addCollaborator(userId) {
    if (!this.collaborators.includes(userId)) {
      this.collaborators.push(userId);
      this.updatedAt = new Date();
    }
  }

  toPublicView() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      objectives: this.objectives,
      technologies: this.technologies,
      status: this.status,
      category: this.category,
      creatorId: this.creatorId,
      teamMembers: this.teamMembers,
      collaborators: this.collaborators,
      images: this.images,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    };
  }

  toSummary() {
    return {
      id: this.id,
      title: this.title,
      description: this.description.substring(0, 150) + '...',
      technologies: this.technologies.slice(0, 5),
      status: this.status,
      category: this.category,
      createdAt: this.createdAt
    };
  }
}

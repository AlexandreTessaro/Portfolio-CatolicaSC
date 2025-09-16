export class User {
  constructor({
    id,
    email,
    password,
    name,
    bio,
    skills,
    socialLinks,
    profileImage,
    isAdmin,
    isVerified,
    createdAt,
    updatedAt
  }) {
    this.id = id;
    this.email = email;
    this.password = password;
    this.name = name;
    this.bio = bio;
    this.skills = skills || [];
    this.socialLinks = socialLinks || {};
    this.profileImage = profileImage;
    this.isAdmin = isAdmin || false;
    this.isVerified = isVerified || false;
    this.createdAt = createdAt || new Date();
    this.updatedAt = updatedAt || new Date();
  }

  // Validações de domínio
  validate() {
    const errors = [];

    if (!this.email || !this.email.includes('@')) {
      errors.push('Email inválido');
    }

    if (!this.name || this.name.trim().length < 2) {
      errors.push('Nome deve ter pelo menos 2 caracteres');
    }

    if (this.bio && this.bio.length > 500) {
      errors.push('Bio deve ter no máximo 500 caracteres');
    }

    if (this.skills && this.skills.length > 20) {
      errors.push('Máximo de 20 habilidades permitidas');
    }

    return errors;
  }

  // Métodos de negócio
  addSkill(skill) {
    if (!this.skills.includes(skill) && this.skills.length < 20) {
      this.skills.push(skill);
      this.updatedAt = new Date();
    }
  }

  removeSkill(skill) {
    this.skills = this.skills.filter(s => s !== skill);
    this.updatedAt = new Date();
  }

  updateProfile(updates) {
    const allowedFields = ['name', 'bio', 'skills', 'socialLinks', 'profileImage'];
    
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) {
        this[field] = updates[field];
      }
    });
    
    this.updatedAt = new Date();
  }

  toPublicProfile() {
    return {
      id: this.id,
      name: this.name,
      bio: this.bio,
      skills: this.skills,
      socialLinks: this.socialLinks,
      profileImage: this.profileImage,
      isVerified: this.isVerified,
      createdAt: this.createdAt
    };
  }
}

export default User;
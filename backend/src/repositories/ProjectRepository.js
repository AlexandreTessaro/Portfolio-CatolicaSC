import pool from '../config/database.js';
import Project from '../domain/Project.js';

export class ProjectRepository {
  async create(projectData) {
    const client = await pool.connect();
    try {
      const { title, description, objectives, technologies, status, category, creatorId, images } = projectData;
      
      const query = `
        INSERT INTO projects (title, description, objectives, technologies, status, category, creator_id, images, created_at, updated_at)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *
      `;
      
      const values = [
        title,
        description,
        JSON.stringify(objectives || []),
        JSON.stringify(technologies || []),
        status || 'idea',
        category || 'general',
        creatorId,
        JSON.stringify(images || []),
        new Date(),
        new Date()
      ];
      
      const result = await client.query(query, values);
      const project = result.rows[0];
      
      return new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      });
    } finally {
      client.release();
    }
  }

  async findById(id) {
    const client = await pool.connect();
    try {
      const query = 'SELECT * FROM projects WHERE id = $1';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const project = result.rows[0];
      return new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      });
    } finally {
      client.release();
    }
  }

  async findByCreatorId(creatorId, limit = 20, offset = 0) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM projects 
        WHERE creator_id = $1
        ORDER BY created_at DESC 
        LIMIT $2 OFFSET $3
      `;
      
      const result = await client.query(query, [creatorId, limit, offset]);
      
      return result.rows.map(project => new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async update(id, updates) {
    const client = await pool.connect();
    try {
      const allowedFields = ['title', 'description', 'objectives', 'technologies', 'status', 'category', 'images'];
      const setFields = [];
      const values = [];
      let paramCount = 1;
      
      allowedFields.forEach(field => {
        if (updates[field] !== undefined) {
          if (field === 'objectives' || field === 'technologies' || field === 'images') {
            setFields.push(`${field} = $${paramCount}::jsonb`);
          } else {
            setFields.push(`${field} = $${paramCount}`);
          }
          values.push(updates[field]);
          paramCount++;
        }
      });
      
      if (setFields.length === 0) {
        return null;
      }
      
      setFields.push(`updated_at = $${paramCount}`);
      values.push(new Date());
      values.push(id);
      
      const query = `
        UPDATE projects 
        SET ${setFields.join(', ')}
        WHERE id = $${paramCount + 1}
        RETURNING *
      `;
      
      const result = await client.query(query, values);
      
      if (result.rows.length === 0) {
        return null;
      }
      
      const project = result.rows[0];
      return new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      });
    } finally {
      client.release();
    }
  }

  async delete(id) {
    const client = await pool.connect();
    try {
      const query = 'DELETE FROM projects WHERE id = $1 RETURNING *';
      const result = await client.query(query, [id]);
      
      if (result.rows.length === 0) {
        return false;
      }
      
      return true;
    } finally {
      client.release();
    }
  }

  async findAll(limit = 50, offset = 0, filters = {}) {
    const client = await pool.connect();
    try {
      let query = 'SELECT * FROM projects WHERE 1=1';
      const values = [];
      let paramCount = 1;
      
      if (filters.status) {
        query += ` AND status = $${paramCount}`;
        values.push(filters.status);
        paramCount++;
      }
      
      if (filters.category) {
        query += ` AND category = $${paramCount}`;
        values.push(filters.category);
        paramCount++;
      }
      
      if (filters.technologies && filters.technologies.length > 0) {
        query += ` AND technologies @> $${paramCount}::jsonb`;
        values.push(JSON.stringify(filters.technologies));
        paramCount++;
      }
      
      query += ` ORDER BY created_at DESC LIMIT $${paramCount} OFFSET $${paramCount + 1}`;
      values.push(limit, offset);
      
      const result = await client.query(query, values);
      
      return result.rows.map(project => new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }));
    } finally {
      client.release();
    }
  }

  async searchByText(searchTerm, limit = 20) {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM projects 
        WHERE title ILIKE $1 OR description ILIKE $1
        ORDER BY created_at DESC 
        LIMIT $2
      `;
      
      const result = await client.query(query, [`%${searchTerm}%`, limit]);
      
      return result.rows.map(project => new Project({
        id: project.id,
        title: project.title,
        description: project.description,
        objectives: typeof project.objectives === 'string' ? JSON.parse(project.objectives) : project.objectives,
        technologies: typeof project.technologies === 'string' ? JSON.parse(project.technologies) : project.technologies,
        status: project.status,
        category: project.category,
        creatorId: project.creator_id,
        teamMembers: typeof project.team_members === 'string' ? JSON.parse(project.team_members) : (project.team_members || []),
        collaborators: project.collaborators || [],
        images: typeof project.images === 'string' ? JSON.parse(project.images) : project.images,
        createdAt: project.created_at,
        updatedAt: project.updated_at
      }));
    } finally {
      client.release();
    }
  }

  // Adicionar membro à equipe do projeto
  async addTeamMember(projectId, userId) {
    const client = await pool.connect();
    try {
      // Buscar o projeto atual
      const project = await this.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      // Verificar se o usuário já é membro da equipe
      const currentTeamMembers = project.teamMembers || [];
      if (currentTeamMembers.includes(userId)) {
        throw new Error('Usuário já é membro da equipe');
      }

      // Adicionar o usuário à equipe
      const updatedTeamMembers = [...currentTeamMembers, userId];
      
      const query = `
        UPDATE projects 
        SET team_members = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
      `;
      
      const result = await client.query(query, [
        JSON.stringify(updatedTeamMembers),
        new Date(),
        projectId
      ]);
      
      const updatedProject = result.rows[0];
      
      return new Project({
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description,
        objectives: typeof updatedProject.objectives === 'string' ? JSON.parse(updatedProject.objectives) : updatedProject.objectives,
        technologies: typeof updatedProject.technologies === 'string' ? JSON.parse(updatedProject.technologies) : updatedProject.technologies,
        status: updatedProject.status,
        category: updatedProject.category,
        creatorId: updatedProject.creator_id,
        teamMembers: updatedTeamMembers,
        collaborators: typeof updatedProject.collaborators === 'string' ? JSON.parse(updatedProject.collaborators) : updatedProject.collaborators,
        images: typeof updatedProject.images === 'string' ? JSON.parse(updatedProject.images) : updatedProject.images,
        createdAt: updatedProject.created_at,
        updatedAt: updatedProject.updated_at
      });
    } finally {
      client.release();
    }
  }

  // Remover membro da equipe do projeto
  async removeTeamMember(projectId, userId) {
    const client = await pool.connect();
    try {
      // Buscar o projeto atual
      const project = await this.findById(projectId);
      if (!project) {
        throw new Error('Projeto não encontrado');
      }

      // Remover o usuário da equipe
      const currentTeamMembers = project.teamMembers || [];
      const updatedTeamMembers = currentTeamMembers.filter(id => id !== userId);
      
      const query = `
        UPDATE projects 
        SET team_members = $1, updated_at = $2
        WHERE id = $3
        RETURNING *
      `;
      
      const result = await client.query(query, [
        JSON.stringify(updatedTeamMembers),
        new Date(),
        projectId
      ]);
      
      const updatedProject = result.rows[0];
      
      return new Project({
        id: updatedProject.id,
        title: updatedProject.title,
        description: updatedProject.description,
        objectives: typeof updatedProject.objectives === 'string' ? JSON.parse(updatedProject.objectives) : updatedProject.objectives,
        technologies: typeof updatedProject.technologies === 'string' ? JSON.parse(updatedProject.technologies) : updatedProject.technologies,
        status: updatedProject.status,
        category: updatedProject.category,
        creatorId: updatedProject.creator_id,
        teamMembers: updatedTeamMembers,
        collaborators: typeof updatedProject.collaborators === 'string' ? JSON.parse(updatedProject.collaborators) : updatedProject.collaborators,
        images: typeof updatedProject.images === 'string' ? JSON.parse(updatedProject.images) : updatedProject.images,
        createdAt: updatedProject.created_at,
        updatedAt: updatedProject.updated_at
      });
    } finally {
      client.release();
    }
  }
}

export default ProjectRepository;
import Match from '../domain/Match.js';

class MatchRepository {
  constructor(database) {
    this.db = database;
  }

  // Criar um novo match
  async create(matchData) {
    const query = `
      INSERT INTO matches (project_id, user_id, status, message, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    
    const values = [
      matchData.projectId,
      matchData.userId,
      matchData.status,
      matchData.message,
      matchData.createdAt,
      matchData.updatedAt
    ];

    try {
      const result = await this.db.query(query, values);
      const match = result.rows[0];
      return new Match({
        id: match.id,
        projectId: match.project_id,
        userId: match.user_id,
        status: match.status,
        message: match.message,
        createdAt: match.created_at,
        updatedAt: match.updated_at
      });
    } catch (error) {
      throw new Error(`Erro ao criar match: ${error.message}`);
    }
  }

  // Buscar match por ID
  async findById(id) {
    const query = `
      SELECT m.*, 
             p.id as project_id, p.title as project_title, p.description as project_description,
             p.status as project_status, p.technologies as project_technologies,
             p.creator_id as project_creator_id,
             u.id as user_id, u.name as user_name, u.email as user_email,
             u.bio as user_bio, u.skills as user_skills, u.profile_image as user_avatar
      FROM matches m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.id = $1
    `;

    try {
      const result = await this.db.query(query, [id]);
      if (result.rows.length === 0) {
        return null;
      }

      const row = result.rows[0];
      return new Match({
        id: row.id,
        projectId: row.project_id,
        userId: row.user_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        project: row.project_id ? {
          id: row.project_id,
          title: row.project_title,
          description: row.project_description,
          status: row.project_status,
          technologies: row.project_technologies,
          creatorId: row.project_creator_id
        } : null,
        user: row.user_id ? {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          bio: row.user_bio,
          skills: row.user_skills,
          avatar: row.user_avatar
        } : null
      });
    } catch (error) {
      throw new Error(`Erro ao buscar match: ${error.message}`);
    }
  }

  // Buscar matches por projeto
  async findByProjectId(projectId, status = null) {
    let query = `
      SELECT m.*, 
             p.id as project_id, p.title as project_title, p.description as project_description,
             p.status as project_status, p.technologies as project_technologies,
             p.creator_id as project_creator_id,
             u.id as user_id, u.name as user_name, u.email as user_email,
             u.bio as user_bio, u.skills as user_skills, u.profile_image as user_avatar
      FROM matches m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.project_id = $1
    `;
    
    const values = [projectId];
    
    if (status) {
      query += ' AND m.status = $2';
      values.push(status);
    }
    
    query += ' ORDER BY m.created_at DESC';

    try {
      const result = await this.db.query(query, values);
      return result.rows.map(row => new Match({
        id: row.id,
        projectId: row.project_id,
        userId: row.user_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        project: row.project_id ? {
          id: row.project_id,
          title: row.project_title,
          description: row.project_description,
          status: row.project_status,
          technologies: row.project_technologies,
          creatorId: row.project_creator_id
        } : null,
        user: row.user_id ? {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          bio: row.user_bio,
          skills: row.user_skills,
          avatar: row.user_avatar
        } : null
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar matches do projeto: ${error.message}`);
    }
  }

  // Buscar matches por usuário
  async findByUserId(userId, status = null) {
    let query = `
      SELECT m.*, 
             p.id as project_id, p.title as project_title, p.description as project_description,
             p.status as project_status, p.technologies as project_technologies,
             p.creator_id as project_creator_id,
             u.id as user_id, u.name as user_name, u.email as user_email,
             u.bio as user_bio, u.skills as user_skills, u.profile_image as user_avatar
      FROM matches m
      LEFT JOIN projects p ON m.project_id = p.id
      LEFT JOIN users u ON m.user_id = u.id
      WHERE m.user_id = $1
    `;
    
    const values = [userId];
    
    if (status) {
      query += ' AND m.status = $2';
      values.push(status);
    }
    
    query += ' ORDER BY m.created_at DESC';

    try {
      const result = await this.db.query(query, values);
      return result.rows.map(row => new Match({
        id: row.id,
        projectId: row.project_id,
        userId: row.user_id,
        status: row.status,
        message: row.message,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
        project: row.project_id ? {
          id: row.project_id,
          title: row.project_title,
          description: row.project_description,
          status: row.project_status,
          technologies: row.project_technologies,
          creatorId: row.project_creator_id
        } : null,
        user: row.user_id ? {
          id: row.user_id,
          name: row.user_name,
          email: row.user_email,
          bio: row.user_bio,
          skills: row.user_skills,
          avatar: row.user_avatar
        } : null
      }));
    } catch (error) {
      throw new Error(`Erro ao buscar matches do usuário: ${error.message}`);
    }
  }

  // Verificar se já existe match entre usuário e projeto
  async existsByUserAndProject(userId, projectId) {
    const query = `
      SELECT id FROM matches 
      WHERE user_id = $1 AND project_id = $2
    `;

    try {
      const result = await this.db.query(query, [userId, projectId]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao verificar match existente: ${error.message}`);
    }
  }

  // Atualizar status do match
  async updateStatus(id, status) {
    const query = `
      UPDATE matches 
      SET status = $1, updated_at = $2
      WHERE id = $3
      RETURNING *
    `;

    try {
      const result = await this.db.query(query, [status, new Date(), id]);
      if (result.rows.length === 0) {
        return null;
      }

      const match = result.rows[0];
      return new Match({
        id: match.id,
        projectId: match.project_id,
        userId: match.user_id,
        status: match.status,
        message: match.message,
        createdAt: match.created_at,
        updatedAt: match.updated_at
      });
    } catch (error) {
      throw new Error(`Erro ao atualizar status do match: ${error.message}`);
    }
  }

  // Deletar match
  async delete(id) {
    const query = 'DELETE FROM matches WHERE id = $1 RETURNING *';

    try {
      const result = await this.db.query(query, [id]);
      return result.rows.length > 0;
    } catch (error) {
      throw new Error(`Erro ao deletar match: ${error.message}`);
    }
  }

  // Contar matches por status
  async countByStatus(status) {
    const query = 'SELECT COUNT(*) as count FROM matches WHERE status = $1';

    try {
      const result = await this.db.query(query, [status]);
      return parseInt(result.rows[0].count);
    } catch (error) {
      throw new Error(`Erro ao contar matches: ${error.message}`);
    }
  }
}

export default MatchRepository;

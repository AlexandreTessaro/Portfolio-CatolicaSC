import pool from '../config/database.js';

export class RecommendationService {
  constructor() {
    this.pool = pool;
  }

  // Calcular porcentagem de recomendação baseada em matching de skills
  async calculateRecommendationScore(userId, projectId) {
    const client = await this.pool.connect();
    
    try {
      // Buscar skills do usuário
      const userResult = await client.query(
        'SELECT skills FROM users WHERE id = $1',
        [userId]
      );
      
      if (userResult.rows.length === 0) {
        return 0;
      }
      
      let userSkills = [];
      if (userResult.rows[0].skills) {
        try {
          userSkills = typeof userResult.rows[0].skills === 'string' 
            ? JSON.parse(userResult.rows[0].skills) 
            : userResult.rows[0].skills;
        } catch (error) {
          console.warn('Erro ao fazer parse das skills do usuário:', error);
          userSkills = [];
        }
      }
      
      // Buscar tecnologias do projeto
      const projectResult = await client.query(
        'SELECT technologies FROM projects WHERE id = $1',
        [projectId]
      );
      
      if (projectResult.rows.length === 0) {
        return 0;
      }
      
      let projectTechs = [];
      if (projectResult.rows[0].technologies) {
        try {
          projectTechs = typeof projectResult.rows[0].technologies === 'string' 
            ? JSON.parse(projectResult.rows[0].technologies) 
            : projectResult.rows[0].technologies;
        } catch (error) {
          console.warn('Erro ao fazer parse das tecnologias do projeto:', error);
          projectTechs = [];
        }
      }
      
      // Calcular matching
      const matchingSkills = userSkills.filter(skill => projectTechs.includes(skill));
      const matchPercentage = userSkills.length > 0 ? (matchingSkills.length / userSkills.length) * 100 : 0;
      
      // Buscar histórico de solicitações do usuário para projetos similares
      const historyResult = await client.query(`
        SELECT cr.status, p.technologies
        FROM collaboration_requests cr
        JOIN projects p ON cr.project_id = p.id
        WHERE cr.user_id = $1 AND cr.status = 'accepted'
      `, [userId]);
      
      let historyBonus = 0;
      if (historyResult.rows.length > 0) {
        // Calcular bonus baseado em projetos aceitos anteriormente
        const acceptedProjects = historyResult.rows;
        let similarProjects = 0;
        
        acceptedProjects.forEach(row => {
          try {
            const acceptedTechs = typeof row.technologies === 'string' 
              ? JSON.parse(row.technologies) 
              : row.technologies;
            const commonTechs = acceptedTechs.filter(tech => projectTechs.includes(tech));
            if (commonTechs.length > 0) {
              similarProjects++;
            }
          } catch (error) {
            console.warn('Erro ao fazer parse das tecnologias do projeto aceito:', error);
          }
        });
        
        historyBonus = (similarProjects / acceptedProjects.length) * 10; // Bonus de até 10%
      }
      
      // Buscar categoria do projeto para bonus adicional
      const categoryResult = await client.query(
        'SELECT category FROM projects WHERE id = $1',
        [projectId]
      );
      
      let categoryBonus = 0;
      if (categoryResult.rows.length > 0) {
        const projectCategory = categoryResult.rows[0].category;
        
        // Buscar projetos aceitos pelo usuário na mesma categoria
        const categoryHistoryResult = await client.query(`
          SELECT COUNT(*) as count
          FROM collaboration_requests cr
          JOIN projects p ON cr.project_id = p.id
          WHERE cr.user_id = $1 AND cr.status = 'accepted' AND p.category = $2
        `, [userId, projectCategory]);
        
        if (categoryHistoryResult.rows[0].count > 0) {
          categoryBonus = 5; // Bonus de 5% para categoria familiar
        }
      }
      
      // Calcular score final (máximo 100%)
      const finalScore = Math.min(100, matchPercentage + historyBonus + categoryBonus);
      
      return Math.round(finalScore);
      
    } catch (error) {
      console.error('Erro ao calcular score de recomendação:', error);
      return 0;
    } finally {
      client.release();
    }
  }

  // Calcular scores para múltiplos projetos
  async calculateRecommendationScores(userId, projectIds) {
    const scores = {};
    
    for (const projectId of projectIds) {
      scores[projectId] = await this.calculateRecommendationScore(userId, projectId);
    }
    
    return scores;
  }

  // Buscar projetos com scores de recomendação
  async getProjectsWithRecommendationScores(userId, limit = 50, offset = 0, filters = {}) {
    const client = await this.pool.connect();
    
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
      const projects = result.rows;
      
      // Calcular scores de recomendação para cada projeto
      const projectsWithScores = await Promise.all(
        projects.map(async (project) => {
          const score = await this.calculateRecommendationScore(userId, project.id);
          return {
            ...project,
            recommendationScore: score
          };
        })
      );
      
      // Ordenar por score de recomendação (maior primeiro)
      projectsWithScores.sort((a, b) => b.recommendationScore - a.recommendationScore);
      
      return projectsWithScores;
      
    } catch (error) {
      console.error('Erro ao buscar projetos com scores:', error);
      throw error;
    } finally {
      client.release();
    }
  }
}

export default RecommendationService;

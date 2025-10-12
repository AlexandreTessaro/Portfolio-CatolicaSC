import RecommendationService from '../services/RecommendationService.js';

export class RecommendationController {
  constructor() {
    this.recommendationService = new RecommendationService();
  }

  // Calcular score de recomendação para um projeto específico
  async getRecommendationScore(req, res) {
    try {
      const userId = req.user.userId;
      const { projectId } = req.params;
      
      const score = await this.recommendationService.calculateRecommendationScore(userId, projectId);
      
      res.status(200).json({
        success: true,
        data: {
          projectId: parseInt(projectId),
          userId,
          recommendationScore: score
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar projetos com scores de recomendação
  async getProjectsWithScores(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 50, offset = 0, status, category, technologies } = req.query;
      
      const filters = {};
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (technologies) filters.technologies = technologies.split(',');
      
      const projects = await this.recommendationService.getProjectsWithRecommendationScores(
        userId,
        parseInt(limit),
        parseInt(offset),
        filters
      );
      
      // Formatar dados para resposta
      const formattedProjects = projects.map(project => {
        const parseJsonField = (field) => {
          if (!field) return [];
          try {
            return typeof field === 'string' ? JSON.parse(field) : field;
          } catch (error) {
            console.warn('Erro ao fazer parse do campo JSON:', error);
            return [];
          }
        };

        return {
          id: project.id,
          title: project.title,
          description: project.description,
          objectives: parseJsonField(project.objectives),
          technologies: parseJsonField(project.technologies),
          status: project.status,
          category: project.category,
          creatorId: project.creator_id,
          teamMembers: parseJsonField(project.team_members),
          collaborators: project.collaborators || [],
          images: parseJsonField(project.images),
          createdAt: project.created_at,
          updatedAt: project.updated_at,
          recommendationScore: project.recommendationScore
        };
      });
      
      res.status(200).json({
        success: true,
        data: formattedProjects,
        count: formattedProjects.length,
        meta: {
          total: formattedProjects.length,
          limit: parseInt(limit),
          offset: parseInt(offset)
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Calcular scores para múltiplos projetos
  async getMultipleScores(req, res) {
    try {
      const userId = req.user.userId;
      const { projectIds } = req.body;
      
      if (!Array.isArray(projectIds)) {
        return res.status(400).json({
          success: false,
          message: 'projectIds deve ser um array'
        });
      }
      
      const scores = await this.recommendationService.calculateRecommendationScores(userId, projectIds);
      
      res.status(200).json({
        success: true,
        data: scores
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

export default RecommendationController;

import { ProjectService } from '../services/ProjectService.js';
import { body, validationResult } from 'express-validator';
import { logAudit } from '../utils/auditHelper.js';

export class ProjectController {
  constructor() {
    this.projectService = new ProjectService();
    
    // Bind methods to preserve 'this' context
    this.createProject = this.createProject.bind(this);
    this.getProject = this.getProject.bind(this);
    this.updateProject = this.updateProject.bind(this);
    this.deleteProject = this.deleteProject.bind(this);
    this.searchProjects = this.searchProjects.bind(this);
    this.searchProjectsByText = this.searchProjectsByText.bind(this);
    this.getUserProjects = this.getUserProjects.bind(this);
    this.addTeamMember = this.addTeamMember.bind(this);
    this.removeTeamMember = this.removeTeamMember.bind(this);
    this.getRecommendedProjects = this.getRecommendedProjects.bind(this);
  }

  // Validações para criação de projeto
  validateCreateProject() {
    return [
      body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Título deve ter entre 3 e 100 caracteres'),
      body('description').trim().isLength({ min: 10, max: 2000 }).withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
      body('objectives').optional().isArray().withMessage('Objetivos devem ser um array'),
      body('technologies').optional().isArray().withMessage('Tecnologias devem ser um array'),
      body('status').optional().isIn(['idea', 'planning', 'development', 'testing', 'launched']).withMessage('Status inválido'),
      body('category').optional().trim().isLength({ max: 50 }).withMessage('Categoria deve ter no máximo 50 caracteres'),
      body('images').optional().isArray().withMessage('Imagens devem ser um array')
    ];
  }

  // Validações para atualização de projeto
  validateUpdateProject() {
    return [
      body('title').optional().trim().isLength({ min: 3, max: 100 }).withMessage('Título deve ter entre 3 e 100 caracteres'),
      body('description').optional().trim().isLength({ min: 10, max: 2000 }).withMessage('Descrição deve ter entre 10 e 2000 caracteres'),
      body('objectives').optional().isArray().withMessage('Objetivos devem ser um array'),
      body('technologies').optional().isArray().withMessage('Tecnologias devem ser um array'),
      body('status').optional().isIn(['idea', 'planning', 'development', 'testing', 'launched']).withMessage('Status inválido'),
      body('category').optional().trim().isLength({ max: 50 }).withMessage('Categoria deve ter no máximo 50 caracteres'),
      body('images').optional().isArray().withMessage('Imagens devem ser um array')
    ];
  }

  // Criar projeto
  async createProject(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const creatorId = req.user.userId;
      const project = await this.projectService.createProject(req.body, creatorId);
      
      // Registrar log de auditoria de criação de projeto
      await logAudit(
        req,
        'project.create',
        'project',
        project.id,
        { title: project.title, creatorId }
      );
      
      res.status(201).json({
        success: true,
        message: 'Projeto criado com sucesso',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obter projeto por ID
  async getProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user ? req.user.userId : null;
      
      const project = await this.projectService.getProject(projectId, userId);
      
      res.status(200).json({
        success: true,
        data: project
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Atualizar projeto
  async updateProject(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { projectId } = req.params;
      const userId = req.user.userId;
      
      const project = await this.projectService.updateProject(projectId, req.body, userId);
      
      // Registrar log de auditoria de atualização de projeto
      await logAudit(
        req,
        'project.update',
        'project',
        parseInt(projectId, 10),
        { fieldsUpdated: Object.keys(req.body) }
      );
      
      res.status(200).json({
        success: true,
        message: 'Projeto atualizado com sucesso',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Deletar projeto
  async deleteProject(req, res) {
    try {
      const { projectId } = req.params;
      const userId = req.user.userId;
      
      const result = await this.projectService.deleteProject(projectId, userId);
      
      // Registrar log de auditoria de exclusão de projeto
      await logAudit(
        req,
        'project.delete',
        'project',
        parseInt(projectId, 10),
        { deletedBy: userId }
      );
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar projetos
  async searchProjects(req, res) {
    try {
      const { status, category, technologies, limit = 20, offset = 0 } = req.query;
      const filters = {};
      
      if (status) filters.status = status;
      if (category) filters.category = category;
      if (technologies) {
        filters.technologies = technologies.split(',').map(tech => tech.trim());
      }

      const projects = await this.projectService.searchProjects(filters, parseInt(limit), parseInt(offset));
      
      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: projects.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar projetos por texto
  async searchProjectsByText(req, res) {
    try {
      const { q, limit = 20 } = req.query;
      
      if (!q) {
        return res.status(400).json({
          success: false,
          message: 'Termo de busca é obrigatório'
        });
      }

      const projects = await this.projectService.searchProjectsByText(q, parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: projects,
        searchTerm: q,
        count: projects.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obter projetos do usuário
  async getUserProjects(req, res) {
    try {
      const { userId } = req.params;
      const { limit = 20, offset = 0 } = req.query;
      
      const projects = await this.projectService.getUserProjects(userId, parseInt(limit), parseInt(offset));
      
      res.status(200).json({
        success: true,
        data: projects,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: projects.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Adicionar membro da equipe
  async addTeamMember(req, res) {
    try {
      const { projectId } = req.params;
      const { memberId } = req.body;
      const userId = req.user.userId;
      
      if (!memberId) {
        return res.status(400).json({
          success: false,
          message: 'ID do membro é obrigatório'
        });
      }

      const project = await this.projectService.addTeamMember(projectId, userId, memberId);
      
      res.status(200).json({
        success: true,
        message: 'Membro adicionado à equipe com sucesso',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Remover membro da equipe
  async removeTeamMember(req, res) {
    try {
      const { projectId, memberId } = req.params;
      const userId = req.user.userId;
      
      const project = await this.projectService.removeTeamMember(projectId, userId, memberId);
      
      res.status(200).json({
        success: true,
        message: 'Membro removido da equipe com sucesso',
        data: project
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obter projetos recomendados
  async getRecommendedProjects(req, res) {
    try {
      const userId = req.user.userId;
      const { limit = 10 } = req.query;
      
      const projects = await this.projectService.getRecommendedProjects(userId, parseInt(limit));
      
      res.status(200).json({
        success: true,
        data: projects,
        count: projects.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

import { UserService } from '../services/UserService.js';
import { body, validationResult } from 'express-validator';

export class UserController {
  constructor() {
    this.userService = new UserService();

    // Garantir 'this' correto nos handlers
    this.register = this.register.bind(this);
    this.login = this.login.bind(this);
    this.refreshToken = this.refreshToken.bind(this);
    this.logout = this.logout.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.getPublicProfile = this.getPublicProfile.bind(this);
    this.updateProfile = this.updateProfile.bind(this);
    this.searchUsers = this.searchUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
  }

  // Validações para registro
  validateRegister() {
    return [
      body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
      body('password').isLength({ min: 6 }).withMessage('Senha deve ter pelo menos 6 caracteres'),
      body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('bio').optional().isLength({ max: 500 }).withMessage('Bio deve ter no máximo 500 caracteres'),
      body('skills').optional().isArray().withMessage('Habilidades devem ser um array'),
      body('socialLinks').optional().isObject().withMessage('Links sociais devem ser um objeto')
    ];
  }

  // Validações para login
  validateLogin() {
    return [
      body('email').isEmail().normalizeEmail().withMessage('Email inválido'),
      body('password').notEmpty().withMessage('Senha é obrigatória')
    ];
  }

  // Validações para atualização de perfil
  validateUpdateProfile() {
    return [
      body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Nome deve ter entre 2 e 100 caracteres'),
      body('bio').optional().isLength({ max: 500 }).withMessage('Bio deve ter no máximo 500 caracteres'),
      body('skills').optional().isArray().withMessage('Habilidades devem ser um array'),
      body('socialLinks').optional().isObject().withMessage('Links sociais devem ser um objeto')
    ];
  }

  // Registrar usuário
  async register(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const result = await this.userService.register(req.body);
      
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Login do usuário
  async login(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await this.userService.login(email, password);
      
      // Configurar refresh token como cookie HTTPOnly
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 dias
      });

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Renovar access token
  async refreshToken(req, res) {
    try {
      const { refreshToken } = req.cookies;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          message: 'Refresh token não fornecido'
        });
      }

      const result = await this.userService.refreshToken(refreshToken);
      
      res.status(200).json({
        success: true,
        message: 'Token renovado com sucesso',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  // Logout do usuário
  async logout(req, res) {
    try {
      // Limpar cookie do refresh token
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Erro ao fazer logout'
      });
    }
  }

  // Obter perfil do usuário autenticado
  async getProfile(req, res) {
    try {
      const userId = req.user.userId;
      const profile = await this.userService.getProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Obter perfil público de um usuário
  async getPublicProfile(req, res) {
    try {
      const { userId } = req.params;
      const profile = await this.userService.getPublicProfile(userId);
      
      res.status(200).json({
        success: true,
        data: profile
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }

  // Atualizar perfil do usuário
  async updateProfile(req, res) {
    try {
      // Verificar erros de validação
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          errors: errors.array()
        });
      }

      const userId = req.user.userId;
      const updatedProfile = await this.userService.updateProfile(userId, req.body);
      
      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedProfile
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  // Buscar usuários
  async searchUsers(req, res) {
    try {
      const { skills, limit = 20, offset = 0 } = req.query;
      const filters = {};
      
      if (skills) {
        filters.skills = skills.split(',').map(skill => skill.trim());
      }

      const users = await this.userService.searchUsers(filters, parseInt(limit), parseInt(offset));
      
      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: users.length
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  // Deletar usuário (apenas admin)
  async deleteUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await this.userService.deleteUser(userId);
      
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
}

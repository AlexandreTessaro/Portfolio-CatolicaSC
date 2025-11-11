import { UserService } from '../services/UserService.js';
import { body, validationResult } from 'express-validator';
import { logAudit } from '../utils/auditHelper.js';

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
    this.getRecommendedUsers = this.getRecommendedUsers.bind(this);
    this.deleteUser = this.deleteUser.bind(this);
    this.firebaseLogin = this.firebaseLogin.bind(this);
    this.forgetMe = this.forgetMe.bind(this);
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

      // Adicionar IP e User Agent para log de consentimento
      const userData = {
        ...req.body,
        ipAddress: req.ip || req.connection.remoteAddress,
        userAgent: req.get('user-agent')
      };

      const result = await this.userService.register(userData);
      
      res.status(201).json({
        success: true,
        message: 'Usuário registrado com sucesso',
        data: result
      });
    } catch (_error) {
      res.status(400).json({
        success: false,
        message: _error.message
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

      // Registrar log de auditoria de login
      await logAudit(
        { ...req, user: { userId: result.user.id } },
        'user.login',
        'user',
        result.user.id,
        { email: result.user.email }
      );

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (_error) {
      res.status(401).json({
        success: false,
        message: _error.message
      });
    }
  }

  // Renovar access token
  async refreshToken(req, res) {
    try {
      // Tentar obter refresh token do corpo da requisição primeiro, depois dos cookies
      const { refreshToken: bodyRefreshToken } = req.body;
      const cookieRefreshToken = req.cookies?.refreshToken;
      const refreshToken = bodyRefreshToken || cookieRefreshToken;
      
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
    } catch (_error) {
      res.status(401).json({
        success: false,
        message: _error.message
      });
    }
  }

  // Logout do usuário
  async logout(req, res) {
    try {
      const userId = req.user?.userId;
      
      // Limpar cookie do refresh token
      res.clearCookie('refreshToken');
      
      // Registrar log de auditoria de logout
      if (userId) {
        await logAudit(req, 'user.logout', 'user', userId);
      }
      
      res.status(200).json({
        success: true,
        message: 'Logout realizado com sucesso'
      });
    } catch (_error) { // eslint-disable-line no-unused-vars
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
    } catch (_error) {
      res.status(404).json({
        success: false,
        message: _error.message
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
    } catch (_error) {
      res.status(404).json({
        success: false,
        message: _error.message
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
      
      // Registrar log de auditoria de atualização de perfil
      await logAudit(
        req,
        'user.profile.update',
        'user',
        userId,
        { fieldsUpdated: Object.keys(req.body) }
      );
      
      res.status(200).json({
        success: true,
        message: 'Perfil atualizado com sucesso',
        data: updatedProfile
      });
    } catch (_error) {
      res.status(400).json({
        success: false,
        message: _error.message
      });
    }
  }

  // Buscar usuários
  async searchUsers(req, res) {
    try {
      const { skills, search, sortBy, limit = 20, offset = 0 } = req.query;
      const filters = {};
      
      // Filtro por nome (busca)
      if (search && search.trim()) {
        filters.name = search.trim();
      }
      
      // Filtro por habilidades
      if (skills && skills.trim()) {
        filters.skills = skills.split(',').map(skill => skill.trim()).filter(skill => skill);
      }

      // Ordenação
      if (sortBy) {
        filters.sortBy = sortBy;
      }

      // Obter ID do usuário atual se autenticado
      const excludeUserId = req.user ? req.user.userId : null;

      const users = await this.userService.searchUsers(filters, parseInt(limit), parseInt(offset), excludeUserId);
      
      res.status(200).json({
        success: true,
        data: users,
        pagination: {
          limit: parseInt(limit),
          offset: parseInt(offset),
          count: users.length
        }
      });
    } catch (_error) {
      res.status(500).json({
        success: false,
        message: _error.message
      });
    }
  }

  // Obter usuários recomendados
  async getRecommendedUsers(req, res) {
    try {
      const { limit = 4 } = req.query;
      
      // Obter ID do usuário atual se autenticado
      const excludeUserId = req.user ? req.user.userId : null;
      
      const users = await this.userService.getRecommendedUsers(parseInt(limit), excludeUserId);
      
      res.status(200).json({
        success: true,
        data: users,
        count: users.length
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
      const adminId = req.user?.userId;
      const result = await this.userService.deleteUser(userId);
      
      // Registrar log de auditoria de exclusão de usuário (ação administrativa)
      await logAudit(
        req,
        'admin.user.delete',
        'user',
        parseInt(userId, 10),
        { deletedBy: adminId }
      );
      
      res.status(200).json({
        success: true,
        message: result.message
      });
    } catch (_error) {
      res.status(400).json({
        success: false,
        message: _error.message
      });
    }
  }

  // Login com Firebase (COMENTADO - OAuth deixado para depois)
  async firebaseLogin(req, res) {
    return res.status(503).json({
      success: false,
      message: 'Login com Firebase está temporariamente desabilitado. OAuth será implementado posteriormente.'
    });
    /* COMENTADO
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: 'Token do Firebase é obrigatório'
        });
      }

      const result = await this.userService.loginWithFirebase(idToken);

      res.status(200).json({
        success: true,
        message: 'Login realizado com sucesso',
        data: result
      });
    } catch (_error) {
      res.status(401).json({
        success: false,
        message: _error.message
      });
    }
    */
  }

  // Direito ao esquecimento (LGPD)
  async forgetMe(req, res) {
    try {
      const userId = req.user?.userId;
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Usuário não autenticado'
        });
      }

      const result = await this.userService.forgetMe(userId);

      // Registrar log de auditoria de direito ao esquecimento (LGPD)
      await logAudit(
        req,
        'user.forget_me',
        'user',
        userId,
        { lgpd: true, anonymized: true }
      );

      res.status(200).json({
        success: true,
        message: result.message,
        data: result
      });
    } catch (_error) {
      res.status(400).json({
        success: false,
        message: _error.message
      });
    }
  }
}

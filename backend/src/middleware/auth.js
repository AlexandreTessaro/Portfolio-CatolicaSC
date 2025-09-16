import { verifyAccessToken } from '../config/jwt.js';

export const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token de acesso não fornecido'
      });
    }

    try {
      const decoded = verifyAccessToken(token);
      req.user = decoded;
      next();
    } catch (_error) { // eslint-disable-line no-unused-vars
      return res.status(403).json({
        success: false,
        message: 'Token inválido ou expirado'
      });
    }
  } catch (_error) { // eslint-disable-line no-unused-vars
    return res.status(500).json({
      success: false,
      message: 'Erro na autenticação'
    });
  }
};

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const decoded = verifyAccessToken(token);
        req.user = decoded;
      } catch (_error) { // eslint-disable-line no-unused-vars
        // Token inválido, mas não é obrigatório
        req.user = null;
      }
    } else {
      req.user = null;
    }

    next();
  } catch (_error) { // eslint-disable-line no-unused-vars
    req.user = null;
    next();
  }
};

export const requireAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticação necessária'
      });
    }

    if (!req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Acesso negado. Apenas administradores podem acessar este recurso'
      });
    }

    next();
  } catch (_error) { // eslint-disable-line no-unused-vars
    return res.status(500).json({
      success: false,
      message: 'Erro na verificação de permissões'
    });
  }
};

export default authenticateToken;
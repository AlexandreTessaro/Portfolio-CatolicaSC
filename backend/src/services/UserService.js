import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt.js';
import { User } from '../domain/User.js';

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData) {
    try {
      // Validar dados de entrada
      const user = new User(userData);
      const validationErrors = user.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Verificar se o email já existe
      const existingUser = await this.userRepository.findByEmail(userData.email);
      if (existingUser) {
        throw new Error('Email já está em uso');
      }

      // Criptografar senha
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(userData.password, saltRounds);

      // Criar usuário com senha criptografada
      const newUser = await this.userRepository.create({
        ...userData,
        password: hashedPassword
      });

      // Gerar tokens
      const accessToken = generateAccessToken({ userId: newUser.id, email: newUser.email });
      const refreshToken = generateRefreshToken({ userId: newUser.id, email: newUser.email });

      return {
        user: newUser.toPublicProfile(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new Error(`Erro ao registrar usuário: ${error.message}`);
    }
  }

  async login(email, password) {
    try {
      // Buscar usuário por email
      const user = await this.userRepository.findByEmail(email);
      if (!user) {
        throw new Error('Credenciais inválidas');
      }

      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Credenciais inválidas');
      }

      // Gerar tokens
      const accessToken = generateAccessToken({ userId: user.id, email: user.email });
      const refreshToken = generateRefreshToken({ userId: user.id, email: user.email });

      return {
        user: user.toPublicProfile(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login: ${error.message}`);
    }
  }

  async refreshToken(refreshToken) {
    try {
      // Verificar refresh token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Buscar usuário
      const user = await this.userRepository.findById(decoded.userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Gerar novo access token
      const newAccessToken = generateAccessToken({ userId: user.id, email: user.email });

      return {
        accessToken: newAccessToken,
        user: user.toPublicProfile()
      };
    } catch (error) {
      throw new Error(`Erro ao renovar token: ${error.message}`);
    }
  }

  async updateProfile(userId, updates) {
    try {
      // Validar dados de atualização específicos
      const validationErrors = [];
      
      if (updates.name && updates.name.trim().length < 2) {
        validationErrors.push('Nome deve ter pelo menos 2 caracteres');
      }
      
      if (updates.bio && updates.bio.length > 500) {
        validationErrors.push('Bio deve ter no máximo 500 caracteres');
      }
      
      if (updates.skills && updates.skills.length > 20) {
        validationErrors.push('Máximo de 20 habilidades permitidas');
      }
      
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Atualizar usuário
      const updatedUser = await this.userRepository.update(userId, updates);
      if (!updatedUser) {
        throw new Error('Usuário não encontrado');
      }

      return updatedUser.toPublicProfile();
    } catch (error) {
      throw new Error(`Erro ao atualizar perfil: ${error.message}`);
    }
  }

  async getProfile(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toPublicProfile();
    } catch (error) {
      throw new Error(`Erro ao buscar perfil: ${error.message}`);
    }
  }

  async getPublicProfile(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      return user.toPublicProfile();
    } catch (error) {
      throw new Error(`Erro ao buscar perfil público: ${error.message}`);
    }
  }

  async searchUsers(filters = {}, limit = 20, offset = 0) {
    try {
      let users = [];
      
      if (filters.skills && filters.skills.length > 0) {
        users = await this.userRepository.findBySkills(filters.skills, limit);
      } else {
        users = await this.userRepository.findAll(limit, offset);
      }

      return users.map(user => user.toPublicProfile());
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  async deleteUser(userId) {
    try {
      const deleted = await this.userRepository.delete(userId);
      if (!deleted) {
        throw new Error('Usuário não encontrado');
      }

      return { message: 'Usuário deletado com sucesso' };
    } catch (error) {
      throw new Error(`Erro ao deletar usuário: ${error.message}`);
    }
  }
}

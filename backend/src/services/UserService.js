import bcrypt from 'bcryptjs';
import { UserRepository } from '../repositories/UserRepository.js';
import { ConsentRepository } from '../repositories/ConsentRepository.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../config/jwt.js';
import { User } from '../domain/User.js';
// import { verifyFirebaseToken } from '../config/firebase.js'; // COMENTADO - OAuth deixado para depois

export class UserService {
  constructor() {
    this.userRepository = new UserRepository();
    this.consentRepository = new ConsentRepository();
  }

  async register(userData) {
    try {
      // Validar dados de entrada
      const user = new User(userData);
      const validationErrors = user.validate();
      
      if (validationErrors.length > 0) {
        throw new Error(`Erro de validação: ${validationErrors.join(', ')}`);
      }

      // Verificar consentimento LGPD
      if (!userData.consentAccepted) {
        throw new Error('Consentimento com os termos e política de privacidade é obrigatório');
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
        password: hashedPassword,
        consentAccepted: true,
        consentTimestamp: userData.consentTimestamp || new Date()
      });

      // Registrar consentimento LGPD
      await this.consentRepository.createConsent(newUser.id, {
        consentType: 'privacy_policy',
        consentVersion: '1.0',
        accepted: true,
        ipAddress: userData.ipAddress || null,
        userAgent: userData.userAgent || null
      });

      // Gerar tokens
      const accessToken = generateAccessToken({ userId: parseInt(newUser.id), email: newUser.email });
      const refreshToken = generateRefreshToken({ userId: parseInt(newUser.id), email: newUser.email });

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
      const accessToken = generateAccessToken({ userId: parseInt(user.id), email: user.email });
      const refreshToken = generateRefreshToken({ userId: parseInt(user.id), email: user.email });

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
      const newAccessToken = generateAccessToken({ userId: parseInt(user.id), email: user.email });

      return {
        accessToken: newAccessToken,
        user: user.toPublicProfile()
      };
    } catch (error) {
      throw new Error(`Erro ao renovar token: ${error.message}`);
    }
  }

  // COMENTADO - OAuth deixado para depois
  async loginWithFirebase(idToken) {
    throw new Error('Login com Firebase está temporariamente desabilitado. OAuth será implementado posteriormente.');
    /* COMENTADO
    try {
      // Verificar token do Firebase
      const firebaseUser = await verifyFirebaseToken(idToken);

      // Extrair informações do usuário
      const email = firebaseUser.email;
      const name = firebaseUser.name || firebaseUser.display_name || firebaseUser.displayName || 'Usuário';
      const photoURL = firebaseUser.picture || firebaseUser.photo_url || firebaseUser.photoURL || null;
      const firebaseId = firebaseUser.uid;
      const emailVerified = firebaseUser.email_verified || firebaseUser.emailVerified || false;
      
      // Detectar provedor usado (firebase.sign_in_provider está no token)
      const provider = firebaseUser.firebase?.sign_in_provider || 
                      (firebaseUser.iss?.includes('google') ? 'google.com' : null) ||
                      'unknown';

      if (!email) {
        throw new Error('Email não disponível no token do Firebase');
      }

      // Buscar usuário existente
      let user = await this.userRepository.findByEmail(email);

      if (!user) {
        // Criar novo usuário
        const randomPassword = await bcrypt.hash(
          Math.random().toString(36).slice(-12) + Date.now().toString(),
          12
        );

        const socialLinks = {};
        if (provider === 'google.com') {
          socialLinks.google = firebaseId;
        } else if (provider === 'github.com') {
          // GitHub pode ter provider_id diferente
          const githubId = firebaseUser.firebase?.identities?.['github.com']?.[0] || firebaseId;
          socialLinks.github = githubId;
        } else if (provider === 'linkedin.com') {
          socialLinks.linkedin = firebaseId;
        }

        user = await this.userRepository.create({
          email,
          name,
          password: randomPassword, // Senha aleatória, não será usada
          bio: null,
          skills: [],
          socialLinks,
          profileImage: photoURL,
          isVerified: emailVerified
        });
      } else {
        // Atualizar informações se necessário
        const socialLinks = user.socialLinks || {};
        
        if (provider === 'google.com' && !socialLinks.google) {
          socialLinks.google = firebaseId;
        } else if (provider === 'github.com' && !socialLinks.github) {
          const githubId = firebaseUser.firebase?.identities?.['github.com']?.[0] || firebaseId;
          socialLinks.github = githubId;
        } else if (provider === 'linkedin.com' && !socialLinks.linkedin) {
          socialLinks.linkedin = firebaseId;
        }

        // Atualizar foto se não tiver
        if (!user.profileImage && photoURL) {
          await this.userRepository.update(user.id, {
            socialLinks,
            profileImage: photoURL
          });
        } else if (Object.keys(socialLinks).length > Object.keys(user.socialLinks || {}).length) {
          await this.userRepository.update(user.id, { socialLinks });
        }
      }

      // Gerar tokens JWT
      const accessToken = generateAccessToken({ userId: parseInt(user.id), email: user.email });
      const refreshToken = generateRefreshToken({ userId: parseInt(user.id), email: user.email });

      return {
        user: user.toPublicProfile(),
        accessToken,
        refreshToken
      };
    } catch (error) {
      throw new Error(`Erro ao fazer login com Firebase: ${error.message}`);
    }
    */
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
      
      // Validar imagem base64
      if (updates.profileImage) {
        if (!updates.profileImage.startsWith('data:image/')) {
          validationErrors.push('Formato de imagem inválido');
        } else {
          // Verificar tamanho da string base64 (aproximadamente 1.33x o tamanho original)
          const base64Size = updates.profileImage.length;
          const maxBase64Size = 3 * 1024 * 1024; // 3MB em base64 ≈ 2MB original
          if (base64Size > maxBase64Size) {
            validationErrors.push('Imagem muito grande (máximo 2MB)');
          }
        }
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

  async searchUsers(filters = {}, limit = 20, offset = 0, excludeUserId = null) {
    try {
      // Adicionar exclusão do usuário atual se fornecido
      if (excludeUserId) {
        filters.excludeUserId = excludeUserId;
      }
      
      const users = await this.userRepository.searchUsers(filters, limit, offset);
      return users.map(user => user.toPublicProfile());
    } catch (error) {
      throw new Error(`Erro ao buscar usuários: ${error.message}`);
    }
  }

  async getRecommendedUsers(limit = 4, excludeUserId = null) {
    try {
      // Buscar usuários mais recentes com habilidades, excluindo o usuário atual
      const users = await this.userRepository.findRecommendedUsers(limit, excludeUserId);
      return users.map(user => user.toPublicProfile());
    } catch (error) {
      throw new Error(`Erro ao buscar usuários recomendados: ${error.message}`);
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

  /**
   * Direito ao esquecimento (LGPD)
   * Anonimiza ou exclui dados pessoais do usuário
   */
  async forgetMe(userId) {
    try {
      const user = await this.userRepository.findById(userId);
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Anonimizar dados pessoais
      const anonymizedData = {
        email: `deleted_${userId}_${Date.now()}@deleted.local`,
        name: 'Usuário Excluído',
        bio: null,
        profileImage: null,
        socialLinks: {}
      };

      // Atualizar usuário com dados anonimizados
      await this.userRepository.update(userId, anonymizedData);

      // Revogar todos os consentimentos
      await this.consentRepository.revokeConsent(userId, 'privacy_policy');

      // Excluir ou anonimizar dados relacionados
      // (projetos, matches, mensagens podem ser mantidos anonimizados para estatísticas)

      return { 
        message: 'Seus dados pessoais foram anonimizados conforme solicitado. Alguns dados podem ser mantidos anonimizados para fins estatísticos e legais.',
        anonymized: true
      };
    } catch (error) {
      throw new Error(`Erro ao processar direito ao esquecimento: ${error.message}`);
    }
  }
}

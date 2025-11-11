// COMENTADO - OAuth deixado para depois
// Este arquivo será usado quando implementarmos OAuth com Firebase

/* COMENTADO
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, linkedinProvider } from '../config/firebase.js';
import { userService } from './apiService.js';

/**
 * Serviço de autenticação Firebase
 */
export const firebaseAuthService = {
  /**
   * Login com Google
   */
  async signInWithGoogle() {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Obter token ID do Firebase
      const idToken = await user.getIdToken();
      
      // Enviar token para o backend
      const response = await userService.loginWithFirebase(idToken);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      throw new Error(error.message || 'Erro ao fazer login com Google');
    }
  },

  /**
   * Login com GitHub
   */
  async signInWithGitHub() {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      
      // Obter token ID do Firebase
      const idToken = await user.getIdToken();
      
      // Enviar token para o backend
      const response = await userService.loginWithFirebase(idToken);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com GitHub:', error);
      throw new Error(error.message || 'Erro ao fazer login com GitHub');
    }
  },

  /**
   * Login com LinkedIn
   */
  async signInWithLinkedIn() {
    try {
      const result = await signInWithPopup(auth, linkedinProvider);
      const user = result.user;
      
      // Obter token ID do Firebase
      const idToken = await user.getIdToken();
      
      // Enviar token para o backend
      const response = await userService.loginWithFirebase(idToken);
      return response.data;
    } catch (error) {
      console.error('Erro ao fazer login com LinkedIn:', error);
      throw new Error(error.message || 'Erro ao fazer login com LinkedIn');
    }
  },

  /**
   * Logout
   */
  async signOut() {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      throw error;
    }
  },

  /**
   * Observar mudanças no estado de autenticação
   */
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback);
  }
};
*/

// Placeholder para evitar erros de importação
export const firebaseAuthService = {
  async signInWithGoogle() {
    throw new Error('Login social temporariamente desabilitado');
  },
  async signInWithGitHub() {
    throw new Error('Login social temporariamente desabilitado');
  },
  async signInWithLinkedIn() {
    throw new Error('Login social temporariamente desabilitado');
  },
  async signOut() {
    throw new Error('Logout temporariamente desabilitado');
  },
  onAuthStateChanged() {
    return () => {};
  }
};

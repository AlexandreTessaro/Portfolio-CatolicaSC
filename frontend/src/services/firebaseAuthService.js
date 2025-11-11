// COMENTADO - OAuth deixado para depois
// Este arquivo será usado quando implementarmos OAuth com Firebase

/*
COMENTADO - Código Firebase será implementado depois
import {
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, linkedinProvider } from '../config/firebase.js';
import { userService } from './apiService.js';

export const firebaseAuthService = {
  async signInWithGoogle() {
    // ... código comentado
  },
  // ... resto do código comentado
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

import admin from 'firebase-admin';

// Inicializar Firebase Admin SDK
let firebaseAdmin = null;

if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    // Se tiver credenciais como JSON string (comum em produção)
    if (process.env.FIREBASE_SERVICE_ACCOUNT) {
      const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    } else {
      // Ou usar variáveis individuais
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL
        })
      });
    }
    console.log('✅ Firebase Admin inicializado');
  } catch (error) {
    console.warn('⚠️ Firebase Admin não configurado:', error.message);
  }
} else {
  console.warn('⚠️ Firebase Admin não configurado - variáveis de ambiente faltando');
}

export default firebaseAdmin;

/**
 * Verificar token do Firebase
 */
export async function verifyFirebaseToken(idToken) {
  if (!firebaseAdmin) {
    throw new Error('Firebase Admin não está configurado');
  }

  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Token inválido: ${error.message}`);
  }
}


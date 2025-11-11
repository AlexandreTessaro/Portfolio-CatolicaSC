# 🔥 Guia de Configuração Firebase Authentication

Este guia explica como configurar Firebase Authentication para login social de forma **muito mais fácil** que Passport.js.

## 🎯 Por que Firebase Auth?

✅ **Muito mais simples** - Não precisa configurar OAuth apps manualmente  
✅ **Gerenciado pelo Google** - Firebase cuida de tudo  
✅ **Gratuito** - Plano generoso para começar  
✅ **Suporta Google, GitHub, LinkedIn** e muitos outros  
✅ **Seguro** - Infraestrutura do Google  

---

## 📋 Passo 1: Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com/)
2. Clique em **Add project** (ou **Criar projeto**)
3. Preencha:
   - **Nome do projeto**: Startup Collab
   - **Google Analytics**: Opcional (pode desabilitar)
4. Clique em **Create project**

---

## 🔐 Passo 2: Habilitar Authentication

1. No projeto Firebase, vá para **Authentication** (Build → Authentication)
2. Clique em **Get started**
3. Vá para a aba **Sign-in method**
4. Habilite os provedores que deseja:

### Google
- Clique em **Google**
- Ative o toggle
- Selecione o email de suporte
- Salve

### GitHub
- Clique em **GitHub**
- Ative o toggle
- Você precisará criar um OAuth App no GitHub (veja abaixo)
- Copie **Client ID** e **Client Secret** do GitHub
- Cole no Firebase
- Salve

### LinkedIn
- Clique em **LinkedIn**
- Ative o toggle
- Você precisará criar um app no LinkedIn (veja abaixo)
- Copie **Client ID** e **Client Secret** do LinkedIn
- Cole no Firebase
- Salve

---

## 🔑 Passo 3: Obter Credenciais do Firebase

### Para Frontend (Web App)

1. No Firebase Console, vá para **Project Settings** (ícone de engrenagem)
2. Role até **Your apps**
3. Clique no ícone **Web** (`</>`)
4. Registre o app:
   - **App nickname**: Startup Collab Web
   - **Firebase Hosting**: Não (por enquanto)
5. Copie as credenciais que aparecem:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Para Backend (Service Account)

1. No Firebase Console, vá para **Project Settings**
2. Vá para a aba **Service accounts**
3. Clique em **Generate new private key**
4. Baixe o arquivo JSON (ex: `firebase-service-account.json`)
5. **IMPORTANTE**: Nunca commite este arquivo no Git!

---

## ⚙️ Passo 4: Configurar Variáveis de Ambiente

### Frontend (`.env`)

Crie `frontend/.env`:

```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Backend (`.env`)

Crie `backend/.env` e adicione:

**Opção 1: JSON completo (Recomendado)**

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_SERVICE_ACCOUNT={"type":"service_account","project_id":"...","private_key_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n","client_email":"...","client_id":"...","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_x509_cert_url":"..."}
```

**Opção 2: Variáveis individuais**

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

> **Dica**: Para obter o JSON completo, abra o arquivo `firebase-service-account.json` baixado e copie todo o conteúdo como uma string JSON.

---

## 🐙 Configurar GitHub OAuth (Opcional)

Se quiser usar GitHub via Firebase:

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em **OAuth Apps** → **New OAuth App**
3. Preencha:
   - **Application name**: Startup Collab
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copie **Client ID** e gere **Client Secret**
5. Cole no Firebase Authentication → Sign-in method → GitHub

---

## 💼 Configurar LinkedIn OAuth (Opcional)

Se quiser usar LinkedIn via Firebase:

1. Acesse [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Crie um novo app
3. Configure:
   - **Redirect URLs**: `https://your-project.firebaseapp.com/__/auth/handler`
4. Copie **Client ID** e **Client Secret**
5. Cole no Firebase Authentication → Sign-in method → LinkedIn

---

## 🧪 Testando

### 1. Instalar Dependências

```bash
# Frontend
cd frontend
npm install

# Backend
cd backend
npm install
```

### 2. Configurar Variáveis de Ambiente

- Copie `frontend/env.example` para `frontend/.env` e preencha com credenciais Firebase
- Copie `backend/env.example` para `backend/.env` e preencha com Service Account

### 3. Iniciar Aplicação

```bash
# Backend
cd backend
npm run dev

# Frontend (outro terminal)
cd frontend
npm run dev
```

### 4. Testar Login Social

1. Acesse `http://localhost:3000/login`
2. Clique em "Continuar com Google" (ou GitHub/LinkedIn)
3. Autorize a aplicação
4. Você será autenticado automaticamente!

---

## 🔒 Segurança

### ✅ Boas Práticas

1. **Nunca commite** o arquivo `firebase-service-account.json`
2. Use variáveis de ambiente para todas as credenciais
3. Em produção, use HTTPS
4. Configure **Authorized domains** no Firebase:
   - Vá para Authentication → Settings → Authorized domains
   - Adicione apenas seus domínios de produção

### 🚨 Importante

- O arquivo `firebase-service-account.json` contém credenciais sensíveis
- Adicione ao `.gitignore`:
  ```
  firebase-service-account.json
  *.json
  ```
- Em produção, use variáveis de ambiente ou AWS Secrets Manager

---

## 📊 Comparação: Firebase vs Passport.js

| Aspecto | Firebase Auth | Passport.js |
|---------|---------------|-------------|
| **Configuração** | ⭐⭐⭐⭐⭐ Muito fácil | ⭐⭐ Complexa |
| **Manutenção** | ⭐⭐⭐⭐⭐ Gerenciado | ⭐⭐⭐ Manual |
| **Custo** | ⭐⭐⭐⭐⭐ Gratuito (até 50k MAU) | ⭐⭐⭐⭐⭐ Gratuito |
| **Provedores** | ⭐⭐⭐⭐ Muitos (Google, GitHub, etc) | ⭐⭐⭐⭐⭐ Qualquer |
| **Customização** | ⭐⭐⭐ Boa | ⭐⭐⭐⭐⭐ Total |

**Conclusão**: Firebase é **muito mais fácil** para começar! 🎉

---

## 🐛 Troubleshooting

### Erro: "Firebase Admin não está configurado"

- Verifique se `FIREBASE_SERVICE_ACCOUNT` ou `FIREBASE_PRIVATE_KEY` estão configurados
- Certifique-se de que o JSON está correto (sem quebras de linha extras)

### Erro: "Token inválido"

- Verifique se o Firebase está configurado no frontend
- Certifique-se de que os domínios autorizados estão corretos

### Login não funciona

- Verifique o console do navegador para erros
- Verifique os logs do backend
- Certifique-se de que o provedor está habilitado no Firebase Console

---

## 📚 Recursos

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [Firebase Admin SDK](https://firebase.google.com/docs/admin/setup)
- [Firebase Console](https://console.firebase.google.com/)

---

## ✅ Checklist

- [ ] Projeto Firebase criado
- [ ] Authentication habilitado
- [ ] Provedores OAuth habilitados (Google, GitHub, LinkedIn)
- [ ] Credenciais do frontend configuradas
- [ ] Service Account configurado no backend
- [ ] Variáveis de ambiente configuradas
- [ ] Login social testado
- [ ] Credenciais não commitadas no Git

---

**✅ Firebase Authentication configurado! Muito mais fácil que Passport.js!** 🚀


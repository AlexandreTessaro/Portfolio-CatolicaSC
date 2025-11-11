# 🔐 Guia de Configuração OAuth 2.0

Este guia explica como configurar OAuth 2.0 com Google, GitHub e LinkedIn para a aplicação Startup Collab.

## 📋 Pré-requisitos

1. Contas ativas nos provedores OAuth (Google, GitHub, LinkedIn)
2. Acesso às configurações de desenvolvedor de cada plataforma
3. URL do backend configurada (ex: `http://localhost:5000` ou produção)

---

## 🔵 Google OAuth 2.0

### 1. Criar Projeto no Google Cloud Console

1. Acesse [Google Cloud Console](https://console.cloud.google.com/)
2. Crie um novo projeto ou selecione um existente
3. Vá para **APIs & Services** → **Credentials**

### 2. Configurar OAuth Consent Screen

1. Vá para **OAuth consent screen**
2. Escolha **External** (para desenvolvimento) ou **Internal** (para G Suite)
3. Preencha:
   - **App name**: Startup Collab
   - **User support email**: seu email
   - **Developer contact**: seu email
4. Adicione escopos:
   - `profile`
   - `email`
5. Salve e continue

### 3. Criar Credenciais OAuth

1. Vá para **Credentials** → **Create Credentials** → **OAuth client ID**
2. Escolha **Web application**
3. Configure:
   - **Name**: Startup Collab Web Client
   - **Authorized JavaScript origins**:
     - `http://localhost:5000` (desenvolvimento)
     - `https://seu-dominio.com` (produção)
   - **Authorized redirect URIs**:
     - `http://localhost:5000/api/auth/google/callback` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/google/callback` (produção)
4. Copie o **Client ID** e **Client Secret**

### 4. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env` do backend:

```env
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
```

---

## 🐙 GitHub OAuth 2.0

### 1. Criar OAuth App no GitHub

1. Acesse [GitHub Developer Settings](https://github.com/settings/developers)
2. Clique em **OAuth Apps** → **New OAuth App**
3. Preencha:
   - **Application name**: Startup Collab
   - **Homepage URL**: `http://localhost:3000` (ou URL de produção)
   - **Authorization callback URL**: 
     - `http://localhost:5000/api/auth/github/callback` (desenvolvimento)
     - `https://seu-dominio.com/api/auth/github/callback` (produção)
4. Clique em **Register application**
5. Copie o **Client ID** e gere um **Client Secret**

### 2. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env` do backend:

```env
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback
```

---

## 💼 LinkedIn OAuth 2.0

### 1. Criar App no LinkedIn

1. Acesse [LinkedIn Developers](https://www.linkedin.com/developers/)
2. Clique em **Create app**
3. Preencha:
   - **App name**: Startup Collab
   - **LinkedIn Page**: (crie ou selecione uma página)
   - **Privacy policy URL**: `https://seu-dominio.com/privacy`
   - **App logo**: (opcional)
4. Aceite os termos e crie o app

### 2. Configurar Produtos OAuth

1. Na página do app, vá para **Products**
2. Adicione o produto **Sign In with LinkedIn using OpenID Connect**
3. Vá para **Auth** → **Redirect URLs**
4. Adicione:
   - `http://localhost:5000/api/auth/linkedin/callback` (desenvolvimento)
   - `https://seu-dominio.com/api/auth/linkedin/callback` (produção)

### 3. Obter Credenciais

1. Vá para **Auth** → **Authentication**
2. Copie o **Client ID** e **Client Secret**

### 4. Configurar Variáveis de Ambiente

Adicione ao arquivo `.env` do backend:

```env
LINKEDIN_CLIENT_ID=seu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=seu-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback
```

---

## ⚙️ Configuração Completa

### Arquivo `.env` do Backend

```env
# OAuth Google
GOOGLE_CLIENT_ID=seu-google-client-id
GOOGLE_CLIENT_SECRET=seu-google-client-secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# OAuth GitHub
GITHUB_CLIENT_ID=seu-github-client-id
GITHUB_CLIENT_SECRET=seu-github-client-secret
GITHUB_CALLBACK_URL=http://localhost:5000/api/auth/github/callback

# OAuth LinkedIn
LINKEDIN_CLIENT_ID=seu-linkedin-client-id
LINKEDIN_CLIENT_SECRET=seu-linkedin-client-secret
LINKEDIN_CALLBACK_URL=http://localhost:5000/api/auth/linkedin/callback

# Frontend URL (importante para callbacks)
FRONTEND_URL=http://localhost:3000
```

### Variáveis de Produção

Para produção, atualize as URLs:

```env
FRONTEND_URL=https://seu-dominio.com
GOOGLE_CALLBACK_URL=https://api.seu-dominio.com/api/auth/google/callback
GITHUB_CALLBACK_URL=https://api.seu-dominio.com/api/auth/github/callback
LINKEDIN_CALLBACK_URL=https://api.seu-dominio.com/api/auth/linkedin/callback
```

---

## 🧪 Testando

### 1. Instalar Dependências

```bash
cd backend
npm install
```

### 2. Iniciar Servidor

```bash
npm run dev
```

### 3. Testar Login Social

1. Acesse `http://localhost:3000/login`
2. Clique em um dos botões de login social
3. Autorize a aplicação no provedor
4. Você será redirecionado de volta e autenticado automaticamente

---

## 🔒 Segurança

### Boas Práticas

1. **Nunca commite** as credenciais OAuth no Git
2. Use variáveis de ambiente para todas as credenciais
3. Em produção, use HTTPS para todas as URLs
4. Revise regularmente os apps OAuth e remova os não utilizados
5. Configure rate limiting nos endpoints OAuth

### Rotação de Credenciais

Se suspeitar que as credenciais foram comprometidas:

1. Gere novos Client IDs e Secrets
2. Atualize as variáveis de ambiente
3. Revogue os tokens antigos (se possível)
4. Reinicie o servidor

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

- Verifique se a URL de callback no `.env` corresponde exatamente à configurada no provedor OAuth
- URLs devem ser idênticas (incluindo http/https, porta, caminho)

### Erro: "invalid_client"

- Verifique se o Client ID e Secret estão corretos
- Certifique-se de que não há espaços extras nas variáveis de ambiente

### Erro: "access_denied"

- O usuário negou a autorização
- Verifique se os escopos solicitados estão corretos

### Callback não funciona

- Verifique se `FRONTEND_URL` está configurado corretamente
- Certifique-se de que o frontend está rodando na URL especificada
- Verifique os logs do servidor para erros

---

## 📚 Recursos

- [Google OAuth 2.0 Docs](https://developers.google.com/identity/protocols/oauth2)
- [GitHub OAuth Docs](https://docs.github.com/en/apps/oauth-apps/building-oauth-apps)
- [LinkedIn OAuth Docs](https://www.linkedin.com/developers/tools/oauth)

---

## ✅ Checklist

- [ ] Google OAuth configurado
- [ ] GitHub OAuth configurado
- [ ] LinkedIn OAuth configurado
- [ ] Variáveis de ambiente configuradas
- [ ] URLs de callback testadas
- [ ] Login social funcionando
- [ ] Credenciais seguras (não commitadas)

---

**✅ OAuth 2.0 implementado com sucesso!**


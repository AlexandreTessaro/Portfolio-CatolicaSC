# 🔐 Variáveis de Ambiente para Azure App Service

## ✅ **Secrets Gerados:**

Use estes valores nas variáveis de ambiente do Azure:

### JWT Secrets:
```env
JWT_SECRET=37bc787bf0d944e448088e0c6dc6a709b039162ce1f8cbdad76cf9bd4d89590af63035d0e6d896c88d2b8318538ea07679662e499df3a6eef9d127af98b7912e

JWT_REFRESH_SECRET=bf65825be00b7aa9b177c43c35381327f1e88f0590c49a70cd0104f2470a11dc18f086fcd4538ad0a1d14f15069e4b1c2f624c65cea5154ab62eb9e3344c47d9
```

### Migration Token:
```env
MIGRATION_TOKEN=2f5b58186a0d802d78316f160bbc77239f7479eae3b299ee7bace59762e1e742
```

---

## 🗄️ **Configuração do Banco de Dados (Azure AD)**

Você está usando **autenticação Azure AD**, então use **variáveis individuais** em vez de `DATABASE_URL`:

### Variáveis Individuais:
```env
DB_HOST=startup-collab-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=al.vieira@catolicasc.edu.br
DB_NAME=postgres
DB_SSL=true
```

**⚠️ IMPORTANTE**: Para Azure AD, você precisará configurar o App Service para usar **Managed Identity** ou criar uma connection string especial.

---

## 📋 **Todas as Variáveis para Azure App Service:**

No portal Azure → App Service → Configuration → Application settings, adicione:

```env
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://seu-frontend.vercel.app

# Banco de Dados (Azure AD)
DB_HOST=startup-collab-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=al.vieira@catolicasc.edu.br
DB_NAME=postgres
DB_SSL=true

# JWT Secrets
JWT_SECRET=37bc787bf0d944e448088e0c6dc6a709b039162ce1f8cbdad76cf9bd4d89590af63035d0e6d896c88d2b8318538ea07679662e499df3a6eef9d127af98b7912e
JWT_REFRESH_SECRET=bf65825be00b7aa9b177c43c35381327f1e88f0590c49a70cd0104f2470a11dc18f086fcd4538ad0a1d14f15069e4b1c2f624c65cea5154ab62eb9e3344c47d9

# Outras configurações
REDIS_ENABLED=false
MIGRATION_TOKEN=2f5b58186a0d802d78316f160bbc77239f7479eae3b299ee7bace59762e1e742
BCRYPT_SALT_ROUNDS=12
```

---

## ⚠️ **IMPORTANTE - Autenticação Azure AD:**

Para usar autenticação Azure AD no PostgreSQL, você tem duas opções:

### Opção 1: Usar Managed Identity (Recomendado)

1. No App Service, vá em **"Identity"**
2. Ative **"System assigned"** → **"On"** → **"Save"**
3. No PostgreSQL, adicione este Managed Identity como usuário

### Opção 2: Usar Connection String com Token

Você precisará modificar o código para obter o token dinamicamente, ou usar uma connection string que funcione com Azure AD.

---

## 🔧 **Se Precisar Usar DATABASE_URL:**

**Para autenticação tradicional (com senha):**
```env
DATABASE_URL=postgresql://alexandre:SENHA@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

**Ou criar usuário específico para a app:**
```env
DATABASE_URL=postgresql://appuser:SENHA@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

**⚠️ IMPORTANTE**: Substitua `SENHA` pela senha real do PostgreSQL.

**Para Azure AD**, veja o arquivo `AZURE-DATABASE-URL.md` para opções mais complexas.

---

## ✅ **Substituir no Guia:**

No `AZURE-DEPLOY-AGORA.md`, linha 163-173, use as variáveis acima em vez das do exemplo.

---

**💡 Dica**: Se tiver problemas com Azure AD, considere criar um usuário PostgreSQL tradicional com senha para facilitar o deploy inicial.


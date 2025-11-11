# 🚀 Deploy Azure - Passo a Passo AGORA

## ✅ Você já tem:
- ✅ GitHub Education aprovado
- ✅ $100 de crédito Azure disponível
- ✅ Frontend no Vercel
- ✅ Backend pronto para deploy

---

## 📋 **PASSO 1: Ativar Crédito Azure (2 minutos)**

### 1.1. Acesse o GitHub Education Pack
- Vá para: https://education.github.com/pack
- Faça login com sua conta GitHub
- Procure por **"Azure for Students"** ou **"Microsoft Azure"**
- Clique em **"Get your pack"** ou **"Activate"**

### 1.2. Criar Conta Azure
- Você será redirecionado para: https://azure.microsoft.com/free/students/
- Clique em **"Activate now"**
- Faça login com sua conta Microsoft (ou crie uma)
- **NÃO precisa de cartão de crédito!**
- Confirme seus dados de estudante

### 1.3. Verificar Crédito
- Acesse: https://portal.azure.com
- No menu lateral, vá em **"Cost Management + Billing"**
- Você deve ver **$100.00** de crédito disponível

---

## 📋 **PASSO 2: Criar Banco PostgreSQL (5 minutos)**

### 2.1. Acessar Portal Azure
- Vá para: https://portal.azure.com
- Faça login

### 2.2. Criar Azure Database for PostgreSQL

1. **Clique no botão "Create a resource"** (canto superior esquerdo)

2. **Busque por**: `Azure Database for PostgreSQL`

3. **Clique em "Create"** → **"Flexible server"** (ou "Single server" se disponível)

4. **Preencha o formulário:**

   **Basics (Básico):**
   - **Subscription**: Selecione sua subscription
   - **Resource Group**: Clique em **"Create new"**
     - Nome: `startup-collab-rg`
     - Clique em **"OK"**
   - **Server name**: `startup-collab-db` (deve ser único globalmente)
     - Se não estiver disponível, tente: `startup-collab-db-seu-nome`
   - **Region**: Escolha mais próxima (ex: `East US`, `West Europe`)
   - **PostgreSQL version**: `15`
   - **Workload type**: `Development`
   - **Compute + storage**: 
     - Clique em **"Configure server"**
     - Selecione: **"Burstable"** → **"Standard_B1ms"** (1 vCore, 2GB RAM)
     - Storage: **32 GB** (mínimo)
     - Clique em **"OK"**

   **Administrator account:**
   - **Admin username**: `admin` (ou outro nome)
   - **Password**: Crie uma senha forte (ANOTE BEM!)
     - Mínimo 8 caracteres
     - Letras maiúsculas, minúsculas, números e símbolos
   - **Confirm password**: Digite novamente

   **Networking:**
   - **Public access**: ✅ **Yes** (para facilitar, depois pode restringir)
   - **Firewall rules**: 
     - Clique em **"Add current client IP address"**
     - Isso adiciona seu IP atual

5. **Clique em "Review + create"** (Revisar + criar)

6. **Clique em "Create"** (Criar)

7. **Aguarde ~5 minutos** para a criação (você verá notificações no topo)

### 2.3. Obter Connection String

Após a criação:

1. Vá para o recurso criado (clique na notificação ou busque no portal)

2. No menu lateral, vá em **"Settings"** → **"Connection strings"**

3. Copie a connection string (formato):
   ```
   postgresql://admin@startup-collab-db:senha@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
   ```

   **OU anote separadamente:**
   - **Host**: `startup-collab-db.postgres.database.azure.com`
   - **Port**: `5432`
   - **Database**: `postgres`
   - **Username**: `admin@startup-collab-db`
   - **Password**: (a senha que você criou)
   - **SSL**: `require`

---

## 📋 **PASSO 3: Criar App Service (Backend) (10 minutos)**

### 3.1. Criar Web App

1. No portal Azure, clique em **"Create a resource"**

2. Busque por: `Web App` ou `App Service`

3. **⚠️ ATENÇÃO**: Escolha **"App Services"** (não "Function App"!)
   - **App Services** = ✅ Correto (para backend Node.js)
   - **Function App** = ❌ ERRADO! (para funções serverless)
   - Static Web Apps = ❌ Para frontend estático
   - WAF = ❌ Firewall

4. Clique em **"Create"**

5. **Preencha o formulário:**

   **Basics (Básico):**
   - **Subscription**: Sua subscription
   - **Resource Group**: Selecione `startup-collab-rg` (o mesmo do banco)
   - **Name**: `startup-collab-backend` (deve ser único)
     - Se não disponível, tente: `startup-collab-backend-seu-nome`
   - **Publish**: **Code**
   - **Runtime stack**: **Node 18 LTS** (ou Node 20 LTS se disponível)
   - **Operating System**: **Linux**
   - **Region**: Mesma do banco de dados

   **App Service Plan (Plano de Serviço):**
   - Você verá um dropdown com opções
   - **Opção 1**: Se já existe um plano, selecione-o
   - **Opção 2**: Clique em **"Create new"** (criar novo)
     - **Name**: `startup-collab-plan`
     - **Operating System**: **Linux** (já deve estar selecionado)
     - **Region**: Mesma região do banco
     - **Sku and size**: Clique em **"Change size"** ou **"Select a size"**
       - Na lista, procure por **"Dev/Test"** ou **"Free"**
       - Selecione **"F1"** (FREE - Grátis)
         - Descrição: "Shared infrastructure, 1 GB storage"
       - Clique em **"Select"** ou **"Apply"**
     - Clique em **"OK"** ou **"Create"**

6. Clique em **"Review + create"** → **"Create"**

7. Aguarde ~2 minutos

### 3.2. Configurar Variáveis de Ambiente

1. Vá para o **App Service** criado (Web App)

2. No menu lateral, vá em **"Settings"** → **"Configuration"**

3. Clique em **"Application settings"**

4. Clique em **"+ New application setting"** e adicione cada uma:

   **⚠️ IMPORTANTE**: Se você usa **autenticação Azure AD** (como `al.vieira@catolicasc.edu.br`), veja o arquivo `AZURE-VARIAVEIS-AMBIENTE.md` para configuração especial.

   **Para autenticação tradicional (senha):**
   ```env
   NODE_ENV = production
   PORT = 8080
   FRONTEND_URL = https://seu-frontend.vercel.app
   DATABASE_URL = postgresql://admin@startup-collab-db:senha@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
   JWT_SECRET = (gere um secret forte - veja abaixo)
   JWT_REFRESH_SECRET = (gere outro secret forte diferente)
   REDIS_ENABLED = false
   MIGRATION_TOKEN = (gere um token único)
   BCRYPT_SALT_ROUNDS = 12
   ```

   **Para autenticação Azure AD (variáveis individuais):**
   ```env
   NODE_ENV = production
   PORT = 8080
   FRONTEND_URL = https://seu-frontend.vercel.app
   DB_HOST = startup-collab-db.postgres.database.azure.com
   DB_PORT = 5432
   DB_USER = al.vieira@catolicasc.edu.br
   DB_NAME = postgres
   DB_SSL = true
   JWT_SECRET = 37bc787bf0d944e448088e0c6dc6a709b039162ce1f8cbdad76cf9bd4d89590af63035d0e6d896c88d2b8318538ea07679662e499df3a6eef9d127af98b7912e
   JWT_REFRESH_SECRET = bf65825be00b7aa9b177c43c35381327f1e88f0590c49a70cd0104f2470a11dc18f086fcd4538ad0a1d14f15069e4b1c2f624c65cea5154ab62eb9e3344c47d9
   REDIS_ENABLED = false
   MIGRATION_TOKEN = 2f5b58186a0d802d78316f160bbc77239f7479eae3b299ee7bace59762e1e742
   BCRYPT_SALT_ROUNDS = 12
   ```

   **Se precisar gerar novos secrets:**
   ```bash
   # JWT_SECRET e JWT_REFRESH_SECRET:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   
   # MIGRATION_TOKEN:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

5. **IMPORTANTE**: Substitua:
   - `seu-frontend.vercel.app` pela URL real do seu frontend no Vercel
   - Se usar autenticação tradicional, substitua `senha` pela senha real do PostgreSQL
   - **Se usar Azure AD**, você precisará configurar Managed Identity (veja `AZURE-VARIAVEIS-AMBIENTE.md`)

6. Clique em **"Save"** (Salvar) no topo

### 3.3. Configurar Deploy via GitHub

1. No **App Service** (Web App), vá em **"Deployment"** → **"Deployment Center"**

2. Selecione:
   - **Source**: **GitHub**
   - **Organization**: Seu usuário GitHub
   - **Repository**: `Portfolio-CatolicaSC` (ou nome do seu repo)
   - **Branch**: `main`
   - **Build provider**: **App Service build service**

3. Clique em **"Save"**

4. Azure vai pedir autorização no GitHub - **autorize**

5. O deploy começará automaticamente!

---

## 📋 **PASSO 4: Executar Migrações (2 minutos)**

Após o deploy (aguarde ~5 minutos):

1. Obtenha a URL do seu App Service:
   - No Web App, vá em **"Overview"**
   - Copie a **URL** (ex: `https://startup-collab-backend.azurewebsites.net`)

2. Execute as migrações:
   ```bash
   curl -X POST https://startup-collab-backend.azurewebsites.net/api/admin/run-migrations \
     -H "x-migration-token: SEU_MIGRATION_TOKEN"
   ```

   Substitua `SEU_MIGRATION_TOKEN` pelo token que você gerou.

3. Verifique se funcionou:
   ```bash
   curl https://startup-collab-backend.azurewebsites.net/health
   ```

   Deve retornar:
   ```json
   {"success":true,"message":"API funcionando corretamente",...}
   ```

---

## 📋 **PASSO 5: Configurar Frontend (Vercel) (2 minutos)**

1. Acesse: https://vercel.com

2. Vá para seu projeto

3. **Settings** → **Environment Variables**

4. Adicione ou atualize:
   ```env
   VITE_API_URL = https://startup-collab-backend.azurewebsites.net/api
   ```

5. Faça um novo deploy no Vercel (ou aguarde o deploy automático)

---

## ✅ **Verificações Finais**

### Testar Backend:
```bash
# Health check
curl https://startup-collab-backend.azurewebsites.net/health

# Testar registro
curl -X POST https://startup-collab-backend.azurewebsites.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

### Testar Frontend:
- Acesse sua URL do Vercel
- Teste fazer login
- Verifique se as requisições funcionam

---

## 🐛 **Troubleshooting**

### App não inicia:
- Vá em **"Monitoring"** → **"Log stream"** no App Service
- Veja os erros em tempo real

### Erro de conexão com banco:
- Verifique se o firewall do PostgreSQL permite conexões do Azure
- No PostgreSQL, vá em **"Networking"**
- Adicione regra: **"Allow Azure services"** = **Yes**

### CORS Error:
- Verifique se `FRONTEND_URL` está correto no App Service
- Deve ser exatamente a URL do Vercel (com https://)

---

## 💰 **Monitorar Custos**

1. Vá em **"Cost Management + Billing"**
2. Veja seu uso atual
3. Configure alertas se quiser

**Com Free Tier:**
- App Service F1: Grátis
- PostgreSQL B1ms: Grátis (12 meses)
- **Total: $0/mês no primeiro ano!**

---

## 📚 **Links Úteis**

- **Portal Azure**: https://portal.azure.com
- **GitHub Education**: https://education.github.com/pack
- **Documentação Azure**: https://docs.microsoft.com/azure

---

**✅ Pronto! Sua aplicação estará no ar em ~20 minutos!**

Se tiver algum problema, me avise! 🚀


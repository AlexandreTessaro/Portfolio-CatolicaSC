# 🚀 Guia de Deploy Azure - Startup Collab Platform

## 🎯 Por que Azure?

✅ **$100 de crédito grátis** (GitHub Student Pack)  
✅ **Sem necessidade de cartão de crédito**  
✅ **Azure App Service** - Similar ao Koyeb, muito fácil  
✅ **Azure Database for PostgreSQL** - Gerenciado e confiável  
✅ **Integração perfeita** com Vercel (frontend)  
✅ **Deploy automático** via GitHub  

---

## 📋 Pré-requisitos

1. ✅ Conta GitHub com **GitHub Student Pack** ativado
2. ✅ Conta Azure (crie em: https://azure.microsoft.com/free/students/)
3. ✅ Azure CLI instalado (opcional, mas recomendado)
4. ✅ Frontend já no Vercel ✅

---

## 🚀 Passo 1: Ativar Crédito Azure (GitHub Student)

1. Acesse: https://education.github.com/pack
2. Faça login com sua conta GitHub
3. Ative o **Azure for Students**
4. Você receberá **$100 de crédito** sem precisar de cartão!

---

## 🗄️ Passo 2: Criar Banco PostgreSQL (Azure Database)

### Via Portal Azure:

1. Acesse: https://portal.azure.com
2. Clique em **"Create a resource"**
3. Busque **"Azure Database for PostgreSQL"**
4. Clique em **"Create"**
5. Configure:

   **Basics:**
   - **Subscription**: Sua subscription
   - **Resource Group**: Criar novo (ex: `startup-collab-rg`)
   - **Server name**: `startup-collab-db` (único globalmente)
   - **Location**: Escolha mais próxima (ex: `East US`)
   - **Version**: `PostgreSQL 15`
   - **Compute + storage**: **Basic** → **B1ms** (1 vCore, 2GB RAM) - **GRÁTIS por 12 meses!**

   **Administrator account:**
   - **Admin username**: `admin` (ou outro)
   - **Password**: Senha forte (anote bem!)

   **Networking:**
   - **Public access**: ✅ **Yes** (ou configure firewall depois)
   - **Firewall rules**: Adicione seu IP atual

6. Clique em **"Review + create"** → **"Create"**
7. Aguarde ~5 minutos para criação

### Obter Connection String:

Após criação:
1. Vá para o recurso criado
2. Em **Settings** → **Connection strings**
3. Copie a connection string (formato):
   ```
   postgresql://admin@startup-collab-db:senha@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
   ```

**Ou configure via variáveis individuais:**
- `DB_HOST`: `startup-collab-db.postgres.database.azure.com`
- `DB_PORT`: `5432`
- `DB_USER`: `admin@startup-collab-db`
- `DB_PASSWORD`: `sua_senha`
- `DB_NAME`: `postgres`
- `DB_SSL`: `true`

---

## 🚀 Passo 3: Deploy Backend (Azure App Service)

### Opção A: Via Portal Azure (Mais Fácil)

1. Acesse: https://portal.azure.com
2. Clique em **"Create a resource"**
3. Busque **"Web App"**
4. Clique em **"Create"**
5. Configure:

   **Basics:**
   - **Subscription**: Sua subscription
   - **Resource Group**: Mesmo do banco (`startup-collab-rg`)
   - **Name**: `startup-collab-backend` (único, ex: `startup-collab-backend-123`)
   - **Publish**: **Docker Container**
   - **Operating System**: **Linux**
   - **Region**: Mesma do banco
   - **Pricing plan**: **Free F1** (para começar) ou **Basic B1** ($13/mês)

   **Docker:**
   - **Options**: **Single Container**
   - **Image Source**: **Docker Hub** ou **Azure Container Registry**
   - **Access Type**: **Public**
   - **Image and tag**: Deixe vazio por enquanto (vamos configurar depois)

6. Clique em **"Review + create"** → **"Create"**
7. Aguarde criação (~2 minutos)

### Opção B: Via Azure CLI (Recomendado)

```bash
# Login no Azure
az login

# Criar Resource Group
az group create --name startup-collab-rg --location eastus

# Criar App Service Plan (Free tier)
az appservice plan create \
  --name startup-collab-plan \
  --resource-group startup-collab-rg \
  --sku FREE \
  --is-linux

# Criar Web App
az webapp create \
  --resource-group startup-collab-rg \
  --plan startup-collab-plan \
  --name startup-collab-backend \
  --deployment-container-image-name node:18-alpine
```

### Configurar Variáveis de Ambiente:

1. No portal Azure, vá para seu **Web App**
2. Em **Settings** → **Configuration** → **Application settings**
3. Adicione:

```env
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://seu-frontend.vercel.app
DATABASE_URL=postgresql://admin@startup-collab-db:senha@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
JWT_SECRET=<gerar_secret_forte>
JWT_REFRESH_SECRET=<gerar_outro_secret_forte>
REDIS_ENABLED=false
MIGRATION_TOKEN=<token_para_migracoes>
BCRYPT_SALT_ROUNDS=12
```

**Gerar secrets JWT:**
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### Deploy via GitHub Actions (Recomendado):

Crie `.github/workflows/deploy-azure.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: ./backend
      run: npm install
    
    - name: Azure Login
      uses: azure/login@v1
      with:
        creds: ${{ secrets.AZURE_CREDENTIALS }}
    
    - name: Deploy to Azure Web App
      uses: azure/webapps-deploy@v2
      with:
        app-name: startup-collab-backend
        package: ./backend
        startup-command: 'npm start'
```

**Configurar Azure Credentials no GitHub:**
```bash
# No terminal local:
az ad sp create-for-rbac --name "github-actions" --role contributor \
  --scopes /subscriptions/{subscription-id}/resourceGroups/startup-collab-rg \
  --sdk-auth

# Copie o JSON gerado e adicione como secret no GitHub:
# Settings → Secrets → New secret
# Name: AZURE_CREDENTIALS
# Value: (cole o JSON completo)
```

### Deploy Manual (Alternativa):

```bash
# Build local
cd backend
npm install --production

# Criar ZIP
zip -r ../backend.zip .

# Deploy via Azure CLI
az webapp deployment source config-zip \
  --resource-group startup-collab-rg \
  --name startup-collab-backend \
  --src ../backend.zip
```

---

## 🔧 Passo 4: Configurar Porta e Startup

Azure App Service usa a porta definida na variável `PORT` (padrão: 8080).

Seu código já está configurado para usar `process.env.PORT || 5000`, então:

1. Configure `PORT=8080` nas variáveis de ambiente do App Service
2. Ou ajuste o código para usar `process.env.PORT || 8080`

---

## 🗄️ Passo 5: Executar Migrações

Após o deploy:

```bash
# Obter URL do App Service
APP_URL=$(az webapp show --name startup-collab-backend \
  --resource-group startup-collab-rg \
  --query defaultHostName -o tsv)

# Executar migrações
curl -X POST https://${APP_URL}/api/admin/run-migrations \
  -H "x-migration-token: SEU_MIGRATION_TOKEN"
```

---

## 🌐 Passo 6: Configurar Frontend (Vercel)

No Vercel, configure a variável de ambiente:

```env
VITE_API_URL=https://startup-collab-backend.azurewebsites.net/api
```

---

## ✅ Verificações

### Health Check:
```bash
curl https://startup-collab-backend.azurewebsites.net/health
```

### Testar Endpoints:
```bash
# Registro
curl -X POST https://startup-collab-backend.azurewebsites.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

---

## 💰 Custos Estimados

### Free Tier (12 meses):
- ✅ **App Service F1**: Grátis
- ✅ **PostgreSQL B1ms**: Grátis (primeiros 12 meses)
- ✅ **Total**: **$0/mês** (primeiro ano)

### Após Free Tier:
- **App Service Basic B1**: ~$13/mês
- **PostgreSQL B1ms**: ~$25/mês
- **Total**: ~$38/mês

**Com $100 de crédito**: Dura ~2-3 meses após free tier!

---

## 🔒 Segurança

1. **Firewall do PostgreSQL**: Configure para permitir apenas IPs do App Service
2. **HTTPS**: Automático no Azure App Service
3. **Secrets**: Use Azure Key Vault (opcional)
4. **CORS**: Configure `FRONTEND_URL` corretamente

---

## 📊 Monitoramento

- **Application Insights**: Ative no App Service
- **Logs**: Veja em **Log stream** no portal
- **Métricas**: Dashboard automático

---

## 🐛 Troubleshooting

### App não inicia:
- Verifique logs: Portal → App Service → **Log stream**
- Verifique variáveis de ambiente
- Verifique conexão com banco

### Erro de conexão com banco:
- Verifique firewall do PostgreSQL
- Adicione IP do App Service nas regras
- Verifique connection string

### CORS Error:
- Verifique `FRONTEND_URL` está correto
- Verifique configuração CORS no código

---

## 📚 Links Úteis

- **Portal Azure**: https://portal.azure.com
- **Azure CLI Docs**: https://docs.microsoft.com/cli/azure
- **App Service Docs**: https://docs.microsoft.com/azure/app-service
- **PostgreSQL Docs**: https://docs.microsoft.com/azure/postgresql

---

**✅ Pronto! Sua aplicação estará rodando no Azure!**




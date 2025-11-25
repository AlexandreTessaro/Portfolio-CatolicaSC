# 🚀 Deploy

## Desenvolvimento Local

### Pré-requisitos

- **Docker** e **Docker Compose** instalados
- **Node.js 18+** (opcional, para desenvolvimento sem Docker)
- **Git**

### Passo a Passo

#### 1. Clone o Repositório

```bash
git clone <url-do-repositorio>
cd Portfolio-CatolicaSC
```

#### 2. Configure Variáveis de Ambiente

**Backend**:

```bash
cp backend/env.example backend/.env
```

Edite `backend/.env` com suas configurações:

```bash
NODE_ENV=development
PORT=5000

# Banco de Dados (Docker Compose cria automaticamente)
DB_HOST=postgres
DB_PORT=5432
DB_NAME=startupcollab
DB_USER=postgres
DB_PASSWORD=postgres

# Redis (Docker Compose cria automaticamente)
REDIS_HOST=redis
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-secret-change-in-production
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000
```

**Frontend**:

```bash
cp frontend/env.example frontend/.env
```

Edite `frontend/.env`:

```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

#### 3. Execute com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

Isso iniciará:
- **Backend** na porta 5000
- **Frontend** na porta 3000
- **PostgreSQL** na porta 5432
- **Redis** na porta 6379

#### 4. Execute Migrations e Seeds

```bash
# Em outro terminal
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

#### 5. Acesse a Aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

**Credenciais padrão**:
- Admin: `admin@startupcollab.com` / `admin123`
- Usuário: `email@startupcollab.com` / `password123`

---

## Desenvolvimento Local (Sem Docker)

### Backend

```bash
cd backend
npm install
npm run dev
```

**Requisitos**:
- PostgreSQL rodando localmente
- Redis rodando localmente
- Variáveis de ambiente configuradas

### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Variáveis de Ambiente

### Backend (Produção)

```bash
NODE_ENV=production
PORT=5000

# Banco de Dados (Azure PostgreSQL)
DATABASE_URL=postgresql://user:password@host:5432/dbname

# Redis (Azure Cache)
REDIS_HOST=your-redis-host.redis.cache.windows.net
REDIS_PORT=6380
REDIS_PASSWORD=your-redis-password
REDIS_TLS=true

# JWT (Use secrets seguros)
JWT_SECRET=your-production-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=https://your-frontend-domain.vercel.app

# Monitoramento (Opcional)
AZURE_APPINSIGHTS_INSTRUMENTATION_KEY=your-key
DATADOG_API_KEY=your-key
```

### Frontend (Produção)

```bash
VITE_API_URL=https://your-backend.azurewebsites.net
VITE_SOCKET_URL=https://your-backend.azurewebsites.net
```

---

## Deploy Backend (Azure)

### Pré-requisitos

- Conta Azure
- Azure CLI instalado
- GitHub Actions configurado (ou deploy manual)

### Opção 1: Deploy via GitHub Actions (Recomendado)

1. **Configure Secrets no GitHub**:
   - `AZURE_WEBAPP_NAME`: Nome do App Service
   - `AZURE_WEBAPP_PUBLISH_PROFILE`: Perfil de publicação do Azure
   - `DATABASE_URL`: String de conexão do PostgreSQL
   - `JWT_SECRET`: Secret para JWT
   - `JWT_REFRESH_SECRET`: Secret para refresh token
   - `REDIS_HOST`, `REDIS_PASSWORD`: Credenciais do Redis
   - `CORS_ORIGIN`: URL do frontend

2. **Push para branch `main`**:
   ```bash
   git push origin main
   ```

3. **GitHub Actions executa automaticamente**:
   - Build da aplicação
   - Deploy para Azure App Service
   - Execução de migrations (se configurado)

### Opção 2: Deploy Manual via Azure CLI

```bash
# Login no Azure
az login

# Criar App Service (se não existir)
az webapp create \
  --resource-group your-resource-group \
  --plan your-app-service-plan \
  --name your-app-name \
  --runtime "NODE|20-lts"

# Configurar variáveis de ambiente
az webapp config appsettings set \
  --resource-group your-resource-group \
  --name your-app-name \
  --settings \
    NODE_ENV=production \
    DATABASE_URL="your-database-url" \
    JWT_SECRET="your-secret"

# Deploy via ZIP
cd backend
zip -r deploy.zip . -x "node_modules/*" "tests/*" "coverage/*"
az webapp deployment source config-zip \
  --resource-group your-resource-group \
  --name your-app-name \
  --src deploy.zip
```

### Opção 3: Deploy via Azure Portal

1. Acesse o Azure Portal
2. Crie um **App Service** (Linux, Node.js 20)
3. Configure **Application Settings** com variáveis de ambiente
4. Conecte ao **Deployment Center** (GitHub)
5. Configure **Startup Command**: `node index.js`

### Executar Migrations em Produção

**Via SSH**:

```bash
# Conectar via SSH
az webapp ssh --resource-group your-resource-group --name your-app-name

# Executar migrations
npm run db:migrate

# Executar seeds (opcional)
npm run db:seed-production
```

**Via Endpoint Admin** (se configurado):

```bash
curl -X POST 'https://your-app.azurewebsites.net/api/admin/run-migrations?token=YOUR_TOKEN'
```

---

## Deploy Frontend (Vercel)

### Pré-requisitos

- Conta Vercel
- Vercel CLI instalado (opcional)

### Opção 1: Deploy via GitHub (Recomendado)

1. **Conecte o repositório no Vercel**:
   - Acesse [vercel.com](https://vercel.com)
   - Importe o repositório GitHub
   - Configure:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm run build`
     - **Output Directory**: `dist`
     - **Install Command**: `npm install`

2. **Configure Environment Variables**:
   - `VITE_API_URL`: URL do backend
   - `VITE_SOCKET_URL`: URL do WebSocket

3. **Deploy automático**:
   - Cada push na branch `main` gera novo deploy
   - Pull Requests geram preview deployments

### Opção 2: Deploy via CLI

```bash
cd frontend
npm install -g vercel
vercel login
vercel --prod
```

### Opção 3: Deploy Manual

```bash
cd frontend
npm install
npm run build

# Upload da pasta dist/ para seu servidor
```

---

## CI/CD com GitHub Actions

### Workflow Backend

```yaml
# .github/workflows/deploy-backend.yml
name: Deploy Backend
on:
  push:
    branches: [main]
    paths:
      - 'backend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: azure/webapps-deploy@v2
        with:
          app-name: ${{ secrets.AZURE_WEBAPP_NAME }}
          publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
          package: './backend'
```

### Workflow Frontend

```yaml
# .github/workflows/deploy-frontend.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
    paths:
      - 'frontend/**'

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          working-directory: ./frontend
```

---

## Configuração de Banco de Dados

### Azure PostgreSQL

1. **Criar PostgreSQL no Azure**:
   ```bash
   az postgres flexible-server create \
     --resource-group your-resource-group \
     --name your-postgres-server \
     --location brazilsouth \
     --admin-user your-admin \
     --admin-password your-password \
     --sku-name Standard_B1ms \
     --tier Burstable \
     --version 14
   ```

2. **Criar banco de dados**:
   ```bash
   az postgres flexible-server db create \
     --resource-group your-resource-group \
     --server-name your-postgres-server \
     --database-name startupcollab
   ```

3. **Configurar firewall** (permitir Azure Services):
   ```bash
   az postgres flexible-server firewall-rule create \
     --resource-group your-resource-group \
     --name your-postgres-server \
     --rule-name AllowAzureServices \
     --start-ip-address 0.0.0.0 \
     --end-ip-address 0.0.0.0
   ```

4. **Obter connection string**:
   ```bash
   az postgres flexible-server show-connection-string \
     --server-name your-postgres-server \
     --database-name startupcollab \
     --admin-user your-admin \
     --admin-password your-password
   ```

---

## Troubleshooting

### Backend não inicia

1. Verificar logs: `az webapp log tail --name your-app-name`
2. Verificar variáveis de ambiente no Azure Portal
3. Verificar conexão com banco de dados
4. Verificar porta (deve ser configurada via `PORT` ou `WEBSITES_PORT`)

### Frontend não conecta ao backend

1. Verificar `VITE_API_URL` no Vercel
2. Verificar CORS no backend (`CORS_ORIGIN`)
3. Verificar se backend está rodando

### Migrations falham

1. Verificar permissões do usuário do banco
2. Verificar se banco existe
3. Executar migrations manualmente via SSH

### Erro de cold start (Azure)

Azure App Service em planos básicos pode ter "cold start". Soluções:
- Usar plano Standard ou superior
- Configurar health check externo (ping periódico)
- Implementar retry no frontend (já implementado)

---

## Links Relacionados

- **[Especificação Técnica](./02-especificacao-tecnica.md)** - Configurações detalhadas
- **[Troubleshooting](./07-apendices.md#troubleshooting)** - Mais soluções
- **[Voltar ao Índice](./00-indice.md)**


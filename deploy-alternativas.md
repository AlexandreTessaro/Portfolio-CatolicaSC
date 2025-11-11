# 🚀 Guias de Deploy - Alternativas ao AWS

## 🎯 Comparação Rápida

| Plataforma | Custo Estudante | Facilidade | PostgreSQL | Recomendação |
|------------|----------------|------------|------------|--------------|
| **Azure** | $100 grátis | ⭐⭐⭐⭐⭐ | ✅ Gerenciado | 🏆 **MELHOR** |
| **Google Cloud** | $300 grátis | ⭐⭐⭐⭐ | ✅ Gerenciado | ⭐⭐⭐⭐ |
| **Vultr** | Sem free tier | ⭐⭐⭐ | ❌ Self-hosted | ⭐⭐⭐ |
| **IBM Cloud** | $200 grátis | ⭐⭐⭐ | ✅ Gerenciado | ⭐⭐⭐ |

---

## 🏆 **OPÇÃO 1: Microsoft Azure (RECOMENDADO)**

✅ **$100 grátis** (GitHub Student Pack)  
✅ **Sem cartão de crédito**  
✅ **Azure App Service** - Muito fácil  
✅ **Azure Database for PostgreSQL** - Gerenciado  

**Guia completo**: Veja **[azure-deploy-guide.md](./azure-deploy-guide.md)**

---

## ⭐ **OPÇÃO 2: Google Cloud Platform**

### Benefícios:
- ✅ **$300 de crédito grátis** (sempre, não expira)
- ✅ **Cloud Run** - Similar ao Koyeb (serverless)
- ✅ **Cloud SQL PostgreSQL** - Gerenciado
- ✅ **Firebase Hosting** - Para frontend (mas você já usa Vercel)

### Deploy Backend (Cloud Run):

```bash
# Instalar Google Cloud SDK
# https://cloud.google.com/sdk/docs/install

# Login
gcloud auth login

# Criar projeto
gcloud projects create startup-collab --name="Startup Collab"

# Configurar projeto
gcloud config set project startup-collab

# Habilitar APIs
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com

# Criar Cloud SQL PostgreSQL
gcloud sql instances create startup-collab-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Criar banco
gcloud sql databases create startup_collab \
  --instance=startup-collab-db

# Build e deploy no Cloud Run
cd backend
gcloud run deploy startup-collab-backend \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated \
  --set-env-vars DATABASE_URL="postgresql://user:pass@/startup_collab?host=/cloudsql/PROJECT:REGION:INSTANCE"
```

### Variáveis de Ambiente (Cloud Run):

```env
NODE_ENV=production
PORT=8080
FRONTEND_URL=https://seu-frontend.vercel.app
DATABASE_URL=postgresql://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

**Guia completo**: https://cloud.google.com/run/docs/quickstarts/build-and-deploy

---

## ⭐ **OPÇÃO 3: Vultr**

### Benefícios:
- ✅ **Muito barato** ($6/mês para VPS)
- ✅ **Simples** e direto
- ❌ **Sem PostgreSQL gerenciado** (precisa instalar)

### Deploy Backend (Vultr VPS):

1. **Criar VPS**:
   - Acesse: https://www.vultr.com
   - Crie VPS Ubuntu 22.04
   - Plano: **Regular Performance** - $6/mês (1 vCPU, 1GB RAM)

2. **Instalar Node.js e PostgreSQL**:
```bash
# SSH no servidor
ssh root@seu-ip

# Instalar Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt-get install -y nodejs

# Instalar PostgreSQL
apt-get install -y postgresql postgresql-contrib

# Criar banco
sudo -u postgres createdb startup_collab
sudo -u postgres createuser -P startup_user
```

3. **Deploy da aplicação**:
```bash
# Clonar repositório
git clone seu-repo
cd Portfolio-CatolicaSC/backend

# Instalar dependências
npm install --production

# Configurar .env
nano .env
# Adicione: DATABASE_URL, JWT_SECRET, etc.

# Usar PM2 para gerenciar processo
npm install -g pm2
pm2 start index.js --name startup-collab-backend
pm2 save
pm2 startup
```

4. **Configurar Nginx** (reverse proxy):
```bash
apt-get install -y nginx

# Configurar
nano /etc/nginx/sites-available/startup-collab
```

```nginx
server {
    listen 80;
    server_name seu-dominio.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/startup-collab /etc/nginx/sites-enabled/
nginx -t
systemctl restart nginx
```

**Custo**: ~$6-12/mês (dependendo do plano)

---

## ⭐ **OPÇÃO 4: IBM Cloud**

### Benefícios:
- ✅ **$200 de crédito grátis** (30 dias)
- ✅ **Cloud Foundry** ou **Code Engine**
- ✅ **Databases for PostgreSQL** - Gerenciado

### Deploy Backend (IBM Code Engine):

```bash
# Instalar IBM Cloud CLI
# https://cloud.ibm.com/docs/cli

# Login
ibmcloud login

# Criar projeto
ibmcloud ce project create --name startup-collab

# Criar PostgreSQL
ibmcloud resource service-instance-create startup-collab-db \
  databases-for-postgresql standard us-south \
  -p '{"version":"15"}'

# Build e deploy
cd backend
ibmcloud ce app create --name startup-collab-backend \
  --build-source . \
  --env DATABASE_URL="..." \
  --env NODE_ENV=production
```

**Guia completo**: https://cloud.ibm.com/docs/codeengine

---

## 🎯 **Recomendação Final**

### Para Estudante com GitHub Student Pack:

1. 🏆 **Azure** - Melhor opção
   - $100 grátis sem cartão
   - Mais fácil de usar
   - PostgreSQL gerenciado
   - Integração perfeita

2. ⭐ **Google Cloud** - Segunda opção
   - $300 grátis (mais crédito)
   - Cloud Run é excelente
   - PostgreSQL gerenciado

3. ⭐ **Vultr** - Se precisar de mais controle
   - Muito barato
   - Mas precisa gerenciar tudo

4. ⭐ **IBM Cloud** - Alternativa
   - $200 grátis
   - Mas menos popular

---

## 📚 Guias Completos

- **Azure**: Veja **[azure-deploy-guide.md](./azure-deploy-guide.md)** 🏆
- **Google Cloud**: https://cloud.google.com/run/docs
- **Vultr**: https://www.vultr.com/docs
- **IBM Cloud**: https://cloud.ibm.com/docs

---

**💡 Dica**: Comece com **Azure** - é a opção mais fácil e você já tem $100 grátis!




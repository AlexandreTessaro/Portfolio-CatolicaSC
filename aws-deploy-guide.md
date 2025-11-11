# 🚀 Guia de Deploy AWS - Startup Collab Platform

## 📋 Visão Geral

Este guia detalha como fazer o deploy da aplicação **Startup Collab** na AWS, migrando do Koyeb para a infraestrutura AWS.

### Arquitetura AWS Recomendada

```
┌─────────────────┐
│   CloudFront    │ ← Frontend (S3 + CloudFront)
│   (CDN Global)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Application    │ ← Backend (App Runner ou ECS Fargate)
│  Load Balancer  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   RDS PostgreSQL│ ← Banco de Dados (RDS)
│   (Managed DB)  │
└─────────────────┘
```

---

## 🎯 Opção 1: AWS App Runner (Recomendado - Similar ao Koyeb)

AWS App Runner é a opção mais simples e similar ao Koyeb, com auto-scaling automático.

### Pré-requisitos

1. Conta AWS ativa
2. AWS CLI instalado e configurado
3. Docker instalado (para build local)
4. Permissões IAM adequadas

### Passo 1: Criar Repositório ECR (Elastic Container Registry)

```bash
# Criar repositório no ECR
aws ecr create-repository --repository-name startup-collab-backend --region us-east-1

# Fazer login no ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build da imagem Docker
cd backend
docker build -t startup-collab-backend .

# Tag da imagem
docker tag startup-collab-backend:latest <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/startup-collab-backend:latest

# Push para ECR
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/startup-collab-backend:latest
```

### Passo 2: Criar Serviço App Runner

#### Via Console AWS:

1. Acesse **AWS App Runner** no console
2. Clique em **Create service**
3. Selecione **Container registry** → **Amazon ECR**
4. Escolha o repositório criado
5. Configure:
   - **Service name**: `startup-collab-backend`
   - **Virtual CPU**: 1 vCPU
   - **Memory**: 2 GB
   - **Port**: 5000
   - **Environment variables**: (veja seção abaixo)

#### Via AWS CLI:

```bash
# Criar serviço App Runner usando o arquivo apprunner.yaml
aws apprunner create-service \
  --service-name startup-collab-backend \
  --source-configuration '{
    "ImageRepository": {
      "ImageIdentifier": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/startup-collab-backend:latest",
      "ImageConfiguration": {
        "Port": "5000",
        "RuntimeEnvironmentVariables": {
          "NODE_ENV": "production",
          "PORT": "5000"
        }
      },
      "ImageRepositoryType": "ECR"
    },
    "AutoDeploymentsEnabled": true
  }' \
  --instance-configuration '{
    "Cpu": "1 vCPU",
    "Memory": "2 GB"
  }' \
  --region us-east-1
```

### Passo 3: Configurar Variáveis de Ambiente

No console do App Runner, configure as seguintes variáveis:

```env
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://SEU_CLOUDFRONT_URL
DATABASE_URL=postgresql://user:password@rds-endpoint:5432/database?sslmode=require
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

### Passo 4: Configurar Banco de Dados RDS

1. Acesse **RDS** no console AWS
2. Clique em **Create database**
3. Escolha **PostgreSQL**
4. Configure:
   - **DB instance identifier**: `startup-collab-db`
   - **Master username**: `admin`
   - **Master password**: (senha forte)
   - **DB instance class**: `db.t3.micro` (Free Tier)
   - **Storage**: 20 GB
   - **VPC**: Default ou criar nova
   - **Public access**: Sim (ou configurar VPC adequadamente)
   - **Security group**: Permitir porta 5432 do App Runner

5. Após criação, copie o **Endpoint** e configure no `DATABASE_URL`:
   ```
   postgresql://admin:senha@endpoint.region.rds.amazonaws.com:5432/postgres?sslmode=require
   ```

### Passo 5: Executar Migrações

Após o deploy, execute as migrações:

```bash
# Obter URL do serviço App Runner
APP_RUNNER_URL=$(aws apprunner describe-service \
  --service-arn <SERVICE_ARN> \
  --query 'Service.ServiceUrl' \
  --output text)

# Executar migrações
curl -X POST https://${APP_RUNNER_URL}/api/admin/run-migrations \
  -H "x-migration-token: ${MIGRATION_TOKEN}"
```

---

## 🎯 Opção 2: AWS ECS com Fargate (Mais Controle)

Para mais controle sobre a infraestrutura, use ECS Fargate.

### Passo 1: Criar Cluster ECS

```bash
aws ecs create-cluster --cluster-name startup-collab-cluster --region us-east-1
```

### Passo 2: Criar Task Definition

Use o arquivo `ecs-task-definition.json` (será criado):

```bash
aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json
```

### Passo 3: Criar Serviço ECS

```bash
aws ecs create-service \
  --cluster startup-collab-cluster \
  --service-name startup-collab-backend \
  --task-definition startup-collab-backend \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...:targetgroup/...,containerName=backend,containerPort=5000"
```

---

## 🌐 Deploy do Frontend (S3 + CloudFront)

### Passo 1: Criar Bucket S3

```bash
# Criar bucket
aws s3 mb s3://startup-collab-frontend --region us-east-1

# Habilitar website estático
aws s3 website s3://startup-collab-frontend \
  --index-document index.html \
  --error-document index.html
```

### Passo 2: Build do Frontend

```bash
cd frontend

# Configurar variável de ambiente com URL do backend
export VITE_API_URL=https://SEU_APP_RUNNER_URL/api

# Build
npm run build
```

### Passo 3: Upload para S3

```bash
# Upload dos arquivos
aws s3 sync dist/ s3://startup-collab-frontend --delete

# Configurar políticas de bucket
aws s3api put-bucket-policy --bucket startup-collab-frontend --policy '{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::startup-collab-frontend/*"
  }]
}'
```

### Passo 4: Criar Distribuição CloudFront

1. Acesse **CloudFront** no console
2. Clique em **Create distribution**
3. Configure:
   - **Origin domain**: `startup-collab-frontend.s3.amazonaws.com`
   - **Origin path**: (deixe vazio)
   - **Viewer protocol policy**: Redirect HTTP to HTTPS
   - **Allowed HTTP methods**: GET, HEAD, OPTIONS
   - **Default root object**: `index.html`
   - **Error pages**: 
     - 404 → `/index.html` (200)
     - 403 → `/index.html` (200)

4. Após criação, aguarde a distribuição ficar **Deployed**
5. Copie a **Domain name** do CloudFront e configure no `FRONTEND_URL` do backend

### Passo 5: Script de Deploy Automatizado

Crie o arquivo `deploy-frontend.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Deploying frontend to AWS S3 + CloudFront..."

# Variáveis
BUCKET_NAME="startup-collab-frontend"
DISTRIBUTION_ID="<SEU_CLOUDFRONT_DISTRIBUTION_ID>"
BACKEND_URL="https://<SEU_APP_RUNNER_URL>/api"

# Build
cd frontend
export VITE_API_URL="${BACKEND_URL}"
npm run build

# Upload
echo "📤 Uploading to S3..."
aws s3 sync dist/ s3://${BUCKET_NAME} --delete

# Invalidate CloudFront cache
echo "🔄 Invalidating CloudFront cache..."
aws cloudfront create-invalidation \
  --distribution-id ${DISTRIBUTION_ID} \
  --paths "/*"

echo "✅ Deploy concluído!"
```

---

## 🔧 Configuração de CI/CD com GitHub Actions

Crie `.github/workflows/deploy-aws.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build, tag, and push image to Amazon ECR
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          ECR_REPOSITORY: startup-collab-backend
          IMAGE_TAG: latest
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG -f backend/Dockerfile ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
      
      - name: Deploy to App Runner
        run: |
          aws apprunner start-deployment \
            --service-arn ${{ secrets.AWS_APP_RUNNER_SERVICE_ARN }}

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Install dependencies
        run: |
          cd frontend
          npm ci
      
      - name: Build
        run: |
          cd frontend
          export VITE_API_URL=${{ secrets.AWS_BACKEND_URL }}/api
          npm run build
      
      - name: Deploy to S3
        run: |
          aws s3 sync frontend/dist/ s3://startup-collab-frontend --delete
      
      - name: Invalidate CloudFront
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.AWS_CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"
```

---

## 🔒 Segurança e Boas Práticas

### 1. IAM Roles e Policies

Crie roles específicas com permissões mínimas necessárias:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage"
      ],
      "Resource": "*"
    }
  ]
}
```

### 2. Secrets Manager

Use AWS Secrets Manager para secrets sensíveis:

```bash
# Criar secret
aws secretsmanager create-secret \
  --name startup-collab/jwt-secret \
  --secret-string "seu-jwt-secret-aqui"

# No App Runner, referenciar:
# JWT_SECRET={{ secrets:startup-collab/jwt-secret }}
```

### 3. VPC e Security Groups

- Configure VPC adequadamente
- Use Security Groups para restringir acesso
- RDS deve estar em subnet privada (se possível)

### 4. Monitoramento

- Configure **CloudWatch** para logs
- Configure alertas para:
  - Erros de aplicação
  - Uso de CPU/Memória
  - Latência alta

---

## 📊 Custos Estimados (Free Tier)

- **RDS PostgreSQL**: 750 horas/mês grátis (db.t3.micro)
- **S3**: 5 GB grátis
- **CloudFront**: 50 GB transfer grátis
- **App Runner**: Sem free tier (aprox. $7-15/mês)
- **ECS Fargate**: Sem free tier (aprox. $10-20/mês)

**Total estimado**: $7-20/mês (após free tier)

---

## ✅ Checklist de Deploy

- [ ] Conta AWS configurada
- [ ] AWS CLI instalado e configurado
- [ ] Repositório ECR criado
- [ ] Imagem Docker buildada e enviada
- [ ] Serviço App Runner criado
- [ ] Variáveis de ambiente configuradas
- [ ] RDS PostgreSQL criado
- [ ] Security Groups configurados
- [ ] Migrações executadas
- [ ] Frontend buildado
- [ ] Bucket S3 criado e configurado
- [ ] CloudFront distribution criada
- [ ] CORS configurado corretamente
- [ ] Health check funcionando
- [ ] Testes end-to-end realizados

---

## 🐛 Troubleshooting

### Backend não inicia
- Verifique logs no CloudWatch
- Verifique variáveis de ambiente
- Verifique conexão com RDS (Security Groups)

### CORS Error
- Verifique `FRONTEND_URL` no backend
- Verifique configuração CORS no código

### 500 Error
- Verifique logs do App Runner
- Verifique conexão com banco
- Verifique se migrações foram executadas

### Frontend não carrega
- Verifique CloudFront distribution status
- Verifique políticas do bucket S3
- Verifique build do frontend

---

## 📞 Suporte

Para problemas:
1. Verifique logs no CloudWatch
2. Verifique documentação AWS
3. Verifique variáveis de ambiente
4. Teste localmente primeiro

---

**✅ Aplicação pronta para deploy na AWS!**

Siga este guia passo a passo e sua aplicação estará rodando na AWS. 🚀


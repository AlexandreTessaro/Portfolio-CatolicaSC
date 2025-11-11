# 🚀 Guia Completo de Deploy

## ✅ **STATUS ATUAL**

A aplicação **ESTÁ PRONTA PARA DEPLOY**, mas precisa de algumas configurações finais.

### 📊 **O que já está configurado:**

- ✅ Dockerfiles (backend e frontend)
- ✅ CI/CD pipeline (GitHub Actions)
- ✅ Configurações para Railway (backend) - **Legado**
- ✅ Configurações para Vercel (frontend) - **Legado**
- ✅ **Configurações para AWS (App Runner + ECS)** - **NOVO** 🆕
- ✅ Variáveis de ambiente documentadas
- ✅ Backend adaptado para AWS Lambda (serverless-http)

### 🆕 **Migração para AWS**

A aplicação agora suporta deploy na AWS. Consulte **[aws-deploy-guide.md](./aws-deploy-guide.md)** para instruções completas de migração do Koyeb para AWS.

### ⚠️ **O que precisa verificar antes do deploy:**

---

## 🎯 **OPÇÕES DE DEPLOY**

### **Opção 1: AWS (Recomendado)** 🆕

Para deploy na AWS, consulte o guia completo: **[aws-deploy-guide.md](./aws-deploy-guide.md)**

**Arquitetura AWS:**
- **Backend**: AWS App Runner ou ECS Fargate
- **Frontend**: S3 + CloudFront
- **Banco de Dados**: RDS PostgreSQL

### **Opção 2: Railway + Vercel (Legado)**

Configuração anterior mantida para referência.

---

## 🔧 **PREPARAÇÃO PARA DEPLOY**

### 1. **Variáveis de Ambiente - Backend (AWS App Runner/ECS)**

No console AWS (App Runner ou ECS), configure as seguintes variáveis:

```env
NODE_ENV=production
FRONTEND_URL=https://SEU_CLOUDFRONT_URL
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
JWT_SECRET=...forte...
JWT_REFRESH_SECRET=...forte...
REDIS_ENABLED=false
MIGRATION_TOKEN=...token_unico_para_execucao_de_migracoes...
BCRYPT_SALT_ROUNDS=12
SMTP_HOST=smtp.gmail.com   # opcional
SMTP_PORT=587              # opcional
SMTP_USER=...              # opcional
SMTP_PASS=...              # opcional
```

### 2. **Variáveis de Ambiente - Frontend (Vercel)**

No dashboard do Vercel:

```env
VITE_API_URL=https://portfolio-backend-production-a492.up.railway.app/api
```

### 3. **Banco de Dados (RDS Free Tier)**

#### Opção A: Usar PostgreSQL do Railway
1. Crie um serviço PostgreSQL no Railway
2. Copie a `DATABASE_URL` gerada
3. Configure no backend

#### Opção B: Usar Supabase (já configurado no render.yaml)
- Credenciais já estão no `render.yaml` (mas remova-as do código!)
- Configure via variáveis de ambiente, nunca commit credentials

#### Opção C: Outro provedor
- AWS RDS
- Google Cloud SQL
- DigitalOcean Managed Database

**⚠️ IMPORTANTE:** Execute as migrações após configurar o banco:

```bash
# Endpoint seguro (uma vez):
curl -X POST https://SEU_API_GATEWAY_URL/api/admin/run-migrations \
  -H "x-migration-token: $MIGRATION_TOKEN"
```

### 4. **CORS - Configuração**

O backend já está configurado para aceitar requisições do frontend. Verifique que:

- `FRONTEND_URL` no backend corresponda à URL do frontend
- CORS está habilitado com `credentials: true`

---

## 🚀 **PROCESSO DE DEPLOY**

### **Backend - AWS Lambda + API Gateway**

1. Empacote e publique o Lambda (ZIP ou Container) com `backend/` como código.
2. Configure variáveis de ambiente listadas acima no Lambda.
3. Crie API HTTP no API Gateway e integre o Lambda (rota proxy `/api/{proxy+}` e `/health`).
4. Teste `GET /health` e `POST /api/admin/run-migrations` (com token).

### **Frontend - S3 + CloudFront**

1. Build local do frontend:
   ```bash
   cd frontend
   VITE_API_URL=https://SEU_API_GATEWAY_URL/api npm run build
   ```
2. Faça upload do conteúdo de `frontend/dist` para um bucket S3 (static website).
3. Crie uma distribuição CloudFront apontando para o bucket.
4. Configure redirecionamento de SPA (404 → /index.html).

---

## 🔍 **VERIFICAÇÕES PÓS-DEPLOY**

### 1. **Health Check**
```bash
# Backend
curl https://portfolio-backend-production-a492.up.railway.app/health

# Deve retornar:
# { "status": "ok", "timestamp": "..." }
```

### 2. **Testar Endpoints**
```bash
# Testar registro
curl -X POST https://portfolio-backend-production-a492.up.railway.app/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'

# Testar login
curl -X POST https://portfolio-backend-production-a492.up.railway.app/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123"}'
```

### 3. **Verificar CORS**
- Abra o frontend no navegador
- Teste fazer login
- Verifique o console do navegador (F12) para erros de CORS

### 4. **Verificar Conectividade**
- Frontend consegue se comunicar com backend?
- Requisições retornam dados corretos?
- Tokens estão sendo enviados/recebidos?

---

## ⚠️ **CHECKLIST PRÉ-DEPLOY**

Antes de fazer deploy, confirme:

- [ ] Todas as variáveis de ambiente configuradas
- [ ] Secrets JWT são fortes e únicos para produção
- [ ] Banco de dados criado e acessível
- [ ] Migrações executadas no banco de produção
- [ ] CORS configurado com URL correta do frontend
- [ ] `NODE_ENV=production` configurado
- [ ] `.env` files NÃO estão commitados no git (usar .gitignore)
- [ ] Secrets não estão hardcoded no código
- [ ] Build do frontend funciona localmente (`npm run build`)
- [ ] Backend inicia corretamente (`npm start`)
- [ ] Health check endpoint responde
- [ ] Logs estão configurados
- [ ] Rate limiting configurado adequadamente

---

## 🔒 **SEGURANÇA EM PRODUÇÃO**

### **CRÍTICO - Faça AGORA:**

1. **Altere JWT Secrets**
   ```bash
   # Gere secrets fortes:
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```

2. **Remove credenciais do código**
   - O `render.yaml` tem credenciais expostas ❌
   - Remova ou use variáveis de ambiente
   - Nunca commite secrets no git

3. **Configure HTTPS**
   - Railway e Vercel já fornecem HTTPS automático ✅

4. **Backups do banco**
   - Configure backups automáticos (não implementado ainda - veja CHECKLIST-RFC.md)

---

## 📊 **MONITORAMENTO**

### **Logs**
- **Railway**: Dashboard → View Logs
- **Vercel**: Dashboard → Deployments → View Logs

### **Métricas**
- Railway mostra CPU, memória, requisições
- Vercel mostra visitas, bandwidth

### **Alertas**
Configure alertas para:
- Falhas de deploy
- Erros de aplicação
- Uso alto de recursos

---

## 🐛 **TROUBLESHOOTING COMUM**

### **Backend não inicia**
- Verifique variáveis de ambiente
- Verifique conexão com banco de dados
- Veja logs no Railway

### **CORS Error**
- Verifique `FRONTEND_URL` no backend
- Verifique se frontend está na whitelist do CORS

### **500 Error no backend**
- Verifique logs
- Verifique se banco está acessível
- Verifique se migrações foram executadas

### **404 no frontend**
- Verifique se `vercel.json` está correto
- Verifique rotas do React Router

### **Build falha**
- Verifique dependências (`npm install`)
- Verifique Node.js version (deve ser 18+)

---

## 🔄 **DEPLOY CONTÍNUO**

O CI/CD já está configurado no GitHub Actions. Ele:

1. **Roda testes** antes de deployar
2. **Faz deploy do frontend** para Vercel
3. **Backend** deploya automaticamente no Railway quando há push na main

Para fazer deploy manual:

```bash
# 1. Commit e push para main
git add .
git commit -m "Deploy: descrição das mudanças"
git push origin main

# 2. GitHub Actions rodará automaticamente
# 3. Railway detectará mudanças e redeployará backend
# 4. Vercel detectará mudanças e redeployará frontend
```

---

## 📝 **PRÓXIMOS PASSOS APÓS DEPLOY**

1. **Testar funcionalidades principais**
   - Cadastro/Login
   - Criação de projetos
   - Sistema de matches
   - Perfis públicos

2. **Configurar domínio customizado** (opcional)
   - Railway permite domínio customizado
   - Vercel permite domínio customizado grátis

3. **Melhorias** (veja CHECKLIST-RFC.md)
   - Notificações em tempo real
   - Sistema de comentários
   - Painel admin
   - Conformidade LGPD

---

## 📞 **SUPORTE**

Se encontrar problemas:

1. Verifique os logs (Railway/Vercel)
2. Verifique variáveis de ambiente
3. Teste localmente primeiro
4. Verifique documentação dos serviços (Railway/Vercel)

---

**✅ A aplicação ESTÁ PRONTA para deploy!**

Siga este guia passo a passo e sua aplicação estará no ar em minutos. 🚀




# 🚀 Guia Completo de Deploy

## ✅ **STATUS ATUAL**

A aplicação **ESTÁ EM PRODUÇÃO** e funcionando!

### 📊 **Arquitetura Atual:**

- ✅ **Backend**: Azure App Service (deploy automático via GitHub Actions)
- ✅ **Frontend**: Vercel (deploy automático)
- ✅ **Banco de Dados**: Azure Database for PostgreSQL
- ✅ **CI/CD**: GitHub Actions configurado
- ✅ **Análise de Código**: SonarCloud

### 📚 **Documentação de Referência:**

- **[azure-deploy-guide.md](./azure-deploy-guide.md)** - Guia completo de deploy no Azure
- **[AZURE-VARIAVEIS-AMBIENTE.md](./AZURE-VARIAVEIS-AMBIENTE.md)** - Variáveis de ambiente necessárias
- **[AZURE-CONFIGURAR-CREDENTIALS.md](./AZURE-CONFIGURAR-CREDENTIALS.md)** - Configuração de credenciais Azure

---

## 🎯 **ARQUITETURA ATUAL**

### **Backend - Azure App Service**
- URL: `https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net`
- Deploy automático via GitHub Actions
- Configuração: Ver **[azure-deploy-guide.md](./azure-deploy-guide.md)**

### **Frontend - Vercel**
- URL: `https://portfolio-catolica-sc.vercel.app`
- Deploy automático via GitHub Actions
- Variável de ambiente: `VITE_API_URL` apontando para o backend Azure

### **Banco de Dados - Azure Database for PostgreSQL**
- Gerenciado pelo Azure
- Migrações executadas via endpoint `/api/admin/run-migrations`

---

## 🔧 **CONFIGURAÇÃO**

### 1. **Variáveis de Ambiente - Backend (Azure App Service)**

Consulte **[AZURE-VARIAVEIS-AMBIENTE.md](./AZURE-VARIAVEIS-AMBIENTE.md)** para a lista completa de variáveis.

Principais variáveis:
- `DATABASE_URL` - String de conexão do PostgreSQL
- `JWT_SECRET` e `JWT_REFRESH_SECRET` - Secrets para autenticação
- `FRONTEND_URL` - URL do frontend (Vercel)
- `MIGRATION_TOKEN` - Token para executar migrações

### 2. **Variáveis de Ambiente - Frontend (Vercel)**

No dashboard do Vercel, configure:

```env
VITE_API_URL=https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/api
```

### 3. **Executar Migrações do Banco de Dados**

Após configurar o banco, execute as migrações:

```bash
# Via navegador (mais fácil):
https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/api/admin/run-migrations?token=SEU_MIGRATION_TOKEN

# Ou via PowerShell:
Invoke-RestMethod -Uri "https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/api/admin/run-migrations" -Method POST -Headers @{"x-migration-token"="SEU_MIGRATION_TOKEN"}
```

### 4. **CORS - Configuração**

O backend já está configurado para aceitar requisições do frontend. Verifique que:

- `FRONTEND_URL` no backend corresponda à URL do frontend
- CORS está habilitado com `credentials: true`

---

## 🚀 **PROCESSO DE DEPLOY**

O deploy é **automático** via GitHub Actions. Ao fazer push para a branch `main`:

1. **Backend**: GitHub Actions faz deploy automático para Azure App Service
2. **Frontend**: GitHub Actions faz deploy automático para Vercel
3. **Testes**: Testes são executados antes do deploy

### **Deploy Manual (se necessário)**

Consulte **[azure-deploy-guide.md](./azure-deploy-guide.md)** para instruções detalhadas de deploy manual.

---

## 🔍 **VERIFICAÇÕES PÓS-DEPLOY**

### 1. **Health Check**
```bash
# Backend
curl https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/health

# Deve retornar:
# { "status": "ok", "timestamp": "..." }
```

### 2. **Testar Endpoints**
```bash
# Testar registro
curl -X POST https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#","name":"Test User","consentAccepted":true}'

# Testar login
curl -X POST https://startup-collab-backend-atdbbrdyhvgednge.canadacentral-01.azurewebsites.net/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"Test123!@#"}'
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
- **Azure**: App Service → Monitoring → Log stream
- **Vercel**: Dashboard → Deployments → View Logs
- **GitHub Actions**: Actions tab → Ver logs dos workflows

### **Métricas**
- Azure App Service mostra CPU, memória, requisições
- Vercel mostra visitas, bandwidth
- SonarCloud mostra qualidade de código e cobertura de testes

### **Alertas**
Configure alertas para:
- Falhas de deploy
- Erros de aplicação
- Uso alto de recursos

---

## 🐛 **TROUBLESHOOTING COMUM**

### **Backend não inicia**
- Verifique variáveis de ambiente no Azure App Service
- Verifique conexão com banco de dados
- Veja logs no Azure App Service → Log stream

### **CORS Error**
- Verifique `FRONTEND_URL` no Azure App Service (deve ser `https://portfolio-catolica-sc.vercel.app`)
- Verifique `VITE_API_URL` no Vercel (deve apontar para o backend Azure)

### **500 Error no backend**
- Verifique logs no Azure App Service
- Verifique se banco está acessível
- Verifique se migrações foram executadas (`/api/admin/run-migrations`)

### **404 no frontend**
- Verifique se `vercel.json` está correto
- Verifique rotas do React Router

### **Build falha**
- Verifique dependências (`npm install`)
- Verifique Node.js version (deve ser 18+)
- Verifique logs do GitHub Actions

---

## 🔄 **DEPLOY CONTÍNUO**

O CI/CD está configurado no GitHub Actions. Ele:

1. **Roda testes** antes de deployar (backend e frontend)
2. **Faz deploy do backend** para Azure App Service
3. **Faz deploy do frontend** para Vercel
4. **Executa análise SonarCloud** para qualidade de código

Para fazer deploy:

```bash
# 1. Commit e push para main
git add .
git commit -m "Deploy: descrição das mudanças"
git push origin main

# 2. GitHub Actions rodará automaticamente
# 3. Azure App Service receberá o deploy do backend
# 4. Vercel receberá o deploy do frontend
```

---

## 📝 **PRÓXIMOS PASSOS**

1. **Testar funcionalidades principais**
   - Cadastro/Login
   - Criação de projetos
   - Sistema de matches
   - Perfis públicos

2. **Configurar domínio customizado** (opcional)
   - Azure App Service permite domínio customizado
   - Vercel permite domínio customizado grátis

3. **Melhorias** (veja CHECKLIST-RFC.md)
   - Notificações em tempo real (já implementado com Socket.io)
   - Sistema de comentários
   - Painel admin
   - Conformidade LGPD

---

## 📞 **SUPORTE**

Se encontrar problemas:

1. Verifique os logs (Azure App Service / Vercel)
2. Verifique variáveis de ambiente
3. Teste localmente primeiro
4. Verifique documentação dos serviços (Azure / Vercel)
5. Consulte **[azure-deploy-guide.md](./azure-deploy-guide.md)** para mais detalhes

---

**✅ A aplicação ESTÁ EM PRODUÇÃO e funcionando!** 🚀




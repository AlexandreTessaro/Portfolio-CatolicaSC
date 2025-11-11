# ⚡ Azure Quick Start - 5 Passos Rápidos

## 🎯 Você está aqui:
✅ GitHub Education aprovado  
✅ $100 de crédito Azure disponível  
⏭️ Próximo: Deploy no Azure  

---

## 📋 **RESUMO DOS 5 PASSOS:**

### 1️⃣ **Ativar Crédito Azure** (2 min)
- https://education.github.com/pack → Ativar "Azure for Students"
- https://azure.microsoft.com/free/students/ → Criar conta (sem cartão!)

### 2️⃣ **Criar PostgreSQL** (5 min)
- Portal: https://portal.azure.com
- Criar → "Azure Database for PostgreSQL"
- Plano: **B1ms** (GRÁTIS 12 meses)
- Anotar connection string

### 3️⃣ **Criar Web App** (10 min)
- Portal → Criar → "Web App"
- Runtime: **Node 18 LTS**
- Plano: **F1** (FREE)
- Configurar variáveis de ambiente
- Conectar GitHub para deploy automático

### 4️⃣ **Executar Migrações** (2 min)
```bash
curl -X POST https://seu-app.azurewebsites.net/api/admin/run-migrations \
  -H "x-migration-token: SEU_TOKEN"
```

### 5️⃣ **Configurar Vercel** (2 min)
- Vercel → Settings → Environment Variables
- Adicionar: `VITE_API_URL=https://seu-app.azurewebsites.net/api`

---

## 🔗 **Links Importantes:**

- **Portal Azure**: https://portal.azure.com
- **GitHub Education**: https://education.github.com/pack
- **Guia Completo**: Veja `AZURE-DEPLOY-AGORA.md`

---

## ⚠️ **IMPORTANTE:**

1. **Gerar Secrets JWT:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
   ```
   Execute 2x para JWT_SECRET e JWT_REFRESH_SECRET

2. **Gerar MIGRATION_TOKEN:**
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```

3. **Variáveis de Ambiente no Azure:**
   - `PORT=8080` (Azure usa 8080, não 5000)
   - `FRONTEND_URL` = URL do seu Vercel
   - `DATABASE_URL` = Connection string do PostgreSQL

---

## 🐛 **Problemas Comuns:**

**App não inicia?**
→ Vá em "Log stream" no App Service para ver erros

**Erro de conexão com banco?**
→ Verifique firewall do PostgreSQL (permitir Azure services)

**CORS Error?**
→ Verifique se `FRONTEND_URL` está correto

---

**✅ Total: ~20 minutos para ter tudo funcionando!**

**📖 Guia detalhado**: `AZURE-DEPLOY-AGORA.md`


# ✅ Próximos Passos - Você está quase lá!

## 🎉 O que você JÁ FEZ:

✅ App Service criado (`startup-collab-backend`)  
✅ Variáveis de ambiente configuradas  
✅ PostgreSQL criado (`startup-collab-db`)  
✅ Status: Ready  

---

## 🚀 **O QUE FAZER AGORA (em ordem):**

### 1️⃣ **Configurar Firewall do PostgreSQL** (2 minutos) ⚠️ IMPORTANTE

O PostgreSQL precisa permitir conexões do App Service:

1. No PostgreSQL (`startup-collab-db`), vá em **"Networking"** (no menu lateral)
2. Em **"Firewall rules"**, você verá opções:
   - **"Allow Azure services and resources to access this server"**: ✅ **Ative esta opção**
   - **"Add current client IP address"**: Clique para adicionar seu IP (opcional, para testar localmente)
3. Clique em **"Save"**

**Por que isso é importante?** Sem isso, o App Service não conseguirá conectar ao banco!

---

### 2️⃣ **Verificar DATABASE_URL** (1 minuto)

Vejo que você tem `DATABASE_URL` configurado. Verifique se está correto:

**Formato esperado:**
```
postgresql://alexandre:senha@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

**Se você usa Azure AD**, pode precisar usar variáveis individuais em vez de `DATABASE_URL`:
- `DB_HOST=startup-collab-db.postgres.database.azure.com`
- `DB_PORT=5432`
- `DB_USER=alexandre` (ou `al.vieira@catolicasc.edu.br` se usar Azure AD)
- `DB_NAME=postgres`
- `DB_SSL=true`

---

### 3️⃣ **Configurar Deploy via GitHub** (3 minutos)

1. No App Service (`startup-collab-backend`), vá em **"Deployment"** → **"Deployment Center"**
2. Configure:
   - **Source**: **GitHub**
   - **Organization**: Seu usuário GitHub
   - **Repository**: `Portfolio-CatolicaSC` (ou nome do seu repo)
   - **Branch**: `main`
   - **Build provider**: **App Service build service**
3. Clique em **"Save"**
4. Azure vai pedir autorização no GitHub - **autorize**
5. O deploy começará automaticamente!

**Ou faça deploy manual:**
- Vá em **"Deployment Center"** → **"Manual deploy"**
- Faça upload do código

---

### 4️⃣ **Aguardar Deploy** (5-10 minutos)

- Vá em **"Deployment Center"** para ver o progresso
- Aguarde até ver **"Success"** ou **"Active"**

---

### 5️⃣ **Executar Migrações** (2 minutos)

Após o deploy, execute as migrações:

1. Obtenha a URL do App Service:
   - No App Service, vá em **"Overview"**
   - Copie a **URL** (ex: `https://startup-collab-backend.azurewebsites.net`)

2. Execute as migrações:
   ```bash
   curl -X POST https://startup-collab-backend.azurewebsites.net/api/admin/run-migrations \
     -H "x-migration-token: 2f5b58186a0d802d78316f160bbc77239f7479eae3b299ee7bace59762e1e742"
   ```

   (Use o `MIGRATION_TOKEN` que você configurou)

3. Verifique se funcionou:
   ```bash
   curl https://startup-collab-backend.azurewebsites.net/health
   ```

   Deve retornar:
   ```json
   {"success":true,"message":"API funcionando corretamente",...}
   ```

---

### 6️⃣ **Configurar Frontend (Vercel)** (2 minutos)

No Vercel:

1. Vá para seu projeto
2. **Settings** → **Environment Variables**
3. Adicione ou atualize:
   ```env
   VITE_API_URL=https://startup-collab-backend.azurewebsites.net/api
   ```
4. Faça um novo deploy no Vercel

---

### 7️⃣ **Testar Tudo** (5 minutos)

**Backend:**
```bash
# Health check
curl https://startup-collab-backend.azurewebsites.net/health

# Testar registro
curl -X POST https://startup-collab-backend.azurewebsites.net/api/users/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"test123","name":"Test"}'
```

**Frontend:**
- Acesse sua URL do Vercel
- Teste fazer login
- Verifique se as requisições funcionam

---

## 🐛 **Se Algo Der Errado:**

### App não inicia:
- Vá em **"Monitoring"** → **"Log stream"** no App Service
- Veja os erros em tempo real

### Erro de conexão com banco:
- Verifique se o firewall do PostgreSQL está configurado (Passo 1)
- Verifique se `DATABASE_URL` está correto
- Veja os logs do App Service

### CORS Error:
- Verifique se `FRONTEND_URL` está correto
- Deve ser exatamente: `https://portfolio-catolica-sc.vercel.app` (sem barra no final)

---

## ✅ **Checklist Final:**

- [ ] Firewall do PostgreSQL configurado
- [ ] DATABASE_URL ou variáveis DB_* corretas
- [ ] Deploy via GitHub configurado
- [ ] Deploy concluído com sucesso
- [ ] Migrações executadas
- [ ] Health check funcionando
- [ ] Frontend configurado no Vercel
- [ ] Testes realizados

---

**🚀 Comece pelo Passo 1 (Firewall) - é o mais importante!**

Se tiver dúvidas em qualquer passo, me avise! 😊


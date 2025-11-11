# 🔧 Corrigir Timeout do Azure App Service

## ❌ **Problema:**

O Azure está matando o processo porque não há output por 60 segundos:
```
Command 'starter.sh npm start' was aborted due to no output nor CPU activity for 60 seconds.
```

## ✅ **Solução 1: Aumentar Timeout no Azure (RECOMENDADO)**

### No Portal Azure:

1. Vá para o **App Service** (`startup-collab-backend`)
2. Vá em **"Configuration"** → **"Application settings"**
3. Clique em **"+ New application setting"**
4. Adicione:
   - **Name**: `SCM_COMMAND_IDLE_TIMEOUT`
   - **Value**: `600` (10 minutos em segundos)
5. Clique em **"OK"** e depois **"Save"**

### Ou via Azure CLI:

```powershell
az webapp config appsettings set `
  --resource-group startup-collab-rg `
  --name startup-collab-backend `
  --settings SCM_COMMAND_IDLE_TIMEOUT=600
```

---

## ✅ **Solução 2: Adicionar Keep-Alive no Código**

Adicione um heartbeat periódico no `backend/index.js` para manter o processo ativo:

```javascript
// Após iniciar o servidor, adicione:
setInterval(() => {
  console.log('💓 Heartbeat - Servidor ativo');
}, 30000); // A cada 30 segundos
```

---

## ✅ **Solução 3: Usar PM2 (Produção)**

Instale PM2 e configure para manter o processo vivo:

1. Adicione PM2 ao `package.json`:
```json
{
  "scripts": {
    "start": "node index.js",
    "start:pm2": "pm2 start index.js --no-daemon"
  }
}
```

2. Configure o Azure para usar PM2:
   - No Azure → **Configuration** → **General settings**
   - **Startup Command**: `npm run start:pm2`

---

## 🚀 **Recomendação:**

**Use a Solução 1** (aumentar timeout) - é mais simples e não requer mudanças no código.

Depois de configurar, faça um novo deploy ou reinicie o App Service.


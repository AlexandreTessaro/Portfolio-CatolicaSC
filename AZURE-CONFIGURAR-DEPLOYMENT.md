# ⚙️ Configurar Deployment Center no Azure

## ❌ **Problema:**

O Azure está tentando fazer build do frontend (que não precisa, pois já está no Vercel).

## ✅ **Solução: Configurar Deployment Center Corretamente**

### 1. No Azure App Service:

1. Vá para o App Service (`startup-collab-backend`)
2. Vá em **"Deployment"** → **"Deployment Center"**
3. Verifique a configuração:

### 2. Configuração Correta:

**Source:**
- ✅ **GitHub** (não "Local Git" ou "External Git")

**Settings:**
- **Organization**: Seu usuário GitHub (ex: `AlexandreTessaro`)
- **Repository**: `Portfolio-CatolicaSC`
- **Branch**: `main`
- **Build provider**: ✅ **"GitHub Actions"** (não "App Service build service")

### 3. Se estiver usando "App Service build service":

Isso faz build automático a partir da raiz, o que causa o erro.

**Mude para "GitHub Actions"** para usar o workflow `.github/workflows/deploy-azure.yml` que já está configurado corretamente.

---

## 🔧 **Alternativa: Configurar Build Command**

Se precisar usar "App Service build service":

1. No App Service → **"Configuration"** → **"General settings"**
2. Em **"Startup Command"**, configure:
   ```
   cd backend && npm install --production && npm start
   ```
3. Ou crie um arquivo `.deployment` na raiz:
   ```
   [config]
   SCM_DO_BUILD_DURING_DEPLOYMENT=false
   ```

---

## ✅ **Recomendação:**

**Use GitHub Actions** (já configurado):
- ✅ Mais controle
- ✅ Apenas backend é deployado
- ✅ Frontend fica no Vercel (como deve ser)

---

## 🚀 **Após Configurar:**

1. Salve as configurações
2. Faça um novo commit e push
3. O workflow do GitHub Actions será executado
4. Apenas o backend será deployado

---

**💡 O workflow `.github/workflows/deploy-azure.yml` já está correto - só precisa garantir que o Azure está usando ele!**


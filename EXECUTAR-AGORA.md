# 🚀 Executar Agora - Gerar Credenciais Azure

## ✅ **Você já tem Azure CLI instalado!**

Agora execute estes comandos **no PowerShell** (no diretório do projeto):

---

## 📋 **Passo a Passo:**

### 1. **Adicione Azure CLI ao PATH** (se necessário):

Se o comando `az` não funcionar, adicione ao PATH:

```powershell
$env:PATH += ";C:\Program Files (x86)\Microsoft SDKs\Azure\CLI2\wbin"
```

**Ou reinicie o PowerShell** após instalar o Azure CLI.

### 2. **Navegue até o projeto** (se ainda não estiver lá):

```powershell
cd "C:\Users\alexa\OneDrive\Área de Trabalho\Portfolio-CatolicaSC"
```

### 3. **Faça login no Azure:**

```powershell
az login
```

Isso vai abrir o navegador para você autenticar.

### 4. **Obtenha o Subscription ID:**

```powershell
az account show --query id --output tsv
```

**Copie o ID que aparecer!** Você vai precisar dele.

### 5. **Liste os Resource Groups** (para saber qual usar):

```powershell
az group list --output table
```

**Anote o nome do Resource Group** (ex: `startup-collab-rg`)

### 6. **Crie o Service Principal:**

Substitua `SUBSCRIPTION_ID` pelo ID obtido no passo 4 e `RESOURCE_GROUP` pelo nome do Resource Group:

```powershell
az ad sp create-for-rbac `
  --name "github-actions-startup-collab" `
  --role contributor `
  --scopes "/subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP" `
  --sdk-auth
```

**⚠️ IMPORTANTE:** Isso vai gerar um JSON completo. **COPIE TODO O JSON!**

---

## 📝 **Exemplo Completo:**

Se seu Subscription ID for `12345678-1234-1234-1234-123456789012` e seu Resource Group for `startup-collab-rg`:

```powershell
az ad sp create-for-rbac `
  --name "github-actions-startup-collab" `
  --role contributor `
  --scopes "/subscriptions/12345678-1234-1234-1234-123456789012/resourceGroups/startup-collab-rg" `
  --sdk-auth
```

---

## ✅ **Depois de obter o JSON:**

1. **Copie o JSON completo** gerado
2. **Vá para o GitHub:**
   - https://github.com/AlexandreTessaro/Portfolio-CatolicaSC/settings/secrets/actions
3. **Clique em "New repository secret"**
4. **Name:** `AZURE_CREDENTIALS`
5. **Secret:** Cole o JSON completo
6. **Clique em "Add secret"**

---

## 🔄 **Reexecutar o Workflow:**

Depois de adicionar o secret:
1. Vá em **Actions** no GitHub
2. Clique no workflow que falhou
3. Clique em **"Re-run jobs"** → **"Re-run failed jobs"**

---

**💡 Dica:** Se você não souber o nome do Resource Group, execute `az group list --output table` para ver todos.


# 🔐 Configurar Azure Credentials no GitHub

## ❌ **Erro Atual:**

```
Login failed with Error: Using auth-type: SERVICE_PRINCIPAL. 
Not all values are present. Ensure 'client-id' and 'tenant-id' are supplied.
```

## 🔍 **Causa:**

O secret `AZURE_CREDENTIALS` não está configurado no GitHub ou está no formato incorreto.

---

## ✅ **Solução: Gerar e Configurar Credenciais**

### **Passo 1: Instalar Azure CLI (se necessário)**

**📍 ONDE EXECUTAR:** No **PowerShell** ou **Terminal** do Windows.

**Se o Azure CLI não estiver instalado:**

1. **Baixe e instale:**
   - Acesse: https://aka.ms/installazurecliwindows
   - Baixe o instalador `.msi`
   - Execute e instale (aceite os padrões)

2. **Ou instale via PowerShell (como Administrador):**
   ```powershell
   # Abra PowerShell como Administrador e execute:
   Invoke-WebRequest -Uri https://aka.ms/installazurecliwindows -OutFile .\AzureCLI.msi
   Start-Process msiexec.exe -Wait -ArgumentList '/I AzureCLI.msi /quiet'
   ```

3. **Reinicie o terminal** após a instalação

4. **Verifique se instalou:**
   ```powershell
   az --version
   ```

---

### **Passo 2: Gerar Service Principal no Azure**

**📍 ONDE EXECUTAR:** No **PowerShell** (no diretório do projeto ou qualquer lugar).

**Opção A: Usar o script PowerShell (RECOMENDADO)**

Execute no PowerShell (no diretório do projeto):

```powershell
.\gerar-azure-credentials-simples.ps1
```

O script vai:
- Verificar se Azure CLI está instalado
- Fazer login no Azure
- Obter Subscription ID automaticamente
- Perguntar o nome do Resource Group
- Gerar o JSON completo

**Opção B: Executar comandos manualmente**

```powershell
# 1. Login no Azure (abre navegador para autenticar)
az login

# 2. Obter Subscription ID
az account show --query id --output tsv

# 3. Criar Service Principal (substitua SUBSCRIPTION_ID e RESOURCE_GROUP)
az ad sp create-for-rbac `
  --name "github-actions-startup-collab" `
  --role contributor `
  --scopes /subscriptions/SUBSCRIPTION_ID/resourceGroups/RESOURCE_GROUP `
  --sdk-auth
```

**⚠️ IMPORTANTE:** 
- Use **crase (`)** ao invés de barra invertida (`\`) no PowerShell
- Substitua `SUBSCRIPTION_ID` pelo ID obtido no passo 2
- Substitua `RESOURCE_GROUP` pelo nome do seu Resource Group (ex: `startup-collab-rg`)

**Isso vai gerar um JSON como este:**

```json
{
  "clientId": "xxxx-xxxx-xxxx-xxxx",
  "clientSecret": "xxxx-xxxx-xxxx-xxxx",
  "subscriptionId": "xxxx-xxxx-xxxx-xxxx",
  "tenantId": "xxxx-xxxx-xxxx-xxxx",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**⚠️ IMPORTANTE**: Copie este JSON completo! Você precisará dele no próximo passo.

---

### **Passo 3: Configurar no GitHub Secrets**

1. **Acesse o GitHub:**
   - Vá para: https://github.com/AlexandreTessaro/Portfolio-CatolicaSC
   - Clique em **"Settings"** (no topo do repositório)
   - No menu lateral, vá em **"Secrets and variables"** → **"Actions"**

2. **Adicionar Secret:**
   - Clique em **"New repository secret"**
   - **Name**: `AZURE_CREDENTIALS`
   - **Secret**: Cole o **JSON completo** gerado no Passo 2
   - Clique em **"Add secret"**

---

### **Passo 4: Verificar Subscription ID e Resource Group**

**📍 ONDE EXECUTAR:** No **PowerShell**.

Se você não souber o Subscription ID ou Resource Group:

```powershell
# Listar todas as subscriptions
az account list --output table

# Ou obter a subscription atual
az account show --query "{SubscriptionId:id, Name:name}" --output table

# Listar Resource Groups
az group list --output table
```

**Ou encontre no Portal Azure:**
- **Subscription ID**: Portal Azure → Clique no seu nome (canto superior direito) → Veja "Subscription ID"
- **Resource Group**: Portal Azure → "Resource groups" → Veja o nome do grupo (ex: `startup-collab-rg`)

---

## 🔧 **Alternativa: Usar Managed Identity (Mais Simples)**

Se preferir uma abordagem mais simples, você pode usar **Managed Identity**:

### **No Azure App Service:**

1. Vá para o App Service (`startup-collab-backend`)
2. Vá em **"Identity"** (no menu lateral)
3. Na aba **"System assigned"**:
   - Ative **"Status"** → **"On"**
   - Clique em **"Save"**
4. Copie o **Object (principal) ID** que aparece

### **No GitHub Workflow:**

Atualize o workflow para usar Managed Identity (mais simples, mas requer configuração adicional).

---

## 📋 **Formato do Secret:**

O secret `AZURE_CREDENTIALS` deve ser um **JSON completo** com todas as propriedades:

```json
{
  "clientId": "...",
  "clientSecret": "...",
  "subscriptionId": "...",
  "tenantId": "...",
  "activeDirectoryEndpointUrl": "https://login.microsoftonline.com",
  "resourceManagerEndpointUrl": "https://management.azure.com/",
  "activeDirectoryGraphResourceId": "https://graph.windows.net/",
  "sqlManagementEndpointUrl": "https://management.core.windows.net:8443/",
  "galleryEndpointUrl": "https://gallery.azure.com/",
  "managementEndpointUrl": "https://management.core.windows.net/"
}
```

**⚠️ NÃO** coloque apenas `client-id` e `tenant-id`. Precisa ser o JSON completo!

---

## 🚀 **Após Configurar:**

1. **Salve o secret** no GitHub
2. **Reexecute o workflow** no GitHub Actions:
   - Vá em **"Actions"**
   - Clique no workflow que falhou
   - Clique em **"Re-run jobs"** → **"Re-run failed jobs"**

---

## 🐛 **Troubleshooting:**

### Erro: "Subscription not found"
- Verifique se o Subscription ID está correto
- Verifique se você tem permissões na subscription

### Erro: "Insufficient permissions"
- O Service Principal precisa da role **"Contributor"** no Resource Group
- Execute o comando novamente com `--role contributor`

### Erro: "Invalid credentials"
- Verifique se copiou o JSON completo
- Verifique se não há espaços extras ou quebras de linha

---

## ✅ **Checklist:**

- [ ] Azure CLI instalado e configurado (`az login`)
- [ ] Service Principal criado
- [ ] JSON completo copiado
- [ ] Secret `AZURE_CREDENTIALS` adicionado no GitHub
- [ ] Workflow reexecutado

---

**💡 Dica**: Se não tiver Azure CLI instalado, você pode criar o Service Principal pelo portal Azure também, mas é mais complexo.


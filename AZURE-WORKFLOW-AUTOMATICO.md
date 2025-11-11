# 🔧 Corrigir Workflow Automático do Azure

## ❌ **Problema:**

O Azure criou automaticamente um workflow chamado **"Build and deploy Node.js app to Azure Web App - startup-collab-backend"** que está tentando fazer build do frontend.

## 🔍 **O que aconteceu:**

Quando você conectou o Azure ao GitHub via Deployment Center, o Azure criou automaticamente um workflow no repositório. Esse workflow está tentando executar o script `build` do `package.json` raiz, que faz build do frontend.

## ✅ **Solução:**

### Opção 1: Editar o Workflow Automático (Recomendado)

1. No GitHub, vá para **"Actions"**
2. Procure pelo workflow **"Build and deploy Node.js app to Azure Web App - startup-collab-backend"**
3. Clique nele
4. Clique em **"Edit workflow"** (ou encontre o arquivo `.github/workflows/azure-webapps-node.yml`)
5. Edite para fazer deploy apenas do backend:

```yaml
name: Build and deploy Node.js app to Azure Web App - startup-collab-backend

on:
  push:
    branches:
      - main
  workflow_dispatch:

jobs:
  build:
    runs-on: 'ubuntu-latest'
    steps:
    - uses: actions/checkout@v2
    
    - name: Set up Node.js version
      uses: actions/setup-node@v4
      with:
        node-version: '18'
    
    - name: Install dependencies
      working-directory: ./backend
      run: npm ci
    
    - name: Deploy to Azure Web App
      id: deploy-to-webapp
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'startup-collab-backend'
        package: './backend'
        startup-command: 'npm start'
```

**Mudanças importantes:**
- ✅ `working-directory: ./backend` no install
- ✅ `package: './backend'` no deploy
- ❌ Removido o build do frontend

### Opção 2: Desabilitar e Usar Workflow Customizado

1. No Azure Deployment Center, **"Disconnect"** do GitHub
2. Reconecte, mas desta vez escolha **"Use an existing workflow"**
3. Selecione o workflow `.github/workflows/deploy-azure.yml`

### Opção 3: Deletar Workflow Automático

1. No GitHub, vá para **".github/workflows"**
2. Delete o arquivo `azure-webapps-node.yml` (ou nome similar)
3. O Azure usará o workflow customizado

---

## 🚀 **Após Corrigir:**

1. Faça commit das mudanças
2. O workflow será executado novamente
3. Agora apenas o backend será deployado

---

**💡 Dica**: O workflow automático do Azure geralmente está em `.github/workflows/azure-webapps-node-*.yml`


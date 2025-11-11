# 🔧 Corrigir Erro de Build no Azure

## ❌ **Erro Atual:**

```
sh: 1: vite: not found
Error: Process completed with exit code 127.
```

## 🔍 **Causa:**

O Azure está tentando executar o script `build` do `package.json` raiz, que tenta fazer build do frontend, mas as dependências do frontend não foram instaladas.

## ✅ **Solução:**

### Opção 1: Configurar Azure para não fazer build automático

No Azure App Service:

1. Vá em **"Deployment Center"**
2. Vá em **"Settings"** ou **"Configuration"**
3. Desative **"Build automation"** ou configure para não executar build
4. Ou configure o **"Build command"** para vazio: `""`

### Opção 2: Usar apenas o backend (Recomendado)

O workflow `.github/workflows/deploy-azure.yml` já está configurado corretamente para fazer deploy apenas do backend.

**Verifique se:**
- O Azure está configurado para usar **GitHub Actions** (não build automático)
- O workflow está sendo executado corretamente

### Opção 3: Criar script de build específico para backend

Crie um arquivo `backend/build.sh`:

```bash
#!/bin/bash
npm ci --production
```

E configure o Azure para usar este script.

---

## 🚀 **Solução Rápida:**

1. No Azure App Service → **"Deployment Center"**
2. Verifique se está usando **"GitHub Actions"** como source
3. Se estiver usando **"Local Git"** ou **"External Git"**, mude para **"GitHub"**
4. Configure para usar o workflow `.github/workflows/deploy-azure.yml`

---

## 📋 **Verificar Configuração:**

No Azure App Service → **"Deployment Center"**:

- **Source**: Deve ser **"GitHub"**
- **Organization**: Seu usuário GitHub
- **Repository**: `Portfolio-CatolicaSC`
- **Branch**: `main`
- **Build provider**: **"GitHub Actions"** (não "App Service build service")

---

## ✅ **Após Corrigir:**

1. Faça um novo commit e push
2. O workflow do GitHub Actions será executado
3. Apenas o backend será deployado (sem tentar build do frontend)

---

**💡 Dica**: O frontend já está no Vercel, então não precisa fazer build no Azure!


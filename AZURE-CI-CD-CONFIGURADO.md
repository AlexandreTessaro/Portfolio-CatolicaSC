# ✅ CI/CD Configurado para Azure

## 🎉 **O que foi ajustado:**

### 1. **Workflow do Azure Corrigido** ✅

Arquivo: `.github/workflows/deploy-azure.yml`

**Mudanças:**
- ✅ Nome atualizado para corresponder ao que o Azure espera
- ✅ Faz deploy **apenas do backend** (não tenta build do frontend)
- ✅ Usa `npm ci --production` (instala apenas dependências de produção)
- ✅ Job name: `build-and-deploy` (padrão do Azure)

### 2. **Workflow Automático Criado** ✅

Arquivo: `.github/workflows/azure-webapps-node.yml`

Este é o workflow que o Azure cria automaticamente. Agora já está configurado corretamente:
- ✅ Faz deploy apenas do backend
- ✅ Não tenta build do frontend

### 3. **CI/CD Principal Atualizado** ✅

Arquivo: `.github/workflows/ci-cd.yml`

**Mudanças:**
- ✅ Removido deploy do backend (agora é feito pelo workflow do Azure)
- ✅ Mantido deploy do frontend no Vercel
- ✅ Adicionado `needs` para executar após testes
- ✅ Usa variável de ambiente `VITE_API_URL` do secret

### 4. **Arquivos de Configuração** ✅

Criados:
- `.deployment` - Configuração para Azure não fazer build automático
- `backend/.deployment` - Configuração específica do backend

---

## 🚀 **Como Funciona Agora:**

### Quando você faz push na `main`:

1. **CI/CD Pipeline** (`.github/workflows/ci-cd.yml`):
   - ✅ Roda testes do backend
   - ✅ Roda testes do frontend
   - ✅ Roda linting
   - ✅ Faz build e deploy do frontend no Vercel

2. **Deploy Azure** (`.github/workflows/deploy-azure.yml`):
   - ✅ Instala dependências do backend
   - ✅ Faz deploy do backend no Azure
   - ✅ **NÃO tenta build do frontend**

---

## ⚙️ **Configuração no Azure:**

No Azure Deployment Center, certifique-se de que:

- **Source**: GitHub ✅
- **Build provider**: GitHub Actions ✅
- **Workflow**: `.github/workflows/deploy-azure.yml` ou `.github/workflows/azure-webapps-node.yml`

---

## 🔐 **Secrets Necessários no GitHub:**

No GitHub → Settings → Secrets and variables → Actions:

- `AZURE_CREDENTIALS` - Credenciais do Azure (obtido via `az ad sp create-for-rbac`)
- `VITE_API_URL` (opcional) - URL do backend para build do frontend
- `VERCEL_TOKEN` (opcional) - Para deploy automático no Vercel

---

## ✅ **Próximos Passos:**

1. **Faça commit e push** das mudanças
2. O workflow do Azure será executado automaticamente
3. Verifique em **GitHub Actions** se está funcionando
4. Verifique no **Azure** se o deploy foi bem-sucedido

---

## 🐛 **Se Ainda Der Erro:**

1. No Azure Deployment Center, clique em **"Disconnect"**
2. Reconecte e escolha **"Use an existing workflow"**
3. Selecione: `.github/workflows/deploy-azure.yml`
4. Salve

---

**✅ Tudo configurado! Agora é só fazer commit e push!**


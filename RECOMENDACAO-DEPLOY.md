# 🏆 Recomendação de Deploy - Azure

## ✅ **Por que Azure é a MELHOR opção para você:**

1. ✅ **$100 grátis** com GitHub Student Pack
2. ✅ **Sem necessidade de cartão de crédito**
3. ✅ **Azure App Service** - Muito fácil (similar ao Koyeb)
4. ✅ **Azure Database for PostgreSQL** - Gerenciado e confiável
5. ✅ **Integração perfeita** com Vercel (seu frontend)
6. ✅ **Deploy automático** via GitHub Actions

---

## 🚀 **Passos Rápidos para Começar:**

### 1. Ativar Crédito Azure (2 minutos)
- Acesse: https://education.github.com/pack
- Ative o **Azure for Students**
- Receba $100 grátis sem cartão!

### 2. Criar Banco PostgreSQL (5 minutos)
- Portal: https://portal.azure.com
- Criar → "Azure Database for PostgreSQL"
- Plano: **B1ms** (GRÁTIS por 12 meses!)

### 3. Deploy Backend (10 minutos)
- Portal: https://portal.azure.com
- Criar → "Web App"
- Configurar variáveis de ambiente
- Deploy via GitHub Actions (automático)

### 4. Configurar Vercel (2 minutos)
- Adicionar variável: `VITE_API_URL=https://seu-app.azurewebsites.net/api`

**Total: ~20 minutos para ter tudo funcionando!**

---

## 📚 **Guias Criados:**

1. **[azure-deploy-guide.md](./azure-deploy-guide.md)** - Guia completo passo a passo
2. **[deploy-alternativas.md](./deploy-alternativas.md)** - Outras opções (Google Cloud, Vultr, IBM)
3. **[.github/workflows/deploy-azure.yml](./.github/workflows/deploy-azure.yml)** - CI/CD automático

---

## 💰 **Custos:**

### Primeiro Ano (Free Tier):
- ✅ **App Service F1**: Grátis
- ✅ **PostgreSQL B1ms**: Grátis
- **Total**: **$0/mês** 🎉

### Após Free Tier (com $100 crédito):
- **App Service Basic B1**: ~$13/mês
- **PostgreSQL B1ms**: ~$25/mês
- **Total**: ~$38/mês
- **Com $100 crédito**: Dura ~2-3 meses grátis!

---

## 🎯 **Próximos Passos:**

1. **Leia o guia**: [azure-deploy-guide.md](./azure-deploy-guide.md)
2. **Ative o crédito**: https://education.github.com/pack
3. **Siga o passo a passo** do guia
4. **Deploy automático** via GitHub Actions

---

## ⚠️ **Importante:**

- Azure App Service usa porta **8080** (não 5000)
- Configure `PORT=8080` nas variáveis de ambiente
- Ou ajuste o código para: `const PORT = Number(process.env.PORT) || 8080`

---

**✅ Tudo pronto! Siga o guia Azure e você terá deploy em 20 minutos!**




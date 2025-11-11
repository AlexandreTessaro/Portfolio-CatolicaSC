# 🚀 Deploy Instructions

## ✅ **APLICAÇÃO PRONTA PARA DEPLOY!**

Consulte o **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** para instruções completas e detalhadas.

## 📋 **Resumo Rápido**

### 🏆 **Opção 1: Azure (Recomendado para Estudantes)**

✅ **$100 grátis** com GitHub Student Pack (sem cartão!)  
✅ **Mais fácil** de usar  
✅ **Azure App Service** - Similar ao Koyeb  

Consulte **[azure-deploy-guide.md](./azure-deploy-guide.md)** para instruções completas.

**Arquitetura Azure:**
- **Backend**: Azure App Service
- **Frontend**: Vercel (já configurado ✅)
- **Banco de Dados**: Azure Database for PostgreSQL

### **Opção 2: Outras Plataformas**

Consulte **[deploy-alternativas.md](./deploy-alternativas.md)** para:
- Google Cloud ($300 grátis)
- Vultr (muito barato)
- IBM Cloud ($200 grátis)

### **Opção 3: Railway + Vercel (Legado)**

Configuração anterior mantida para referência:

- **Backend**: Railway (legado)
- **Frontend**: Vercel (legado)

## ⚠️ **IMPORTANTE - ANTES DO DEPLOY**

1. **Configure variáveis de ambiente** nos dashboards (AWS/Railway/Vercel)
2. **Remova credenciais** de arquivos commitados (já feito ✅)
3. **Gere secrets JWT fortes** para produção
4. **Execute migrações** no banco de produção

## 📚 **Documentação Completa**

- **[azure-deploy-guide.md](./azure-deploy-guide.md)** - Guia completo Azure 🏆 **RECOMENDADO**
- **[deploy-alternativas.md](./deploy-alternativas.md)** - Google Cloud, Vultr, IBM Cloud
- **[aws-deploy-guide.md](./aws-deploy-guide.md)** - Guia AWS (se preferir)
- **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** - Guia geral de deploy
- **[.deploy-checklist](./.deploy-checklist)** - Checklist de verificação

## 🔒 **Segurança**

⚠️ **CRÍTICO**: Nunca commite credenciais no código!
- Use variáveis de ambiente nos dashboards
- Use AWS Secrets Manager para secrets sensíveis
- Remova secrets do `render.yaml` (já feito ✅)

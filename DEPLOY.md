# 🚀 Deploy Instructions

## ✅ **APLICAÇÃO PRONTA PARA DEPLOY!**

Consulte o **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** para instruções completas e detalhadas.

## 📋 **Resumo Rápido**

### Backend (Railway) ✅
- ✅ Backend já está deployado no Railway
- **URL**: `https://portfolio-backend-production-a492.up.railway.app`
- **Health Check**: `https://portfolio-backend-production-a492.up.railway.app/health`

### Frontend (Vercel) 🔧
- ✅ Configuração pronta, falta apenas fazer o deploy
- **Passos**:
  1. Conectar repositório ao Vercel
  2. Configurar `VITE_API_URL` no dashboard
  3. Deploy automático!

## ⚠️ **IMPORTANTE - ANTES DO DEPLOY**

1. **Configure variáveis de ambiente** nos dashboards (Railway/Vercel)
2. **Remova credenciais** de arquivos commitados (já feito ✅)
3. **Gere secrets JWT fortes** para produção
4. **Execute migrações** no banco de produção

## 📚 **Documentação Completa**

- **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** - Guia completo passo a passo
- **[.deploy-checklist](./.deploy-checklist)** - Checklist de verificação

## 🔒 **Segurança**

⚠️ **CRÍTICO**: Nunca commite credenciais no código!
- Use variáveis de ambiente nos dashboards
- Remova secrets do `render.yaml` (já feito ✅)

# 🚀 Deploy Instructions

## Backend (Railway) ✅
O backend está funcionando perfeitamente no Railway!

### URL da API:
- **Railway URL**: `https://portfolio-backend-production-a492.up.railway.app`
- **Health Check**: `https://portfolio-backend-production-a492.up.railway.app/health`
- **API Endpoints**: `https://portfolio-backend-production-a492.up.railway.app/api`

## Frontend (Vercel) 🔧

### 1. Configurar Variáveis de Ambiente no Vercel:

1. Acesse o dashboard do Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione:
   ```
   VITE_API_URL = https://portfolio-backend-production-a492.up.railway.app/api
   ```

### 2. Deploy no Vercel:

1. Conecte o repositório GitHub ao Vercel
2. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
3. Deploy!

### 3. Testar Integração:

- Frontend: `https://your-vercel-app.vercel.app`
- API: `https://portfolio-backend-production-a492.up.railway.app/api`

## 🔧 Configuração Atual:

- ✅ **Backend**: Railway (funcionando)
- ✅ **Database**: Supabase (conectado)
- ✅ **Frontend**: Vercel (pronto para deploy)
- ✅ **CORS**: Configurado para aceitar frontend

## 📝 Próximos Passos:

1. **Obter URL do Railway** do dashboard
2. **Atualizar VITE_API_URL** no Vercel
3. **Fazer deploy** do frontend
4. **Testar integração** completa

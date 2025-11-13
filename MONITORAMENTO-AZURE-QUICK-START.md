# 🚀 Quick Start: Azure Application Insights

## Passo 1: Criar Recurso no Azure

1. Acesse [Azure Portal](https://portal.azure.com)
2. Clique em "Criar um recurso"
3. Busque por "Application Insights"
4. Clique em "Criar"
5. Preencha:
   - **Nome**: `startup-collab-backend-insights`
   - **Tipo de aplicativo**: Node.js
   - **Região**: Mesma do seu App Service (Canadá Central)
   - **Tipo de recurso**: Application Insights
6. Clique em "Revisar + criar" → "Criar"

## Passo 2: Obter Connection String

1. Após criar, vá para o recurso Application Insights
2. Na seção **Configurar**, clique em **Connection String**
3. Copie a Connection String completa (começa com `InstrumentationKey=`)

## Passo 3: Configurar no Azure App Service

1. Vá para seu App Service (`startup-collab-backend`)
2. No menu lateral, clique em **Configuration**
3. Em **Application settings**, clique em **+ New application setting**
4. Adicione:

   **Nome**: `MONITORING_PROVIDER`  
   **Valor**: `applicationinsights`

   **Nome**: `APPLICATIONINSIGHTS_CONNECTION_STRING`  
   **Valor**: Cole a Connection String copiada

5. Clique em **Save**
6. Clique em **Continue** para aplicar as mudanças

## Passo 4: Verificar Instalação

1. Faça deploy do código atualizado
2. Acesse algumas rotas da API
3. Aguarde 2-3 minutos
4. Volte ao Application Insights
5. No menu lateral, clique em **Live Metrics** ou **Transaction search**
6. Você deve ver as requisições sendo rastreadas

## ✅ Pronto!

Agora você tem monitoramento completo:
- 📊 Métricas de performance
- 🔍 Traces de requisições
- ⚠️ Alertas de erros
- 📈 Dashboards em tempo real

## 📊 Dashboards Úteis

- **Live Metrics**: Métricas em tempo real
- **Transaction search**: Buscar requisições específicas
- **Performance**: Análise de performance
- **Failures**: Erros e exceções
- **Metrics**: Métricas customizadas

## 🔔 Configurar Alertas

1. No Application Insights, vá em **Alerts**
2. Clique em **+ Create** → **Alert rule**
3. Configure alertas para:
   - Taxa de falha > 5%
   - Tempo de resposta > 1s
   - Disponibilidade < 99%


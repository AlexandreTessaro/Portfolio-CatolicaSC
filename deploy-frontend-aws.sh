#!/bin/bash
set -e

# Script de deploy do frontend para AWS S3 + CloudFront
# Uso: ./deploy-frontend-aws.sh

echo "🚀 Iniciando deploy do frontend para AWS..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Variáveis (configure conforme necessário)
BUCKET_NAME="${AWS_S3_BUCKET:-startup-collab-frontend}"
DISTRIBUTION_ID="${AWS_CLOUDFRONT_DISTRIBUTION_ID:-}"
BACKEND_URL="${AWS_BACKEND_URL:-}"

# Verificar se variáveis estão configuradas
if [ -z "$BACKEND_URL" ]; then
    echo -e "${RED}❌ Erro: AWS_BACKEND_URL não configurado${NC}"
    echo "Configure: export AWS_BACKEND_URL=https://seu-app-runner-url"
    exit 1
fi

if [ -z "$DISTRIBUTION_ID" ]; then
    echo -e "${YELLOW}⚠️  AVISO: AWS_CLOUDFRONT_DISTRIBUTION_ID não configurado${NC}"
    echo "O cache do CloudFront não será invalidado"
fi

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não está instalado${NC}"
    echo "Instale: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar se está no diretório correto
if [ ! -d "frontend" ]; then
    echo -e "${RED}❌ Erro: diretório 'frontend' não encontrado${NC}"
    echo "Execute este script da raiz do projeto"
    exit 1
fi

# Build do frontend
echo -e "${GREEN}📦 Construindo frontend...${NC}"
cd frontend

# Instalar dependências se necessário
if [ ! -d "node_modules" ]; then
    echo "📥 Instalando dependências..."
    npm install
fi

# Build com variável de ambiente
echo "🔨 Executando build..."
export VITE_API_URL="${BACKEND_URL}/api"
npm run build

if [ ! -d "dist" ]; then
    echo -e "${RED}❌ Erro: build falhou (diretório dist não encontrado)${NC}"
    exit 1
fi

# Upload para S3
echo -e "${GREEN}📤 Fazendo upload para S3 (${BUCKET_NAME})...${NC}"
aws s3 sync dist/ s3://${BUCKET_NAME} --delete

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Upload concluído com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro no upload para S3${NC}"
    exit 1
fi

# Invalidar cache do CloudFront (se configurado)
if [ ! -z "$DISTRIBUTION_ID" ]; then
    echo -e "${GREEN}🔄 Invalidando cache do CloudFront...${NC}"
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id ${DISTRIBUTION_ID} \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Cache invalidation criada: ${INVALIDATION_ID}${NC}"
        echo "⏳ Aguarde alguns minutos para a invalidação ser processada"
    else
        echo -e "${YELLOW}⚠️  Aviso: Falha ao invalidar cache do CloudFront${NC}"
    fi
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído com sucesso!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. Verifique o site no CloudFront"
echo "   2. Teste as funcionalidades principais"
echo "   3. Verifique logs se houver problemas"
echo ""



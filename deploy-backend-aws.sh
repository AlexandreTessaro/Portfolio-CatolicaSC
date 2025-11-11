#!/bin/bash
set -e

# Script de deploy do backend para AWS (App Runner ou ECS)
# Uso: ./deploy-backend-aws.sh [apprunner|ecs]

echo "🚀 Iniciando deploy do backend para AWS..."

# Cores para output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Verificar argumento
DEPLOY_TYPE="${1:-apprunner}"

if [ "$DEPLOY_TYPE" != "apprunner" ] && [ "$DEPLOY_TYPE" != "ecs" ]; then
    echo -e "${RED}❌ Tipo de deploy inválido: ${DEPLOY_TYPE}${NC}"
    echo "Uso: ./deploy-backend-aws.sh [apprunner|ecs]"
    exit 1
fi

# Variáveis (configure conforme necessário)
AWS_REGION="${AWS_REGION:-us-east-1}"
ECR_REPOSITORY="${AWS_ECR_REPOSITORY:-startup-collab-backend}"
ACCOUNT_ID="${AWS_ACCOUNT_ID:-}"

# Verificar se AWS CLI está instalado
if ! command -v aws &> /dev/null; then
    echo -e "${RED}❌ AWS CLI não está instalado${NC}"
    echo "Instale: https://aws.amazon.com/cli/"
    exit 1
fi

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo -e "${RED}❌ Docker não está instalado${NC}"
    echo "Instale: https://www.docker.com/get-started"
    exit 1
fi

# Obter Account ID se não configurado
if [ -z "$ACCOUNT_ID" ]; then
    echo "🔍 Obtendo Account ID da AWS..."
    ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
    if [ -z "$ACCOUNT_ID" ]; then
        echo -e "${RED}❌ Erro: Não foi possível obter Account ID${NC}"
        echo "Configure AWS credentials: aws configure"
        exit 1
    fi
    echo -e "${GREEN}✅ Account ID: ${ACCOUNT_ID}${NC}"
fi

ECR_URI="${ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPOSITORY}"

# Verificar se está no diretório correto
if [ ! -d "backend" ]; then
    echo -e "${RED}❌ Erro: diretório 'backend' não encontrado${NC}"
    echo "Execute este script da raiz do projeto"
    exit 1
fi

# Login no ECR
echo -e "${GREEN}🔐 Fazendo login no ECR...${NC}"
aws ecr get-login-password --region ${AWS_REGION} | \
    docker login --username AWS --password-stdin ${ECR_URI}

# Verificar se repositório existe, criar se não existir
echo "🔍 Verificando repositório ECR..."
if ! aws ecr describe-repositories --repository-names ${ECR_REPOSITORY} --region ${AWS_REGION} &> /dev/null; then
    echo -e "${YELLOW}⚠️  Repositório não encontrado. Criando...${NC}"
    aws ecr create-repository \
        --repository-name ${ECR_REPOSITORY} \
        --region ${AWS_REGION} \
        --image-scanning-configuration scanOnPush=true
    echo -e "${GREEN}✅ Repositório criado${NC}"
fi

# Build da imagem Docker
echo -e "${GREEN}📦 Construindo imagem Docker...${NC}"
cd backend
docker build -t ${ECR_REPOSITORY}:latest .

# Tag da imagem
echo "🏷️  Tagging imagem..."
docker tag ${ECR_REPOSITORY}:latest ${ECR_URI}:latest

# Push para ECR
echo -e "${GREEN}📤 Enviando imagem para ECR...${NC}"
docker push ${ECR_URI}:latest

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Imagem enviada com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao enviar imagem${NC}"
    exit 1
fi

# Deploy baseado no tipo
if [ "$DEPLOY_TYPE" == "apprunner" ]; then
    echo ""
    echo -e "${GREEN}🚀 Deploy no App Runner${NC}"
    echo ""
    echo "⚠️  Para fazer deploy no App Runner:"
    echo "   1. Acesse o console AWS App Runner"
    echo "   2. Selecione seu serviço"
    echo "   3. Clique em 'Deploy' ou aguarde auto-deploy"
    echo ""
    echo "   Ou use o comando:"
    echo "   aws apprunner start-deployment --service-arn <SERVICE_ARN>"
    
elif [ "$DEPLOY_TYPE" == "ecs" ]; then
    echo ""
    echo -e "${GREEN}🚀 Deploy no ECS${NC}"
    echo ""
    echo "⚠️  Para fazer deploy no ECS:"
    echo "   1. Atualize a task definition:"
    echo "      aws ecs register-task-definition --cli-input-json file://ecs-task-definition.json"
    echo ""
    echo "   2. Force novo deploy do serviço:"
    echo "      aws ecs update-service --cluster <CLUSTER> --service <SERVICE> --force-new-deployment"
fi

echo ""
echo -e "${GREEN}✅ Build e push concluídos!${NC}"
echo ""
echo "📋 Próximos passos:"
echo "   1. Complete o deploy no console AWS"
echo "   2. Verifique logs no CloudWatch"
echo "   3. Teste o health check endpoint"
echo ""



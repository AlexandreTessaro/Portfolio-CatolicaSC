#!/bin/bash

# Script de Setup - Startup Collaboration Platform
# Configura o ambiente de desenvolvimento local

echo "🚀 Configurando Startup Collaboration Platform..."

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    echo "❌ Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

echo "✅ Docker e Docker Compose encontrados"

# Configurar variáveis de ambiente do backend
echo "📝 Configurando variáveis de ambiente..."
if [ ! -f backend/.env ]; then
    cp backend/env.example backend/.env
    echo "✅ Arquivo .env criado para o backend"
else
    echo "ℹ️ Arquivo .env já existe no backend"
fi

# Configurar variáveis de ambiente do frontend
if [ ! -f frontend/.env ]; then
    cp frontend/env.example frontend/.env
    echo "✅ Arquivo .env criado para o frontend"
else
    echo "ℹ️ Arquivo .env já existe no frontend"
fi

# Instalar dependências
echo "📦 Instalando dependências..."
npm install
cd backend && npm install && cd ..
cd frontend && npm install && cd ..

# Construir e iniciar containers
echo "🐳 Iniciando containers Docker..."
docker-compose up -d --build

# Aguardar PostgreSQL estar pronto
echo "⏳ Aguardando PostgreSQL estar pronto..."
sleep 10

# Executar migrações
echo "🗄️ Executando migrações do banco de dados..."
docker-compose exec backend npm run db:migrate

# Executar seed
echo "🌱 Executando seed do banco de dados..."
docker-compose exec backend npm run db:seed

echo ""
echo "🎉 Setup concluído com sucesso!"
echo ""
echo "📋 Acesse a aplicação:"
echo "   Frontend: http://localhost:3000"
echo "   Backend API: http://localhost:5000"
echo "   Health Check: http://localhost:5000/health"
echo ""
echo "🔑 Credenciais de acesso:"
echo "   Admin: admin@startupcollab.com / admin123"
echo "   Usuários: email@startupcollab.com / password123"
echo ""
echo "🛠️ Comandos úteis:"
echo "   Parar containers: docker-compose down"
echo "   Ver logs: docker-compose logs -f"
echo "   Reiniciar: docker-compose restart"
echo ""

# Script de Setup - Startup Collaboration Platform (PowerShell)
# Configura o ambiente de desenvolvimento local

Write-Host "🚀 Configurando Startup Collaboration Platform..." -ForegroundColor Green

# Verificar se Docker está instalado
try {
    docker --version | Out-Null
    Write-Host "✅ Docker encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker não está instalado. Por favor, instale o Docker primeiro." -ForegroundColor Red
    exit 1
}

# Verificar se Docker Compose está instalado
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose encontrado" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro." -ForegroundColor Red
    exit 1
}

# Configurar variáveis de ambiente do backend
Write-Host "📝 Configurando variáveis de ambiente..." -ForegroundColor Yellow
if (!(Test-Path "backend\.env")) {
    Copy-Item "backend\env.example" "backend\.env"
    Write-Host "✅ Arquivo .env criado para o backend" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Arquivo .env já existe no backend" -ForegroundColor Blue
}

# Configurar variáveis de ambiente do frontend
if (!(Test-Path "frontend\.env")) {
    Copy-Item "frontend\env.example" "frontend\.env"
    Write-Host "✅ Arquivo .env criado para o frontend" -ForegroundColor Green
} else {
    Write-Host "ℹ️ Arquivo .env já existe no frontend" -ForegroundColor Blue
}

# Instalar dependências
Write-Host "📦 Instalando dependências..." -ForegroundColor Yellow
npm install
Set-Location backend; npm install; Set-Location ..
Set-Location frontend; npm install; Set-Location ..

# Construir e iniciar containers
Write-Host "🐳 Iniciando containers Docker..." -ForegroundColor Yellow
docker-compose up -d --build

# Aguardar PostgreSQL estar pronto
Write-Host "⏳ Aguardando PostgreSQL estar pronto..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Executar migrações
Write-Host "🗄️ Executando migrações do banco de dados..." -ForegroundColor Yellow
docker-compose exec backend npm run db:migrate

# Executar seed
Write-Host "🌱 Executando seed do banco de dados..." -ForegroundColor Yellow
docker-compose exec backend npm run db:seed

Write-Host ""
Write-Host "🎉 Setup concluído com sucesso!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Acesse a aplicação:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend API: http://localhost:5000" -ForegroundColor White
Write-Host "   Health Check: http://localhost:5000/health" -ForegroundColor White
Write-Host ""
Write-Host "🔑 Credenciais de acesso:" -ForegroundColor Cyan
Write-Host "   Admin: admin@startupcollab.com / admin123" -ForegroundColor White
Write-Host "   Usuários: email@startupcollab.com / password123" -ForegroundColor White
Write-Host ""
Write-Host "🛠️ Comandos úteis:" -ForegroundColor Cyan
Write-Host "   Parar containers: docker-compose down" -ForegroundColor White
Write-Host "   Ver logs: docker-compose logs -f" -ForegroundColor White
Write-Host "   Reiniciar: docker-compose restart" -ForegroundColor White
Write-Host ""

# Script de Configuração - PostgreSQL Local
# Configura o projeto para usar PostgreSQL local

Write-Host "🔧 Configurando PostgreSQL local..." -ForegroundColor Green

# Criar arquivo .env para o backend
$envContent = @"
# Configurações do Servidor
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000

# Configurações do Banco de Dados PostgreSQL
# Para desenvolvimento local (PostgreSQL local)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=gajseEwNF2KO0a2KfW1w
DB_NAME=portfolio-catolicasc
DB_SSL=false

# Para produção (usar DATABASE_URL)
# DATABASE_URL=postgresql://user:password@host:5432/dbname

# Configurações do Redis
REDIS_URL=redis://localhost:6379

# Configurações JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-jwt-key-change-in-production

# Configurações de Segurança
BCRYPT_SALT_ROUNDS=12

# Configurações de Email (opcional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Configurações de Log
LOG_LEVEL=info
LOG_FILE=logs/app.log
"@

# Salvar arquivo .env
$envContent | Out-File -FilePath "backend\.env" -Encoding UTF8
Write-Host "✅ Arquivo backend\.env criado com suas credenciais PostgreSQL" -ForegroundColor Green

# Criar arquivo .env para o frontend
$frontendEnvContent = @"
VITE_API_URL=http://localhost:5000/api
"@

$frontendEnvContent | Out-File -FilePath "frontend\.env" -Encoding UTF8
Write-Host "✅ Arquivo frontend\.env criado" -ForegroundColor Green

Write-Host ""
Write-Host "🎯 Configuração concluída!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Próximos passos:" -ForegroundColor Cyan
Write-Host "1. Instalar dependências: npm install" -ForegroundColor White
Write-Host "2. Executar migrações: npm run db:migrate" -ForegroundColor White
Write-Host "3. Executar seed: npm run db:seed" -ForegroundColor White
Write-Host "4. Iniciar backend: npm run dev:backend" -ForegroundColor White
Write-Host "5. Iniciar frontend: npm run dev:frontend" -ForegroundColor White
Write-Host ""
Write-Host "🔗 URLs:" -ForegroundColor Cyan
Write-Host "   Frontend: http://localhost:3000" -ForegroundColor White
Write-Host "   Backend: http://localhost:5000" -ForegroundColor White
Write-Host ""


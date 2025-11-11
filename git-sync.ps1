# Script para sincronizar com o repositório remoto
# Execute: .\git-sync.ps1

Write-Host "🔄 Sincronizando com repositório remoto..." -ForegroundColor Cyan

# Verificar se estamos no diretório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não é um repositório Git!" -ForegroundColor Red
    Write-Host "Execute este script na raiz do projeto." -ForegroundColor Yellow
    exit 1
}

# Verificar status
Write-Host "`n📊 Verificando status..." -ForegroundColor Cyan
git status

# Fazer pull
Write-Host "`n⬇️ Fazendo pull das mudanças remotas..." -ForegroundColor Cyan
$pullResult = git pull origin main 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "⚠️ Conflitos detectados ou erro no pull" -ForegroundColor Yellow
    Write-Host $pullResult
    Write-Host "`n💡 Resolva os conflitos manualmente e execute novamente." -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Pull concluído com sucesso!" -ForegroundColor Green

# Adicionar arquivos
Write-Host "`n📦 Adicionando arquivos..." -ForegroundColor Cyan
git add .

# Verificar se há mudanças para commitar
$status = git status --porcelain
if ($status) {
    Write-Host "`n💾 Fazendo commit..." -ForegroundColor Cyan
    git commit -m "fix: ajustar CI/CD para deploy Azure apenas do backend"
} else {
    Write-Host "`nℹ️ Nenhuma mudança para commitar." -ForegroundColor Yellow
}

# Fazer push
Write-Host "`n⬆️ Fazendo push..." -ForegroundColor Cyan
git push origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ Push concluído com sucesso!" -ForegroundColor Green
    Write-Host "🚀 O workflow do Azure será executado automaticamente!" -ForegroundColor Cyan
} else {
    Write-Host "`n❌ Erro no push. Verifique as mensagens acima." -ForegroundColor Red
}


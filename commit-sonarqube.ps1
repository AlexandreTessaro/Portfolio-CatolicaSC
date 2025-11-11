# Script para fazer commit e push das alterações do SonarQube
# Execute este script no PowerShell: .\commit-sonarqube.ps1

# Navegar para o diretório do projeto
$projectPath = Join-Path $env:USERPROFILE "OneDrive\Área de Trabalho\Portfolio-CatolicaSC"
Set-Location $projectPath

Write-Host "📁 Diretório: $projectPath" -ForegroundColor Cyan
Write-Host ""

# Verificar se estamos no repositório correto
if (-not (Test-Path ".git")) {
    Write-Host "❌ Erro: Não foi encontrado um repositório git neste diretório!" -ForegroundColor Red
    exit 1
}

# Adicionar arquivos do SonarQube
Write-Host "📝 Adicionando arquivos do SonarQube..." -ForegroundColor Yellow
git add backend/sonar-project.properties
git add frontend/sonar-project.properties
git add .github/workflows/sonarcloud.yml
git add backend/package.json
git add frontend/package.json
git add .gitignore
git add backend/env.example
git add GUIA-SONARQUBE.md
git add SONARQUBE-SETUP-RAPIDO.md
git add SONARCLOUD-PROXIMOS-PASSOS.md
git add README-SONARQUBE.md

# Verificar status
Write-Host ""
Write-Host "📊 Status do repositório:" -ForegroundColor Cyan
git status --short

# Fazer commit
Write-Host ""
Write-Host "💾 Fazendo commit..." -ForegroundColor Yellow
$commitMessage = "feat: implementar SonarQube/SonarCloud para análise de qualidade de código

- Adicionar configuração SonarQube para backend e frontend
- Integrar SonarCloud com GitHub Actions
- Adicionar scripts npm para análise local
- Criar documentação completa (GUIA-SONARQUBE.md, SONARQUBE-SETUP-RAPIDO.md)
- Atualizar .gitignore para arquivos do SonarQube
- Adicionar variáveis de ambiente no env.example"

git commit -m $commitMessage

# Verificar se há remote configurado
$remote = git remote -v
if ($remote) {
    Write-Host ""
    Write-Host "🚀 Fazendo push..." -ForegroundColor Yellow
    git push
    Write-Host ""
    Write-Host "✅ Commit e push realizados com sucesso!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Nenhum remote configurado. Configure um remote antes de fazer push:" -ForegroundColor Yellow
    Write-Host "   git remote add origin <url-do-repositorio>" -ForegroundColor Cyan
}


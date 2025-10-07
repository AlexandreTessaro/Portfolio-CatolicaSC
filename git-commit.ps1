# Navigate to project directory
$projectPath = "C:\Users\alexa\OneDrive\Área de Trabalho\Portfolio-CatolicaSC"
Set-Location -LiteralPath $projectPath

# Git operations
git add .
git commit -m "feat: Implementar testes para middleware de autenticação

- Adicionar 24 testes para middleware de autenticação
- Cobertura do middleware aumentada de 10.97% para 90.24%
- Testes para authenticateToken (7 testes)
- Testes para optionalAuth (6 testes)
- Testes para requireAdmin (6 testes)
- Testes para edge cases e segurança (5 testes)
- Melhorar cobertura geral dos services (90.84%)
- Melhorar cobertura dos repositories (87.27%)
- UserService com 97.15% de cobertura
- ProjectService com 92.24% de cobertura
- MatchService com 84.91% de cobertura
- Total de 173 testes passando no backend"
git push


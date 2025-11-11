# 🔧 Comandos Git para Commit e Push - SonarQube

Execute estes comandos no terminal (PowerShell ou Git Bash) **dentro do diretório do projeto**:

## 📋 Comandos

```powershell
# 1. Navegar para o diretório do projeto
cd "C:\Users\alexa\OneDrive\Área de Trabalho\Portfolio-CatolicaSC"

# 2. Adicionar arquivos do SonarQube
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

# 3. Verificar o que será commitado
git status

# 4. Fazer commit
git commit -m "feat: implementar SonarQube/SonarCloud para análise de qualidade de código

- Adicionar configuração SonarQube para backend e frontend
- Integrar SonarCloud com GitHub Actions
- Adicionar scripts npm para análise local
- Criar documentação completa (GUIA-SONARQUBE.md, SONARQUBE-SETUP-RAPIDO.md)
- Atualizar .gitignore para arquivos do SonarQube
- Adicionar variáveis de ambiente no env.example"

# 5. Fazer push
git push
```

## 🚀 Alternativa: Usar o Script PowerShell

Se preferir, execute o script que foi criado:

```powershell
cd "C:\Users\alexa\OneDrive\Área de Trabalho\Portfolio-CatolicaSC"
.\commit-sonarqube.ps1
```

---

**Nota:** Se você estiver usando Git Bash ao invés de PowerShell, use os mesmos comandos, mas sem o `.\` no script.


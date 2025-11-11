# 🔍 Guia de Configuração - SonarQube / SonarCloud

Este guia mostra como configurar e usar o SonarQube/SonarCloud para análise de qualidade de código no projeto.

---

## 📋 O que é SonarQube?

O SonarQube é uma plataforma de análise estática de código que:
- 🔍 Detecta bugs, vulnerabilidades e code smells
- 📊 Mede cobertura de testes
- 🎯 Avalia qualidade técnica do código
- 📈 Fornece métricas de manutenibilidade
- 🔒 Identifica problemas de segurança

---

## 🚀 Opção 1: SonarCloud (Recomendado - Gratuito)

SonarCloud é a versão cloud do SonarQube, gratuita para projetos open-source.

### Passo 1: Criar Conta no SonarCloud

1. Acesse: https://sonarcloud.io
2. Faça login com sua conta GitHub
3. Autorize o acesso ao SonarCloud

### Passo 2: Criar Organização

1. No SonarCloud, clique em "Create Organization"
2. Escolha um nome (ex: `seu-usuario-github`)
3. Selecione o plano **Free** (gratuito para open-source)

### Passo 3: Adicionar Projeto

1. Clique em "Analyze a project"
2. Selecione seu repositório GitHub
3. O SonarCloud criará automaticamente os projetos:
   - `startup-collab-backend`
   - `startup-collab-frontend`

### Passo 4: Obter Token

1. Vá em **My Account** → **Security**
2. Gere um novo token (ex: `sonarcloud-token`)
3. **Copie o token** (não será exibido novamente!)

### Passo 5: Configurar Secrets no GitHub

1. No GitHub, vá em **Settings** → **Secrets and variables** → **Actions**
2. Adicione os seguintes secrets:

```
SONAR_TOKEN=<seu-token-do-sonarcloud>
SONAR_ORGANIZATION=<nome-da-sua-organizacao>
```

**Exemplo:**
```
SONAR_TOKEN=abc123def456...
SONAR_ORGANIZATION=seu-usuario-github
```

### Passo 6: Verificar Workflow

O workflow `.github/workflows/sonarcloud.yml` já está configurado e será executado automaticamente em:
- Push para `main` ou `develop`
- Pull Requests para `main` ou `develop`

---

## 🖥️ Opção 2: SonarQube Self-Hosted

Se preferir instalar o SonarQube localmente ou em servidor próprio.

### Instalação Local (Docker)

```bash
# Criar docker-compose.yml para SonarQube
cat > docker-compose.sonar.yml << EOF
version: '3.8'

services:
  sonarqube:
    image: sonarqube:community
    container_name: sonarqube
    ports:
      - "9000:9000"
    environment:
      - SONAR_ES_BOOTSTRAP_CHECKS_DISABLE=true
    volumes:
      - sonarqube_data:/opt/sonarqube/data
      - sonarqube_extensions:/opt/sonarqube/extensions
      - sonarqube_logs:/opt/sonarqube/logs

volumes:
  sonarqube_data:
  sonarqube_extensions:
  sonarqube_logs:
EOF

# Iniciar SonarQube
docker-compose -f docker-compose.sonar.yml up -d
```

### Acessar SonarQube

1. Abra: http://localhost:9000
2. Login padrão: `admin` / `admin`
3. Altere a senha na primeira vez

### Criar Projeto Manualmente

1. Vá em **Projects** → **Create Project**
2. Escolha **Manually**
3. Project Key: `startup-collab-backend`
4. Display Name: `Startup Collab Platform - Backend`
5. Gere um token para o projeto

### Configurar para Análise Local

```bash
# Instalar SonarScanner
# Windows (via Chocolatey)
choco install sonarscanner-msbuild-net46

# Ou baixar de: https://docs.sonarqube.org/latest/analysis/scan/sonarscanner/
```

---

## 🧪 Executar Análise Localmente

### Backend

```bash
cd backend

# Gerar cobertura de testes primeiro
npm test -- --coverage

# Executar análise SonarQube
npm run sonar

# Ou para SonarQube local
npm run sonar:local
```

### Frontend

```bash
cd frontend

# Gerar cobertura de testes primeiro
npm run test:coverage

# Executar análise SonarQube
npm run sonar

# Ou para SonarQube local
npm run sonar:local
```

---

## 📊 Entendendo os Resultados

### Métricas Principais

1. **Reliability (Confiabilidade)**
   - Bugs encontrados
   - Meta: 0 bugs

2. **Security (Segurança)**
   - Vulnerabilidades
   - Security Hotspots
   - Meta: 0 vulnerabilidades

3. **Maintainability (Manutenibilidade)**
   - Code Smells
   - Technical Debt
   - Meta: < 5% de technical debt

4. **Coverage (Cobertura)**
   - Cobertura de testes
   - Meta: > 80%

5. **Duplications (Duplicações)**
   - Código duplicado
   - Meta: < 3%

### Quality Gate

O Quality Gate verifica se o código atende aos critérios mínimos:
- ✅ **Passed**: Código aprovado
- ❌ **Failed**: Código precisa de melhorias

---

## 🔧 Configuração Avançada

### Ajustar Regras de Qualidade

Edite `sonar-project.properties`:

```properties
# Ajustar limites de cobertura
sonar.coverage.exclusions=**/*.test.js,**/__tests__/**

# Ajustar regras de duplicação
sonar.cpd.minimumtokens=50

# Excluir mais arquivos
sonar.exclusions+=**/vendor/**,**/node_modules/**
```

### Quality Gate Personalizado

No SonarCloud/SonarQube:
1. Vá em **Quality Gates**
2. Crie um novo Quality Gate
3. Configure condições:
   - Coverage > 80%
   - Duplications < 3%
   - Bugs = 0
   - Vulnerabilities = 0

---

## 🐛 Troubleshooting

### Erro: "SONAR_TOKEN not found"

**Solução:**
1. Verifique se o secret `SONAR_TOKEN` está configurado no GitHub
2. Verifique se o nome está correto (case-sensitive)

### Erro: "Organization not found"

**Solução:**
1. Verifique se o secret `SONAR_ORGANIZATION` está configurado
2. Use o nome exato da organização no SonarCloud

### Erro: "Coverage report not found"

**Solução:**
1. Execute testes com cobertura primeiro:
   ```bash
   npm test -- --coverage
   ```
2. Verifique se o arquivo `coverage/lcov.info` existe
3. Verifique o caminho em `sonar-project.properties`

### Análise não aparece no SonarCloud

**Solução:**
1. Verifique os logs do GitHub Actions
2. Verifique se o workflow foi executado
3. Aguarde alguns minutos (pode levar tempo para processar)

---

## 📈 Integração com Pull Requests

O SonarCloud automaticamente:
- ✅ Comenta em PRs com os resultados da análise
- ✅ Bloqueia merge se Quality Gate falhar (opcional)
- ✅ Mostra novos issues encontrados

### Configurar Bloqueio de PR

No SonarCloud:
1. Vá em **Project Settings** → **Pull Request Decoration**
2. Ative **Enable Pull Request Decoration**
3. Configure para bloquear PRs com Quality Gate falhado (opcional)

---

## 🎯 Boas Práticas

1. **Execute análise antes de fazer commit**
   ```bash
   npm run sonar
   ```

2. **Corrija issues críticos primeiro**
   - Bugs
   - Vulnerabilidades
   - Security Hotspots

3. **Mantenha cobertura alta**
   - Adicione testes para código novo
   - Meta: > 80% de cobertura

4. **Revise Code Smells regularmente**
   - Refatore código duplicado
   - Simplifique funções complexas

5. **Monitore Technical Debt**
   - Resolva dívida técnica gradualmente
   - Não deixe acumular

---

## 📚 Recursos Adicionais

- [Documentação SonarCloud](https://docs.sonarcloud.io/)
- [Documentação SonarQube](https://docs.sonarqube.org/)
- [Regras de Qualidade JavaScript](https://rules.sonarsource.com/javascript/)
- [Regras de Qualidade React](https://rules.sonarsource.com/javascript/react/)

---

## ✅ Checklist de Configuração

- [ ] Conta criada no SonarCloud (ou SonarQube instalado)
- [ ] Organização criada
- [ ] Projetos criados (backend e frontend)
- [ ] Token gerado
- [ ] Secrets configurados no GitHub
- [ ] Workflow executado com sucesso
- [ ] Análise aparecendo no SonarCloud
- [ ] Quality Gate configurado
- [ ] PR decoration ativado (opcional)

---

**Última atualização:** 2025-11-10


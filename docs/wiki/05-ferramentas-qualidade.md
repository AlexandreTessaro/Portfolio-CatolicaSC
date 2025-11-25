# 🔍 Ferramentas de Qualidade

## ESLint

### Configuração

**Backend** (`backend/eslint.config.mjs`):

```javascript
import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    rules: {
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }]
    }
  }
];
```

**Frontend** (`frontend/eslint.config.mjs`):

```javascript
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: { react },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'react/react-in-jsx-scope': 'off'
    }
  }
];
```

### Executar ESLint

```bash
# Backend
cd backend
npm run lint

# Frontend
cd frontend
npm run lint
```

---

## Prettier

### Configuração

**Backend/Frontend** (`.prettierrc` ou `package.json`):

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

### Executar Prettier

```bash
# Backend
cd backend
npm run format

# Frontend
cd frontend
npm run format
```

### Integração com Editor

**VS Code** (`.vscode/settings.json`):

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

---

## SonarCloud

### Configuração

**Backend** (`backend/sonar-project.properties`):

```properties
sonar.projectKey=startup-collab-backend
sonar.organization=your-org
sonar.sources=src
sonar.tests=src/__tests__,tests
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,coverage/**,tests/**
```

**Frontend** (`frontend/sonar-project.properties`):

```properties
sonar.projectKey=startup-collab-frontend
sonar.organization=your-org
sonar.sources=src
sonar.tests=src/__tests__
sonar.javascript.lcov.reportPaths=coverage/lcov.info
sonar.exclusions=node_modules/**,coverage/**,dist/**
```

### Executar SonarCloud

```bash
# Backend
cd backend
npm run sonar

# Frontend
cd frontend
npm run sonar
```

### Integração com CI/CD

```yaml
# .github/workflows/sonarcloud.yml
name: SonarCloud
on: [push, pull_request]
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: sonarsource/sonarcloud-github-action@master
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}
```

---

## Code Coverage

### Vitest Coverage

**Configuração** (`vitest.config.js`):

```javascript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'coverage/',
        '**/*.test.js',
        '**/*.spec.js'
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 75,
        statements: 80
      }
    }
  }
});
```

### Visualizar Coverage

```bash
# Executar testes com coverage
npm test -- --coverage

# Abrir relatório HTML
open coverage/index.html
```

---

## Padrões de Qualidade

### Níveis de Qualidade

1. **Crítico**: Erros que impedem funcionamento
2. **Alto**: Problemas que afetam performance/segurança
3. **Médio**: Melhorias de código recomendadas
4. **Baixo**: Sugestões de estilo

### Métricas Esperadas

- **Cobertura de Testes**: > 80%
- **Code Smells**: < 10 por 1000 linhas
- **Bugs**: 0 críticos
- **Vulnerabilidades**: 0 altas
- **Duplicação**: < 3%

---

## Pre-commit Hooks

### Husky (Opcional)

```bash
# Instalar Husky
npm install --save-dev husky

# Configurar
npx husky install
npx husky add .husky/pre-commit "npm run lint && npm test"
```

### Git Hooks Manuais

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm test
```

---

## Code Review Checklist

### Backend

- [ ] Código segue padrões ESLint
- [ ] Testes unitários adicionados/atualizados
- [ ] Cobertura de testes mantida (>80%)
- [ ] Validação de inputs implementada
- [ ] Tratamento de erros adequado
- [ ] Logs estruturados
- [ ] Documentação atualizada (se necessário)

### Frontend

- [ ] Componentes reutilizáveis
- [ ] Responsividade testada
- [ ] Acessibilidade considerada
- [ ] Performance otimizada
- [ ] Testes de componentes adicionados
- [ ] Tratamento de estados de loading/error

---

## Ferramentas Adicionais

### TypeScript (Futuro)

Migração gradual para TypeScript pode melhorar qualidade:

```bash
npm install --save-dev typescript @types/node
```

### Dependency Check

```bash
# Verificar dependências desatualizadas
npm outdated

# Verificar vulnerabilidades
npm audit
npm audit fix
```

### Bundle Analyzer (Frontend)

```bash
npm install --save-dev vite-bundle-visualizer
```

---

## Links Relacionados

- **[Testes](./03-testes.md)** - Estratégia de testes
- **[Especificação Técnica](./02-especificacao-tecnica.md)** - Padrões de código
- **[Voltar ao Índice](./00-indice.md)**


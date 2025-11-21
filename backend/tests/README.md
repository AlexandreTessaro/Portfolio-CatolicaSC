# 📁 Estrutura de Testes

Este diretório contém a organização completa dos testes do backend, seguindo boas práticas de desenvolvimento.

## 📂 Estrutura de Diretórios

```
tests/
├── e2e/              # Testes End-to-End (testam fluxos completos da aplicação)
├── integration/      # Testes de Integração (testam integração entre componentes)
├── manual/           # Scripts de teste manual/debugging (para desenvolvimento)
├── scripts/          # Scripts de análise, validação e utilitários
└── helpers/          # Helpers, fixtures e utilitários compartilhados
```

## 🧪 Tipos de Testes

### 1. Testes Unitários (`src/__tests__/`)
**Localização:** `src/__tests__/`

Testes unitários formais usando **Vitest**. Estes testes:
- Testam unidades individuais de código isoladamente
- Usam mocks para dependências externas
- São executados com `npm test`
- Seguem a estrutura do código fonte:
  - `config/` - Testes de configuração
  - `controllers/` - Testes de controllers
  - `domain/` - Testes de modelos de domínio
  - `middleware/` - Testes de middlewares
  - `repositories/` - Testes de repositórios
  - `services/` - Testes de serviços
  - `utils/` - Testes de utilitários
  - `integration/` - Testes de integração formais

**Executar:**
```bash
npm test              # Executa todos os testes unitários
npm run test:watch    # Modo watch
npm run test:ui       # Interface visual
npm run test:integration  # Apenas testes de integração
```

### 2. Testes E2E (`tests/e2e/`)
**Localização:** `tests/e2e/`

Testes End-to-End que testam fluxos completos da aplicação:
- Testam endpoints HTTP completos
- Requerem servidor rodando
- Testam autenticação e autorização
- Validam fluxos de negócio completos

**Exemplos:**
- `test-endpoints.mjs` - Testa endpoints de matchmaking
- `test-auth-middleware.js` - Testa middleware de autenticação
- `test-matchmaking-endpoints.js` - Testa endpoints de matchmaking
- `test-recommendation-endpoint.js` - Testa endpoint de recomendações

**Executar:**
```bash
# Inicie o servidor primeiro
npm run dev

# Em outro terminal, execute os testes
node tests/e2e/test-endpoints.mjs
```

### 3. Testes Manuais (`tests/manual/`)
**Localização:** `tests/manual/`

Scripts de teste manual para desenvolvimento e debugging:
- Testam componentes específicos isoladamente
- Úteis para debugging durante desenvolvimento
- Não são executados automaticamente
- Podem ser executados diretamente com Node.js

**Exemplos:**
- `test-match-service.js` - Testa MatchService diretamente
- `test-match-controller.mjs` - Testa MatchController isoladamente
- `test-match-repository.js` - Testa MatchRepository
- `test-project-repository.js` - Testa ProjectRepository

**Executar:**
```bash
node tests/manual/test-match-service.js
```

### 4. Scripts de Análise (`tests/scripts/`)
**Localização:** `tests/scripts/`

Scripts de análise, validação e utilitários:
- Validam dados e algoritmos
- Analisam configurações
- Testam conectividade
- Geram relatórios

**Exemplos:**
- `test-recommendation-accuracy.js` - Valida precisão do algoritmo de recomendação
- `test-synthetic-data.js` - Testa geração de dados sintéticos
- `test-connection.js` - Testa conexão com banco de dados
- `test-config.js` - Valida configurações
- `check-data.js` - Verifica dados no banco de dados
- `check-matches-table.mjs` - Verifica estrutura da tabela matches
- `check-related-tables.mjs` - Verifica tabelas relacionadas
- `check-users.mjs` - Verifica usuários no banco

**Executar:**
```bash
# Via npm scripts
npm run db:test-accuracy
npm run db:test-synthetic

# Ou diretamente
node tests/scripts/test-recommendation-accuracy.js
```

## 🎯 Boas Práticas

### Nomenclatura
- **Testes unitários:** `*.test.js` (ex: `UserService.test.js`)
- **Testes de integração:** `*.integration.test.js` (ex: `routes.integration.test.js`)
- **Scripts E2E:** `test-*.js` ou `test-*.mjs`
- **Scripts manuais:** `test-*.js` ou `test-*.mjs`
- **Scripts de análise:** `test-*.js` ou `test-*.mjs`

### Organização
- Mantenha testes próximos ao código que testam quando possível
- Use a estrutura `src/__tests__/` para testes unitários formais
- Use `tests/` para testes que não são executados automaticamente
- Agrupe testes relacionados por funcionalidade

### Cobertura
- Testes unitários devem ter alta cobertura (>80%)
- Foque em testar lógica de negócio crítica
- Use mocks para dependências externas
- Teste casos de sucesso e falha

## 📊 Cobertura de Testes

Execute para ver a cobertura:
```bash
npm test
```

A cobertura é gerada em `coverage/` e pode ser visualizada abrindo `coverage/index.html` no navegador.

## 🔧 Configuração

### Vitest (`vitest.config.js`)
- Configurado para executar testes em `src/__tests__/`
- Exclui `tests/` da cobertura (scripts manuais)
- Usa `src/__tests__/setup.js` para configuração global

### Package.json Scripts
- `test` - Executa todos os testes unitários com cobertura
- `test:watch` - Modo watch para desenvolvimento
- `test:ui` - Interface visual do Vitest
- `test:integration` - Apenas testes de integração
- `db:test-accuracy` - Testa precisão do algoritmo
- `db:test-synthetic` - Testa dados sintéticos

## 📝 Adicionando Novos Testes

### Teste Unitário
1. Crie o arquivo em `src/__tests__/[categoria]/[Nome].test.js`
2. Siga a estrutura existente
3. Use Vitest (`describe`, `it`, `expect`)
4. Execute com `npm test`

### Teste E2E
1. Crie o arquivo em `tests/e2e/test-[nome].js`
2. Use `fetch` ou `supertest` para testar endpoints
3. Certifique-se de que o servidor está rodando
4. Execute diretamente com `node`

### Script Manual
1. Crie o arquivo em `tests/manual/test-[nome].js`
2. Importe os componentes necessários
3. Execute diretamente com `node`

## 🚀 Executando Testes

```bash
# Todos os testes unitários
npm test

# Modo watch (desenvolvimento)
npm run test:watch

# Interface visual
npm run test:ui

# Apenas integração
npm run test:integration

# Testes E2E (requer servidor rodando)
node tests/e2e/test-endpoints.mjs

# Scripts manuais
node tests/manual/test-match-service.js

# Scripts de análise
npm run db:test-accuracy
```

## 📚 Referências

- [Vitest Documentation](https://vitest.dev/)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Clean Architecture Testing](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)


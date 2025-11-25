# 🧪 Testes

## Estratégia de Testes

O projeto adota uma estratégia de testes em camadas, seguindo a **pirâmide de testes**:

```
        /\
       /  \      E2E Tests (Poucos)
      /────\
     /      \    Integration Tests (Alguns)
    /────────\
   /          \  Unit Tests (Muitos)
  /────────────\
```

---

## Tipos de Testes

### 1. Testes Unitários

Testam componentes isolados (funções, classes, métodos).

**Localização**: `backend/src/__tests__/` e `frontend/src/__tests__/`

**Cobertura**:
- Controllers
- Services
- Repositories
- Domain Models
- Utils
- Components React

**Exemplo**:

```javascript
// backend/src/__tests__/services/UserService.test.js
import { describe, it, expect, beforeEach } from 'vitest';
import UserService from '../../services/UserService.js';

describe('UserService', () => {
  it('should create a user', async () => {
    const user = await userService.createUser(userData);
    expect(user).toHaveProperty('id');
    expect(user.email).toBe(userData.email);
  });
});
```

### 2. Testes de Integração

Testam a integração entre camadas (API + Banco de Dados).

**Localização**: `backend/src/__tests__/integration/`

**Cobertura**:
- Rotas da API
- Integração com banco de dados
- Middlewares
- Fluxos completos

**Exemplo**:

```javascript
// backend/src/__tests__/integration/routes.integration.test.js
import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../../app.js';

describe('POST /api/users/register', () => {
  it('should register a new user', async () => {
    const response = await request(app)
      .post('/api/users/register')
      .send({ name: 'Test', email: 'test@test.com', password: '123456' });
    
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
  });
});
```

### 3. Testes E2E (End-to-End)

Testam fluxos completos do ponto de vista do usuário.

**Localização**: `backend/tests/e2e/` e `frontend/tests/e2e/`

**Cobertura**:
- Fluxos críticos de negócio
- Autenticação completa
- Criação de projetos
- Sistema de matches

**Exemplo**:

```javascript
// backend/tests/e2e/match-flow.test.mjs
import { test } from 'vitest';

test('Complete match flow', async () => {
  // 1. Criar usuário A
  // 2. Criar usuário B
  // 3. Criar projeto por usuário A
  // 4. Usuário B solicita participação
  // 5. Usuário A aceita
  // 6. Verificar que usuário B está na equipe
});
```

---

## Ferramentas de Teste

### Backend

- **Vitest**: Framework de testes (substitui Jest)
- **Supertest**: Testes de API HTTP
- **@vitest/coverage-v8**: Cobertura de código
- **@vitest/ui**: Interface visual para testes

### Frontend

- **Vitest**: Framework de testes
- **@testing-library/react**: Testes de componentes React
- **@testing-library/jest-dom**: Matchers adicionais
- **@testing-library/user-event**: Simulação de eventos do usuário
- **jsdom**: Ambiente DOM para testes

---

## Executando Testes

### Backend

```bash
# Executar todos os testes
docker-compose exec backend npm test

# Modo watch (desenvolvimento)
docker-compose exec backend npm run test:watch

# Interface visual
docker-compose exec backend npm run test:ui

# Apenas testes de integração
docker-compose exec backend npm run test:integration

# Com cobertura
docker-compose exec backend npm test -- --coverage
```

### Frontend

```bash
# Executar todos os testes
docker-compose exec frontend npm test

# Modo watch
docker-compose exec frontend npm test -- --watch

# Interface visual
docker-compose exec frontend npm run test:ui

# Com cobertura
docker-compose exec frontend npm run test:coverage
```

### Localmente (sem Docker)

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm test
```

---

## Cobertura de Código

### Metas de Cobertura

- **Unitários**: > 80%
- **Integração**: > 70%
- **E2E**: Fluxos críticos cobertos

### Visualizando Cobertura

Após executar testes com `--coverage`, os relatórios são gerados em:

- **Backend**: `backend/coverage/`
- **Frontend**: `frontend/coverage/`

Abra `coverage/index.html` no navegador para visualizar.

### Relatório de Cobertura

```bash
# Backend
cd backend
npm test -- --coverage
open coverage/index.html

# Frontend
cd frontend
npm run test:coverage
open coverage/index.html
```

---

## Estrutura de Testes

### Backend

```
backend/
├── src/
│   └── __tests__/              # Testes unitários
│       ├── controllers/
│       ├── services/
│       ├── repositories/
│       ├── domain/
│       └── utils/
├── tests/
│   ├── e2e/                    # Testes E2E
│   ├── integration/            # Testes de integração
│   ├── manual/                 # Scripts de teste manual
│   └── scripts/                # Scripts auxiliares
└── vitest.config.js            # Configuração Vitest
```

### Frontend

```
frontend/
├── src/
│   └── __tests__/              # Testes unitários
│       ├── components/
│       ├── pages/
│       └── services/
└── vitest.config.js            # Configuração Vitest
```

---

## Configuração Vitest

### Backend (`vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'tests/', 'coverage/']
    }
  }
});
```

### Frontend (`vitest.config.js`)

```javascript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/__tests__/setup.js'
  }
});
```

---

## Mocks e Fixtures

### Mocks de Banco de Dados

```javascript
// backend/src/__tests__/setup.js
import { vi } from 'vitest';

// Mock do pool do PostgreSQL
vi.mock('../config/database.js', () => ({
  default: {
    query: vi.fn(),
    connect: vi.fn()
  }
}));
```

### Fixtures de Dados

```javascript
// backend/src/__tests__/fixtures/users.js
export const mockUser = {
  id: 1,
  name: 'Test User',
  email: 'test@test.com',
  password_hash: '$2a$10$...',
  skills: ['JavaScript', 'React']
};
```

---

## Testes de Performance

### Load Testing com Artillery

```bash
# Executar testes de carga
docker-compose exec backend npm run test:load

# Gerar relatório
docker-compose exec backend npm run test:load:report
```

**Configuração**: `backend/artillery-config.yml`

```yaml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: 'API Load Test'
    flow:
      - get:
          url: '/api/projects'
```

---

## Boas Práticas

### 1. Nomenclatura Clara

```javascript
// ✅ Bom
describe('UserService', () => {
  it('should throw error when user not found', () => {});
});

// ❌ Ruim
describe('UserService', () => {
  it('test 1', () => {});
});
```

### 2. Testes Isolados

```javascript
// ✅ Bom - Cada teste é independente
it('should create user', async () => {
  const user = await createUser(data);
  expect(user).toBeDefined();
});

// ❌ Ruim - Depende de estado anterior
it('should update user', async () => {
  // Assume que usuário já existe
  const user = await updateUser(1, data);
});
```

### 3. Arrange-Act-Assert

```javascript
// ✅ Bom
it('should calculate match score', () => {
  // Arrange
  const userSkills = ['JavaScript', 'React'];
  const projectTechs = ['JavaScript', 'Node.js'];
  
  // Act
  const score = calculateMatchScore(userSkills, projectTechs);
  
  // Assert
  expect(score).toBeGreaterThan(0);
  expect(score).toBeLessThanOrEqual(100);
});
```

### 4. Testes Determinísticos

```javascript
// ✅ Bom - Usa valores fixos
it('should validate email', () => {
  expect(validateEmail('test@test.com')).toBe(true);
});

// ❌ Ruim - Usa valores aleatórios
it('should validate email', () => {
  const email = generateRandomEmail();
  expect(validateEmail(email)).toBe(true);
});
```

---

## CI/CD Integration

### GitHub Actions

Os testes são executados automaticamente em cada push:

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: cd backend && npm install && npm test
```

---

## Troubleshooting

### Testes Falhando

1. **Verificar banco de dados**: Certifique-se de que o banco está rodando
2. **Limpar cache**: `npm test -- --no-cache`
3. **Verificar variáveis de ambiente**: `.env.test` configurado corretamente
4. **Logs detalhados**: `npm test -- --reporter=verbose`

### Cobertura Baixa

1. Identificar arquivos não cobertos no relatório
2. Adicionar testes para funções críticas primeiro
3. Aumentar gradualmente a cobertura

---

## Links Relacionados

- **[Especificação Técnica](./02-especificacao-tecnica.md)** - Stack e arquitetura
- **[Ferramentas de Qualidade](./05-ferramentas-qualidade.md)** - ESLint, Prettier
- **[Voltar ao Índice](./00-indice.md)**


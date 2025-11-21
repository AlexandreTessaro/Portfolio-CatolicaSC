# 📊 Estrutura de Testes - Visão Geral

## 📁 Organização Completa

```
backend/
├── src/
│   └── __tests__/              # ✅ Testes Unitários Formais (Vitest)
│       ├── config/              # Testes de configuração
│       ├── controllers/         # Testes de controllers
│       ├── domain/              # Testes de modelos de domínio
│       ├── integration/         # Testes de integração formais
│       ├── middleware/          # Testes de middlewares
│       ├── repositories/       # Testes de repositórios
│       ├── services/            # Testes de serviços
│       ├── utils/               # Testes de utilitários
│       ├── app.test.js          # Testes da aplicação
│       ├── basic.test.js        # Testes básicos
│       └── setup.js              # Configuração global
│
└── tests/                       # ✅ Testes Adicionais
    ├── e2e/                     # Testes End-to-End (7 arquivos)
    │   ├── test-auth-middleware.js
    │   ├── test-basic-server.js
    │   ├── test-endpoints.mjs
    │   ├── test-matches-endpoint.mjs
    │   ├── test-matchmaking-endpoints.js
    │   ├── test-recommendation-endpoint.js
    │   └── test-server.mjs
    │
    ├── integration/             # Testes de Integração (vazio - usar src/__tests__/integration/)
    │
    ├── manual/                  # Scripts de Teste Manual (14 arquivos)
    │   ├── test-can-request-detailed.js
    │   ├── test-can-request-participation.js
    │   ├── test-get-match-stats.js
    │   ├── test-match-controller-direct.js
    │   ├── test-match-controller-init.mjs
    │   ├── test-match-controller.mjs
    │   ├── test-match-repository.js
    │   ├── test-match-service-direct.mjs
    │   ├── test-match-service-methods.mjs
    │   ├── test-match-service.js
    │   ├── test-match-service.mjs
    │   ├── test-project-repository.js
    │   ├── test-req-user.js
    │   └── test-sent-matches.js
    │
    ├── scripts/                 # Scripts de Análise/Validação (17 arquivos)
    │   ├── check-data.js
    │   ├── check-matches-table.mjs
    │   ├── check-related-tables.mjs
    │   ├── check-users.mjs
    │   ├── test-accuracy-simple.js
    │   ├── test-config.js
    │   ├── test-connection.js
    │   ├── test-connectivity.js
    │   ├── test-database-import.mjs
    │   ├── test-matches-table.mjs
    │   ├── test-port-5001.mjs
    │   ├── test-recommendation-accuracy.js
    │   ├── test-recommendation-debug.js
    │   ├── test-recommendation-native.js
    │   ├── test-recommendation-simple.js
    │   ├── test-simple-data.js
    │   └── test-synthetic-data.js
    │
    ├── helpers/                 # Helpers e Fixtures (vazio - para uso futuro)
    │
    ├── README.md                # Documentação completa
    └── STRUCTURE.md             # Este arquivo
```

## 📈 Estatísticas

- **Total de arquivos organizados:** 39 arquivos
- **Testes E2E:** 7 arquivos
- **Testes Manuais:** 14 arquivos
- **Scripts de Análise:** 17 arquivos (incluindo scripts check-*)
- **Testes Unitários:** ~50+ arquivos em `src/__tests__/`

## 🎯 Categorização

### ✅ Testes Unitários (`src/__tests__/`)
- Executados automaticamente com `npm test`
- Usam Vitest
- Alta cobertura de código
- Testam unidades isoladas

### ✅ Testes E2E (`tests/e2e/`)
- Testam fluxos completos
- Requerem servidor rodando
- Testam endpoints HTTP
- Validam autenticação/autorização

### ✅ Testes Manuais (`tests/manual/`)
- Para desenvolvimento/debugging
- Testam componentes isoladamente
- Executados manualmente com `node`
- Não são executados automaticamente

### ✅ Scripts de Análise (`tests/scripts/`)
- Validam dados e algoritmos
- Analisam configurações
- Testam conectividade
- Geram relatórios

## 🔄 Mudanças Realizadas

1. ✅ Criada estrutura de pastas organizada
2. ✅ Movidos 33 arquivos de teste da raiz para estrutura organizada
3. ✅ Movidos 4 arquivos `check-*` para `tests/scripts/`
4. ✅ Atualizados imports em todos os arquivos movidos
5. ✅ Atualizado `vitest.config.js` para excluir `tests/` da cobertura
6. ✅ Atualizado `package.json` com novos caminhos
7. ✅ Criada documentação completa (`README.md`)

## 📝 Próximos Passos (Opcional)

- [ ] Adicionar helpers compartilhados em `tests/helpers/`
- [ ] Criar fixtures de teste reutilizáveis
- [ ] Adicionar testes E2E automatizados com Playwright/Cypress
- [ ] Configurar CI/CD para executar testes E2E
- [ ] Adicionar testes de performance em `tests/performance/`


# 📁 Scripts - Documentação

Esta pasta contém todos os scripts utilitários do backend, organizados por categoria.

## 📂 Estrutura

```
scripts/
├── dev/                    # Scripts de desenvolvimento e debugging
├── seeds/                   # Scripts de seed e geração de dados
├── database/                # Scripts de banco de dados e migrações SQL
├── migrate.js              # Script principal de migração
├── data-manager.js         # Gerenciador de dados
├── examples.js             # Exemplos de uso
├── test-audit.js           # Testes de auditoria
└── README-SYNTHETIC-DATA.md # Documentação de dados sintéticos
```

## 🛠️ Scripts de Desenvolvimento (`dev/`)

Scripts úteis para desenvolvimento e debugging:

- **`debug-script.js`** - Script de debug para inserção de usuário de teste
- **`list-projects.js`** - Lista todos os projetos do banco
- **`simulate-server-behavior.js`** - Simula comportamento do servidor para testes

**Executar:**
```bash
node scripts/dev/debug-script.js
node scripts/dev/list-projects.js
node scripts/dev/simulate-server-behavior.js
```

## 🌱 Scripts de Seed (`seeds/`)

Scripts para popular o banco de dados com dados de teste:

- **`seed.js`** - Seed principal (dados básicos)
- **`generate-synthetic-data.js`** - Gera dados sintéticos em volume
- **`generate-realistic-data.js`** - Gera dados realistas
- **`generate-simple-data.js`** - Gera dados simples
- **`generate-working-data.js`** - Gera dados funcionais
- **`generate-scalable-data.js`** - Gera dados escaláveis
- **`generate-scale-data.js`** - Gera dados em escala
- **`insert-data.js`** - Insere dados básicos
- **`simple-seed.js`** - Seed simples alternativo

**Executar via npm:**
```bash
npm run db:seed              # Seed principal
npm run db:seed-synthetic    # Dados sintéticos
npm run db:seed-realistic    # Dados realistas
npm run db:seed-simple       # Dados simples
npm run db:seed-working      # Dados funcionais
npm run db:seed-scalable     # Dados escaláveis
npm run db:insert-data       # Inserir dados básicos
```

**Executar diretamente:**
```bash
node scripts/seeds/seed.js
node scripts/seeds/generate-synthetic-data.js
```

## 🗄️ Scripts de Banco de Dados (`database/`)

Scripts para criação e manutenção de tabelas:

- **`create-matches-table.js`** - Cria tabela de matches
- **`create-user-connections-table.sql`** - SQL para tabela de conexões
- **`create_matches_table.sql`** - SQL para tabela de matches
- **`add-lgpd-columns.sql`** - Adiciona colunas LGPD

**Executar:**
```bash
node scripts/database/create-matches-table.js
```

## 📋 Scripts Principais

### Migração (`migrate.js`)
Script principal para executar migrações do banco de dados.

```bash
npm run db:migrate
# ou
node scripts/migrate.js
```

### Gerenciador de Dados (`data-manager.js`)
Utilitário para gerenciar dados do banco.

```bash
npm run db:clear      # Limpar dados
npm run db:stats      # Estatísticas
npm run db:users      # Listar usuários
npm run db:projects   # Listar projetos
npm run db:matches    # Listar matches
npm run db:export     # Exportar dados
```

### Exemplos (`examples.js`)
Exemplos de uso dos scripts de seed.

```bash
node scripts/examples.js desenvolvimento
node scripts/examples.js testes
node scripts/examples.js personalizado
node scripts/examples.js workflow
node scripts/examples.js todos
```

## 📚 Documentação Adicional

- **`README-SYNTHETIC-DATA.md`** - Documentação completa sobre geração de dados sintéticos

## 🔄 Mudanças Recentes

A estrutura foi reorganizada para melhor organização:
- Scripts de desenvolvimento movidos para `dev/`
- Scripts de seed consolidados em `seeds/`
- Scripts de banco organizados em `database/`
- Todos os imports atualizados
- `package.json` atualizado com novos caminhos

## 💡 Dicas

- Use `npm run` para executar scripts via package.json
- Scripts de seed podem ser combinados para diferentes cenários
- Use `data-manager.js` para gerenciar dados durante desenvolvimento
- Consulte `examples.js` para ver exemplos práticos


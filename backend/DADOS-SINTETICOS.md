# 📊 Dados Sintéticos - Startup Collaboration

## ✅ Status: Funcionando!

O sistema de geração de dados sintéticos está funcionando perfeitamente. Dados foram inseridos com sucesso no banco PostgreSQL.

## 📈 Dados Atuais no Banco

- **👥 Usuários**: 17 (incluindo 3 novos usuários sintéticos)
- **🚀 Projetos**: 8 (incluindo 2 novos projetos sintéticos)
- **🤝 Solicitações de Colaboração**: 4 (incluindo 3 novas solicitações)

## 🔑 Credenciais de Acesso

### Usuários Sintéticos Criados:
- **João Silva**: `joao.silva@startupcollab.com` / `password123`
- **Maria Santos**: `maria.santos@startupcollab.com` / `password123`
- **Pedro Costa**: `pedro.costa@startupcollab.com` / `password123`

### Projetos Sintéticos Criados:
1. **EcoTracker** - Monitoramento de Pegada de Carbono (Desenvolvimento)
2. **LearnFlow** - Plataforma de Aprendizado (Planejamento)

## 🚀 Scripts Disponíveis

### Scripts Funcionais:
```bash
# Inserir dados sintéticos (RECOMENDADO)
npm run db:insert-data

# Verificar conexão e dados
node test-connection.js

# Teste simples de inserção
node test-simple-data.js
```

### Scripts Experimentais:
```bash
# Scripts que podem ter problemas de performance
npm run db:seed-synthetic
npm run db:seed-realistic
npm run db:seed-simple
npm run db:seed-working
```

## 📋 Estrutura dos Dados

### Usuários
- Nomes realistas brasileiros
- Emails baseados nos nomes
- Bios profissionais
- Skills em JSON array
- Senhas hash com bcrypt

### Projetos
- Títulos descritivos
- Descrições detalhadas
- Objetivos em JSON array
- Tecnologias em JSON array
- Status: idea, planning, development, testing, launched
- Categorias: sustainability, education, healthcare, fintech, ecommerce

### Solicitações de Colaboração
- Mensagens personalizadas
- Status: pending, accepted, rejected
- Relacionamento entre usuários e projetos

## 🛠️ Como Usar

### 1. Gerar Novos Dados
```bash
cd backend
npm run db:insert-data
```

### 2. Verificar Dados
```bash
node test-connection.js
```

### 3. Limpar Dados (se necessário)
```bash
npm run db:clear
```

## 📊 Tabelas do Banco

- `users` - Usuários do sistema
- `projects` - Projetos de colaboração
- `collaboration_requests` - Solicitações de colaboração
- `matches` - Tabela legada (não utilizada)
- `messages` - Mensagens entre usuários
- `notifications` - Notificações do sistema
- `audit_logs` - Logs de auditoria

## 🔧 Configuração do Banco

- **Host**: localhost
- **Port**: 5432
- **Database**: portfolio-catolicasc
- **User**: postgres
- **Status**: ✅ Conectado e funcionando

## 📝 Arquivos Criados

1. `insert-data.js` - Script principal funcional
2. `test-connection.js` - Verificação de conexão
3. `test-simple-data.js` - Teste básico
4. `debug-script.js` - Debug de problemas
5. `scripts/generate-*.js` - Scripts experimentais
6. `scripts/data-manager.js` - Gerenciador de dados
7. `scripts/README-SYNTHETIC-DATA.md` - Documentação completa

## 🎯 Próximos Passos

1. **Testar a aplicação** com os dados sintéticos
2. **Personalizar dados** editando `insert-data.js`
3. **Adicionar mais usuários/projetos** conforme necessário
4. **Integrar com frontend** para visualizar os dados

## ⚠️ Notas Importantes

- Os dados sintéticos são inseridos com `ON CONFLICT DO UPDATE` para evitar duplicatas
- Senhas são hash com bcrypt (12 rounds)
- Skills e objetivos são armazenados como JSON arrays
- O sistema evita solicitações de colaboração entre criador e próprio projeto

## 🎉 Conclusão

O sistema de dados sintéticos está **funcionando perfeitamente** e pronto para uso em desenvolvimento e testes da aplicação Startup Collaboration!

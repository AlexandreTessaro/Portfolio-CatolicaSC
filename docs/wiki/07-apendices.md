# 📚 Apêndices

## Glossário

### Termos Técnicos

- **API REST**: Arquitetura de API que usa métodos HTTP padrão
- **JWT**: JSON Web Token - padrão para autenticação stateless
- **WebSocket**: Protocolo de comunicação bidirecional em tempo real
- **Clean Architecture**: Padrão arquitetural que separa responsabilidades em camadas
- **SOLID**: Princípios de design de software orientado a objetos
- **Repository Pattern**: Padrão que abstrai acesso a dados
- **Service Layer**: Camada que contém lógica de negócio
- **Middleware**: Funções que executam entre requisição e resposta
- **Seed**: Dados iniciais para popular banco de dados
- **Migration**: Scripts para modificar estrutura do banco de dados

### Termos do Domínio

- **Match**: Solicitação de colaboração entre usuário e projeto
- **Matchmaking**: Processo de recomendar projetos/usuários compatíveis
- **Score de Match**: Pontuação de compatibilidade (0-100)
- **Collaboration Request**: Solicitação formal de participação em projeto
- **Team Member**: Usuário que faz parte da equipe de um projeto

---

## Troubleshooting

### Problemas Comuns

#### Backend não inicia

**Sintomas**: Erro ao iniciar servidor

**Soluções**:
1. Verificar se porta 5000 está livre: `lsof -i :5000`
2. Verificar variáveis de ambiente: `.env` configurado corretamente
3. Verificar conexão com banco: `psql -h localhost -U postgres`
4. Verificar logs: `docker-compose logs backend`

#### Erro de conexão com banco

**Sintomas**: `ECONNREFUSED` ou `timeout`

**Soluções**:
1. Verificar se PostgreSQL está rodando: `docker-compose ps`
2. Verificar credenciais no `.env`
3. Verificar firewall/network
4. Testar conexão: `psql $DATABASE_URL`

#### Frontend não conecta ao backend

**Sintomas**: Erro `CORS` ou `Network Error`

**Soluções**:
1. Verificar `VITE_API_URL` no `.env` do frontend
2. Verificar `CORS_ORIGIN` no backend
3. Verificar se backend está rodando
4. Verificar console do navegador para erros específicos

#### Migrations falham

**Sintomas**: Erro ao executar `npm run db:migrate`

**Soluções**:
1. Verificar permissões do usuário do banco
2. Verificar se banco existe
3. Verificar sintaxe SQL nos scripts
4. Executar migrations manualmente: `psql $DATABASE_URL < script.sql`

#### Testes falham

**Sintomas**: Testes não passam

**Soluções**:
1. Limpar cache: `npm test -- --no-cache`
2. Verificar banco de testes configurado
3. Verificar mocks atualizados
4. Executar testes isoladamente: `npm test -- UserService.test.js`

#### Erro de cold start (Azure)

**Sintomas**: Primeira requisição após inatividade falha

**Soluções**:
1. Upgrade para plano Standard ou superior
2. Configurar health check externo (ping periódico)
3. Implementar retry no frontend (já implementado)
4. Usar Always On (planos pagos)

---

## Perguntas Frequentes

### Desenvolvimento

**P: Como adicionar uma nova rota?**

R: 
1. Criar controller em `backend/src/controllers/`
2. Criar service em `backend/src/services/`
3. Criar repository se necessário
4. Adicionar rota em `backend/src/routes/`
5. Registrar rota em `backend/app.js`

**P: Como adicionar um novo campo no banco?**

R:
1. Criar migration em `backend/scripts/database/`
2. Executar: `npm run db:migrate`
3. Atualizar modelo de domínio
4. Atualizar repository
5. Atualizar validações

**P: Como testar localmente sem Docker?**

R:
1. Instalar PostgreSQL e Redis localmente
2. Configurar `.env` com credenciais locais
3. Executar `npm install` e `npm run dev` em cada pasta

### Deploy

**P: Como fazer rollback de um deploy?**

R:
1. Azure: Usar Deployment Slots ou reverter commit
2. Vercel: Usar "Revert to previous deployment"
3. GitHub: Reverter commit e fazer push

**P: Como ver logs em produção?**

R:
1. Azure: `az webapp log tail --name your-app-name`
2. Azure Portal: App Service → Log stream
3. Vercel: Dashboard → Deployments → View Function Logs

**P: Como atualizar variáveis de ambiente?**

R:
1. Azure: Portal → App Service → Configuration → Application settings
2. Vercel: Dashboard → Project → Settings → Environment Variables
3. Reiniciar aplicação após alterações

---

## Referências Bibliográficas

### Livros

1. Martin, R. C. "Clean Architecture: A Craftsman's Guide to Software Structure and Design." Prentice Hall, 2017.

2. Fowler, M. "Patterns of Enterprise Application Architecture." Addison-Wesley, 2002.

3. Evans, E. "Domain-Driven Design: Tackling Complexity in the Heart of Software." Addison-Wesley, 2003.

4. Martin, R. C. "Clean Code: A Handbook of Agile Software Craftsmanship." Prentice Hall, 2008.

### Artigos

1. "REST API Design Best Practices" - [restfulapi.net](https://restfulapi.net/)

2. "JWT Best Practices" - [auth0.com/blog](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)

3. "Node.js Security Best Practices" - [nodejs.org](https://nodejs.org/en/docs/guides/security/)

### Documentação Oficial

1. React Documentation - [react.dev](https://react.dev/)
2. Express.js Guide - [expressjs.com](https://expressjs.com/)
3. PostgreSQL Documentation - [postgresql.org/docs](https://www.postgresql.org/docs/)
4. Docker Documentation - [docs.docker.com](https://docs.docker.com/)

---

## Links Úteis

### Ferramentas

- [Postman](https://www.postman.com/) - Testar APIs
- [DBeaver](https://dbeaver.io/) - Cliente PostgreSQL
- [Redis Insight](https://redis.com/redis-enterprise/redis-insight/) - Cliente Redis
- [VS Code](https://code.visualstudio.com/) - Editor recomendado

### Serviços

- [Azure Portal](https://portal.azure.com/)
- [Vercel Dashboard](https://vercel.com/dashboard)
- [GitHub](https://github.com/)
- [SonarCloud](https://sonarcloud.io/)

### Comunidades

- [Stack Overflow](https://stackoverflow.com/)
- [Dev.to](https://dev.to/)
- [Reddit r/node](https://www.reddit.com/r/node/)
- [React Community](https://react.dev/community)

---

## Changelog

### Versão 1.0.0 (2025)

#### Adicionado
- Sistema completo de autenticação JWT
- Gestão de usuários e projetos
- Sistema de matchmaking baseado em habilidades
- Notificações em tempo real (WebSocket)
- Sistema de auditoria e LGPD compliance
- Testes automatizados (unitários, integração, E2E)
- Deploy automatizado (GitHub Actions)
- Documentação completa

#### Melhorias
- Performance otimizada com Redis cache
- Interface responsiva melhorada
- Tratamento de erros robusto
- Logs estruturados

#### Correções
- Correção de parse seguro de JSON
- Correção de cold start no Azure
- Melhorias de segurança

---

## Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](../../LICENSE) para mais detalhes.

---

## Contato e Suporte

### Autor

**Alexandre Tessaro Vieira**  
Centro Universitário de Santa Catarina  
Curso de Engenharia de Software

### Suporte

- **Issues**: Use GitHub Issues para reportar bugs
- **Documentação**: Consulte esta wiki
- **Email**: (adicionar se disponível)

---

## Agradecimentos

- Professores do curso de Engenharia de Software
- Comunidade open source
- Stack Overflow e documentações oficiais
- Contribuidores do projeto

---

## Links Relacionados

- **[Índice da Documentação](./00-indice.md)**
- **[README Principal](../../README.md)**


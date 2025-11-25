# 🚀 Startup Collaboration Platform

**Nome do Estudante:** Alexandre Tessaro Vieira  
**Curso:** Engenharia de Software  
**Instituição:** Centro Universitário de Santa Catarina  
**Data de Entrega:** 2025

---

## Resumo

Este repositório contém uma plataforma web completa para divulgação e colaboração de startups, conectando ideias a talentos e facilitando a formação de equipes multidisciplinares. A solução é uma SPA construída com **React + Vite** (JavaScript) e um backend em **Node.js 20 + Express**, com persistência em **PostgreSQL** e cache em **Redis**. A autenticação utiliza **JWT** com refresh tokens; o sistema implementa um algoritmo de **matchmaking baseado em habilidades** para recomendar projetos e usuários compatíveis. O projeto aplica boas práticas de Engenharia de Software: **Clean Architecture**, princípios **SOLID**, validação robusta, testes automatizados (Vitest), CI/CD com GitHub Actions, containerização com Docker, e UI responsiva focada em UX com Tailwind CSS.

---

## 1. Introdução

### Contexto

O ecossistema de startups brasileiro tem crescido significativamente, mas ainda enfrenta desafios na formação de equipes multidisciplinares e na conexão entre ideias promissoras e talentos qualificados. Plataformas de colaboração podem facilitar esse processo, permitindo que empreendedores encontrem parceiros com habilidades complementares e que profissionais descubram oportunidades de participar de projetos inovadores.

### Justificativa

A construção desta plataforma permite aplicar, de ponta a ponta, fundamentos de Engenharia de Software: arquitetura em camadas bem definida (Domain, Repository, Service, Controller), integração com serviços externos (PostgreSQL, Redis), modelagem relacional consistente, validações robustas com express-validator, testes automatizados e pipeline de entrega contínua. Também endereça requisitos de segurança (JWT, bcrypt, Helmet, rate limiting), conformidade com boas práticas OWASP, e metas de performance/observabilidade.

### Objetivos

**Objetivo Principal:**

Desenvolver uma aplicação web completa que facilite a conexão entre empreendedores e profissionais, permitindo a criação de projetos de startups, busca de colaboradores e sistema de matchmaking baseado em habilidades.

**Objetivos Específicos:**

- Implementar autenticação JWT com refresh tokens e gestão de sessões segura
- Construir interface responsiva com React + Vite e Tailwind CSS
- Expor API RESTful com Express, validações com express-validator e documentação de endpoints
- Implementar sistema de matchmaking baseado em habilidades (algoritmo de recomendação)
- Garantir persistência e consistência no PostgreSQL (migrations e seeds)
- Implementar cache com Redis para melhorar performance
- Disponibilizar notificações em tempo real via Socket.io
- Instrumentar observabilidade com logs estruturados e health checks
- Automatizar build/test/deploy via GitHub Actions e Azure App Service (backend) / Vercel (frontend)
- Aplicar Clean Architecture e princípios SOLID em toda a codebase

---

## FAQ

> **Note:** Dúvidas rápidas e links úteis para rodar, testar e fazer deploy.

### Atalhos

- **[📖 Documentação Completa (Wiki)](./docs/wiki/00-indice.md)** - Índice geral da documentação
- **[📋 Descrição do Projeto](./docs/wiki/01-descricao-projeto.md)** - Funcionalidades, casos de uso e arquitetura
- **[⚙️ Especificação Técnica](./docs/wiki/02-especificacao-tecnica.md)** - Stack tecnológico, estrutura e padrões
- **[🧪 Testes](./docs/wiki/03-testes.md)** - Estratégia de testes, cobertura e execução
- **[🚀 Deploy](./docs/wiki/04-deploy.md)** - Guias de deploy para desenvolvimento e produção
- **[🔍 Ferramentas de Qualidade](./docs/wiki/05-ferramentas-qualidade.md)** - ESLint, Prettier, SonarCloud
- **[📈 Próximos Passos](./docs/wiki/06-proximos-passos.md)** - Roadmap e melhorias futuras
- **[📚 Apêndices](./docs/wiki/07-apendices.md)** - Referências, glossário e troubleshooting

### Perguntas frequentes

#### Como executo o projeto localmente?

Consulte o guia completo em **[Deploy - Desenvolvimento Local](./docs/wiki/04-deploy.md#desenvolvimento-local)**.

**Resumo rápido:**
```bash
# Clone o repositório
git clone <url-do-repositorio>
cd Portfolio-CatolicaSC

# Configure as variáveis de ambiente
cp backend/env.example backend/.env
cp frontend/env.example frontend/.env

# Execute com Docker Compose
docker-compose up --build

# Execute migrações e seeds
docker-compose exec backend npm run db:migrate
docker-compose exec backend npm run db:seed
```

Acesse:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

**Credenciais padrão:**
- Admin: `admin@startupcollab.com` / `admin123`
- Usuário: `email@startupcollab.com` / `password123`

#### Como rodo os testes e vejo a cobertura?

Consulte **[Testes](./docs/wiki/03-testes.md)** para detalhes completos.

**Resumo rápido:**
```bash
# Backend - Testes unitários
docker-compose exec backend npm test

# Backend - Cobertura
docker-compose exec backend npm run test:coverage

# Frontend - Testes
docker-compose exec frontend npm test
```

#### Como funciona a autenticação (JWT)?

A autenticação utiliza JWT com refresh tokens. Consulte **[Especificação Técnica - Autenticação](./docs/wiki/02-especificacao-tecnica.md#autenticação)** para detalhes.

#### Onde estão a API e os endpoints?

Consulte **[Descrição do Projeto - API Endpoints](./docs/wiki/01-descricao-projeto.md#api-endpoints)** para lista completa de endpoints.

#### Como faço o deploy em produção?

Consulte **[Deploy - Produção](./docs/wiki/04-deploy.md#produção)** para guias detalhados de deploy no Azure (backend) e Vercel (frontend).

#### Problemas comuns

Consulte **[Apêndices - Troubleshooting](./docs/wiki/07-apendices.md#troubleshooting)** para soluções de problemas frequentes.

---

## Referências

### Frameworks e Bibliotecas

**[1]** React Documentation. [react.dev](https://react.dev/)  
**[2]** Vite Documentation. [vitejs.dev](https://vitejs.dev/)  
**[3]** Express.js Documentation. [expressjs.com](https://expressjs.com/)  
**[4]** PostgreSQL Documentation. [postgresql.org/docs](https://www.postgresql.org/docs/)  
**[5]** Redis Documentation. [redis.io/docs](https://redis.io/docs/)  
**[6]** Tailwind CSS Documentation. [tailwindcss.com/docs](https://tailwindcss.com/docs)  
**[7]** Socket.io Documentation. [socket.io/docs](https://socket.io/docs/)  
**[8]** Docker Documentation. [docs.docker.com](https://docs.docker.com/)

### Padrões e Boas Práticas

**[9]** Clean Architecture (Robert C. Martin). [blog.cleancoder.com](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)  
**[10]** SOLID Principles. [en.wikipedia.org/wiki/SOLID](https://en.wikipedia.org/wiki/SOLID)  
**[11]** OWASP Top 10 (2021). [owasp.org/Top10](https://owasp.org/Top10/)  
**[12]** REST API Design Guidelines (Microsoft). [learn.microsoft.com/en-us/azure/architecture/best-practices/api-design](https://learn.microsoft.com/en-us/azure/architecture/best-practices/api-design)  
**[13]** Node.js Best Practices. [github.com/goldbergyoni/nodebestpractices](https://github.com/goldbergyoni/nodebestpractices)  
**[14]** React Best Practices. [react.dev/learn](https://react.dev/learn)

### Regulamentações

**[15]** Lei Geral de Proteção de Dados (LGPD). Lei nº 13.709/2018  
**[16]** Marco Civil da Internet. Lei nº 12.965/2014  
**[17]** Código de Defesa do Consumidor. Lei nº 8.078/1990

### Artigos e Estudos

**[18]** Martin, R. C. "Clean Architecture: A Craftsman's Guide to Software Structure and Design." Prentice Hall, 2017.  
**[19]** Fowler, M. "Patterns of Enterprise Application Architecture." Addison-Wesley, 2002.  
**[20]** Evans, E. "Domain-Driven Design: Tackling Complexity in the Heart of Software." Addison-Wesley, 2003.

### Ferramentas e Serviços

**[21]** Azure App Service Documentation. [docs.microsoft.com/azure/app-service](https://docs.microsoft.com/azure/app-service)  
**[22]** Vercel Documentation. [vercel.com/docs](https://vercel.com/docs)  
**[23]** GitHub Actions Documentation. [docs.github.com/actions](https://docs.github.com/actions)  
**[24]** SonarCloud Documentation. [sonarcloud.io/documentation](https://sonarcloud.io/documentation)  
**[25]** Vitest Documentation. [vitest.dev](https://vitest.dev/)

---

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 👨‍💻 Autor

**Alexandre Tessaro Vieira**  
Centro Universitário de Santa Catarina  
Curso de Engenharia de Software

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

# 🚀 Startup Collaboration Platform

Uma plataforma web para divulgação e colaboração de startups, conectando ideias a talentos e facilitando a formação de equipes multidisciplinares.

## 📋 Sobre o Projeto

Esta aplicação foi desenvolvida como parte do curso de Engenharia de Software do Centro Universitário de Santa Catarina, seguindo os princípios de Clean Architecture, SOLID e boas práticas de desenvolvimento.

### 🎯 Funcionalidades Principais

- **Autenticação JWT** com refresh tokens
- **Gestão de usuários** com perfis personalizáveis
- **Criação e gestão de projetos** de startups
- **Sistema de matchmaking** baseado em habilidades
- **Solicitações de colaboração** entre usuários
- **Interface responsiva** para desktop e mobile
- **API REST** com validação e segurança

### 🏗️ Arquitetura

- **Frontend**: React + Vite + Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL
- **Cache**: Redis
- **Containerização**: Docker + Docker Compose
- **Autenticação**: JWT + bcrypt
- **Validação**: express-validator

## 🚀 Como Executar

### Pré-requisitos

- Docker e Docker Compose instalados
- Node.js 18+ (para desenvolvimento local)
- Git

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd Portfolio-CatolicaSC
```

### 2. Configure as variáveis de ambiente

```bash
# Backend
cp backend/env.example backend/.env
# Edite o arquivo .env com suas configurações
```

### 3. Execute com Docker Compose

```bash
# Construir e iniciar todos os serviços
docker-compose up --build

# Ou em background
docker-compose up -d --build
```

### 4. Acesse a aplicação

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health

## 🗄️ Banco de Dados

### Migração e Seed

```bash
# Executar migração
docker-compose exec backend npm run db:migrate

# Executar seed (dados de exemplo)
docker-compose exec backend npm run db:seed
```

### Credenciais de Acesso

Após executar o seed, você terá acesso aos seguintes usuários:

- **Admin**: admin@startupcollab.com / admin123
- **Usuários de exemplo**: email@startupcollab.com / password123

## 🧪 Testes

### Backend

```bash
# Testes unitários
docker-compose exec backend npm test

# Testes em modo watch
docker-compose exec backend npm run test:watch

# Cobertura de testes
docker-compose exec backend npm run test:coverage
```

### Frontend

```bash
# Testes unitários
docker-compose exec frontend npm test

# Interface de testes
docker-compose exec frontend npm run test:ui
```

## 📁 Estrutura do Projeto

```
Portfolio-CatolicaSC/
├── backend/                 # API Backend
│   ├── src/
│   │   ├── config/         # Configurações (DB, Redis, JWT)
│   │   ├── controllers/    # Controllers da API
│   │   ├── domain/         # Modelos de domínio
│   │   ├── middleware/     # Middlewares (auth, validação)
│   │   ├── repositories/   # Camada de acesso a dados
│   │   ├── routes/         # Definição de rotas
│   │   └── services/       # Lógica de negócio
│   ├── scripts/            # Scripts de migração e seed
│   └── Dockerfile
├── frontend/                # Aplicação React
│   ├── src/
│   │   ├── components/     # Componentes React
│   │   ├── pages/          # Páginas da aplicação
│   │   ├── services/       # Serviços de API
│   │   └── utils/          # Utilitários
│   └── Dockerfile
├── docker-compose.yml       # Orquestração dos serviços
└── README.md
```

## 🔧 Desenvolvimento Local

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## 📚 API Endpoints

### Usuários

- `POST /api/users/register` - Registrar usuário
- `POST /api/users/login` - Login
- `POST /api/users/refresh-token` - Renovar token
- `GET /api/users/profile` - Perfil do usuário
- `PUT /api/users/profile` - Atualizar perfil
- `GET /api/users/public/:userId` - Perfil público
- `GET /api/users/search` - Buscar usuários

### Projetos

- `POST /api/projects` - Criar projeto
- `GET /api/projects` - Listar projetos
- `GET /api/projects/:id` - Obter projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto
- `GET /api/projects/search` - Buscar projetos
- `GET /api/projects/recommended` - Projetos recomendados

## 🛡️ Segurança

- **JWT** para autenticação
- **bcrypt** para hash de senhas
- **Helmet** para headers de segurança
- **Rate limiting** para prevenir abusos
- **Validação** de entrada com express-validator
- **CORS** configurado adequadamente

## 📊 Monitoramento

- **Health check** endpoint
- **Logs** estruturados
- **Auditoria** de ações críticas
- **Métricas** de performance

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 👨‍💻 Autor

**Alexandre Tessaro Vieira** - Centro Universitário de Santa Catarina

## 🙏 Agradecimentos

- Professores do curso de Engenharia de Software
- Comunidade open source
- Stack Overflow e documentações oficiais

---

⭐ Se este projeto foi útil para você, considere dar uma estrela!

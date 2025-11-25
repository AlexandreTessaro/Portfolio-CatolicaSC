# ⚙️ Especificação Técnica

## Stack Tecnológico

### Frontend

- **Framework**: React 18.3.0
- **Build Tool**: Vite 5.0.0
- **Roteamento**: React Router DOM 6.20.1
- **Estilização**: Tailwind CSS 3.4.13
- **Gerenciamento de Estado**: Zustand 4.4.7
- **Requisições HTTP**: Axios 1.6.2
- **Formulários**: React Hook Form 7.48.2
- **Notificações UI**: React Hot Toast 2.4.1
- **WebSocket Client**: Socket.io-client 4.7.2
- **Ícones**: Heroicons React 2.2.0, Lucide React 0.294.0
- **Testes**: Vitest 1.0.0, Testing Library

### Backend

- **Runtime**: Node.js 20+
- **Framework**: Express 4.18.2
- **Banco de Dados**: PostgreSQL (via pg 8.11.3)
- **Cache**: Redis 4.6.10
- **Autenticação**: JWT (jsonwebtoken 9.0.2)
- **Hash de Senhas**: bcryptjs 2.4.3
- **Validação**: express-validator 7.0.1
- **WebSocket**: Socket.io 4.7.2
- **Segurança**: Helmet 7.1.0, express-rate-limit 7.1.5
- **Logs**: Winston 3.11.0
- **Monitoramento**: Application Insights 2.9.1, Datadog APM 4.7.0
- **Testes**: Vitest 3.2.4, Supertest 6.3.3

### Infraestrutura

- **Containerização**: Docker + Docker Compose
- **CI/CD**: GitHub Actions
- **Deploy Backend**: Azure App Service
- **Deploy Frontend**: Vercel
- **Banco de Dados**: Azure PostgreSQL / PostgreSQL local
- **Cache**: Redis (Azure Cache / local)

---

## Arquitetura

### Clean Architecture

O projeto segue os princípios de **Clean Architecture** de Robert C. Martin:

```
┌─────────────────────────────────────┐
│         Controllers                  │ ← HTTP Layer
├─────────────────────────────────────┤
│         Services                    │ ← Business Logic
├─────────────────────────────────────┤
│         Repositories                │ ← Data Access
├─────────────────────────────────────┤
│         Domain Models               │ ← Core Entities
└─────────────────────────────────────┘
```

### Princípios SOLID

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Subtipos devem ser substituíveis por seus tipos base
- **I**nterface Segregation: Interfaces específicas ao invés de genéricas
- **D**ependency Inversion: Depender de abstrações, não de concretizações

---

## Estrutura de Diretórios

### Backend

```
backend/
├── src/
│   ├── config/              # Configurações (DB, Redis, JWT, Socket)
│   ├── controllers/         # Controllers HTTP
│   ├── domain/              # Modelos de domínio (User, Project, Match)
│   ├── middleware/          # Middlewares (auth, monitoring)
│   ├── repositories/        # Camada de acesso a dados
│   ├── routes/              # Definição de rotas
│   ├── services/            # Lógica de negócio
│   └── utils/               # Utilitários (audit, notifications)
├── scripts/
│   ├── database/            # Scripts de migração
│   ├── seeds/               # Scripts de seed
│   └── dev/                 # Scripts de desenvolvimento
├── tests/
│   ├── e2e/                 # Testes end-to-end
│   ├── integration/         # Testes de integração
│   ├── manual/              # Scripts de teste manual
│   └── scripts/             # Scripts auxiliares de teste
├── __tests__/               # Testes unitários (Vitest)
├── index.js                 # Entry point
├── app.js                   # Configuração Express
└── package.json
```

### Frontend

```
frontend/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   ├── pages/              # Páginas (rotas)
│   ├── services/           # Serviços de API
│   ├── stores/             # Stores Zustand
│   ├── contexts/           # Contextos React
│   ├── config/             # Configurações
│   ├── utils/              # Utilitários
│   ├── assets/             # Assets estáticos
│   ├── App.jsx             # Componente raiz
│   └── main.jsx            # Entry point
├── public/                  # Arquivos públicos
└── package.json
```

---

## Padrões de Código

### Nomenclatura

- **Classes**: PascalCase (`UserController`, `MatchService`)
- **Funções/Métodos**: camelCase (`getUserById`, `createMatch`)
- **Constantes**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `DEFAULT_PAGE_SIZE`)
- **Arquivos**: camelCase para JS/JSX (`userController.js`, `MatchService.js`)

### Estrutura de Arquivos

#### Controller

```javascript
class UserController {
  constructor() {
    this.userService = new UserService(pool);
  }

  async getUser(req, res) {
    try {
      // Lógica
      res.json({ success: true, data });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
```

#### Service

```javascript
class UserService {
  constructor(database) {
    this.userRepository = new UserRepository(database);
  }

  async getUserById(id) {
    const user = await this.userRepository.findById(id);
    if (!user) throw new Error('User not found');
    return user;
  }
}
```

#### Repository

```javascript
class UserRepository {
  constructor(database) {
    this.db = database;
  }

  async findById(id) {
    const query = 'SELECT * FROM users WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rows[0] ? new User(result.rows[0]) : null;
  }
}
```

---

## Configurações e Variáveis de Ambiente

### Backend (.env)

```bash
# Servidor
NODE_ENV=development
PORT=5000

# Banco de Dados
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
# OU
DB_HOST=localhost
DB_PORT=5432
DB_NAME=startupcollab
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# JWT
JWT_SECRET=your-secret-key
JWT_REFRESH_SECRET=your-refresh-secret
JWT_EXPIRES_IN=1h
JWT_REFRESH_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:3000

# Azure (Produção)
AZURE_APPINSIGHTS_INSTRUMENTATION_KEY=
DATADOG_API_KEY=
```

### Frontend (.env)

```bash
VITE_API_URL=http://localhost:5000
VITE_SOCKET_URL=http://localhost:5000
```

---

## Autenticação

### Fluxo JWT

1. **Login**: Usuário envia credenciais → Backend valida → Retorna `accessToken` e `refreshToken`
2. **Requisições**: Frontend envia `accessToken` no header `Authorization: Bearer <token>`
3. **Refresh**: Quando `accessToken` expira → Frontend usa `refreshToken` → Obtém novo `accessToken`
4. **Middleware**: `auth.js` valida token em rotas protegidas

### Estrutura do Token

```javascript
{
  userId: 123,
  email: "user@example.com",
  iat: 1234567890,
  exp: 1234571490
}
```

---

## Banco de Dados

### Schema Principal

#### Tabela `users`
- `id` (SERIAL PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `password_hash` (VARCHAR)
- `bio` (TEXT)
- `skills` (JSONB) - Array de habilidades
- `profile_image` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabela `projects`
- `id` (SERIAL PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `objectives` (JSONB) - Array de objetivos
- `technologies` (JSONB) - Array de tecnologias
- `status` (VARCHAR) - 'idea', 'development', 'launched'
- `category` (VARCHAR)
- `creator_id` (INTEGER REFERENCES users)
- `team_members` (JSONB) - Array de IDs de usuários
- `images` (JSONB) - Array de URLs de imagens
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabela `collaboration_requests` (matches)
- `id` (SERIAL PRIMARY KEY)
- `project_id` (INTEGER REFERENCES projects)
- `user_id` (INTEGER REFERENCES users)
- `status` (VARCHAR) - 'pending', 'accepted', 'rejected', 'blocked'
- `message` (TEXT)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### Tabela `notifications`
- `id` (SERIAL PRIMARY KEY)
- `user_id` (INTEGER REFERENCES users)
- `type` (VARCHAR) - 'match', 'connection', 'project'
- `title` (VARCHAR)
- `message` (TEXT)
- `data` (JSONB) - Dados adicionais
- `read` (BOOLEAN DEFAULT false)
- `created_at` (TIMESTAMP)

### Migrations

As migrations são executadas via script `scripts/migrate.js`:

```bash
npm run db:migrate
```

---

## Cache (Redis)

### Estratégia de Cache

- **Chaves de usuário**: `user:${userId}`
- **Chaves de projeto**: `project:${projectId}`
- **Chaves de recomendações**: `recommendations:${userId}`
- **TTL padrão**: 1 hora

### Exemplo de Uso

```javascript
// Verificar cache
const cached = await redis.get(`user:${userId}`);
if (cached) return JSON.parse(cached);

// Buscar do banco
const user = await userRepository.findById(userId);

// Armazenar no cache
await redis.setex(`user:${userId}`, 3600, JSON.stringify(user));
```

---

## WebSocket (Socket.io)

### Eventos do Servidor

- `connection` - Cliente conectado
- `disconnect` - Cliente desconectado
- `notification` - Nova notificação

### Eventos do Cliente

- `join:user:${userId}` - Entrar na sala do usuário
- `leave:user:${userId}` - Sair da sala do usuário

### Exemplo de Uso

```javascript
// Backend
io.to(`user:${userId}`).emit('notification', {
  type: 'match',
  title: 'Nova solicitação',
  message: 'Você recebeu uma nova solicitação'
});

// Frontend
socket.on('notification', (data) => {
  // Atualizar estado de notificações
});
```

---

## Validação

### Backend (express-validator)

```javascript
[
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  body('name').trim().notEmpty()
]
```

### Frontend (React Hook Form)

```javascript
const { register, handleSubmit, formState: { errors } } = useForm();

<input {...register('email', { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ })} />
{errors.email && <span>Email inválido</span>}
```

---

## Segurança

### Medidas Implementadas

- **Helmet**: Headers de segurança HTTP
- **Rate Limiting**: Limite de requisições por IP
- **CORS**: Configuração restritiva
- **bcrypt**: Hash de senhas (10 rounds)
- **JWT**: Tokens assinados e expiráveis
- **Validação**: Sanitização de inputs
- **SQL Injection**: Uso de prepared statements (pg)

### Headers de Segurança

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
```

---

## Logs e Monitoramento

### Estrutura de Logs

```javascript
logger.info('User created', { userId, email });
logger.error('Database error', { error: error.message, stack: error.stack });
```

### Níveis de Log

- `error`: Erros críticos
- `warn`: Avisos
- `info`: Informações gerais
- `debug`: Debug detalhado

### Monitoramento

- **Application Insights** (Azure)
- **Datadog APM** (opcional)
- **Health Check** endpoint (`/health`)

---

## Performance

### Otimizações

- **Cache Redis** para dados frequentes
- **Índices no banco** para queries rápidas
- **Paginação** em listagens
- **Lazy loading** no frontend
- **Code splitting** com Vite

### Queries Otimizadas

```sql
-- Índice em busca de usuários
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_skills ON users USING GIN(skills);

-- Índice em busca de projetos
CREATE INDEX idx_projects_creator ON projects(creator_id);
CREATE INDEX idx_projects_status ON projects(status);
```

---

## Links Relacionados

- **[Descrição do Projeto](./01-descricao-projeto.md)** - Funcionalidades e casos de uso
- **[Testes](./03-testes.md)** - Estratégia de testes
- **[Deploy](./04-deploy.md)** - Guias de deploy
- **[Voltar ao Índice](./00-indice.md)**


# 📋 Descrição do Projeto

## Visão Geral

A **Startup Collaboration Platform** é uma plataforma web completa que conecta empreendedores e profissionais, facilitando a formação de equipes multidisciplinares para projetos de startups. A plataforma oferece um sistema inteligente de matchmaking baseado em habilidades, permitindo que usuários encontrem projetos compatíveis e que projetos encontrem colaboradores ideais.

---

## 🎯 Objetivos do Projeto

### Objetivo Principal

Desenvolver uma aplicação web completa que facilite a conexão entre empreendedores e profissionais, permitindo a criação de projetos de startups, busca de colaboradores e sistema de matchmaking baseado em habilidades.

### Objetivos Específicos

- **Conectar Talentos**: Facilitar a descoberta de oportunidades de colaboração
- **Matchmaking Inteligente**: Recomendar projetos e usuários baseado em habilidades compatíveis
- **Gestão de Projetos**: Permitir criação, edição e gestão completa de projetos
- **Sistema de Solicitações**: Gerenciar solicitações de colaboração entre usuários
- **Notificações em Tempo Real**: Informar usuários sobre eventos importantes
- **Interface Responsiva**: Oferecer experiência consistente em desktop e mobile

---

## 🚀 Funcionalidades Principais

### 1. Autenticação e Autorização

- **Registro de usuários** com validação completa
- **Login com JWT** e refresh tokens
- **Gestão de sessões** segura
- **Proteção de rotas** no frontend e backend
- **Perfis públicos e privados**

### 2. Gestão de Usuários

- **Perfis personalizáveis** com foto, bio e habilidades
- **Busca de usuários** por habilidades, nome ou email
- **Visualização de perfis públicos**
- **Conexões entre usuários** (seguir/seguidores)
- **Estatísticas de perfil** (projetos criados, matches, etc.)

### 3. Gestão de Projetos

- **Criação de projetos** com informações detalhadas
- **Edição e atualização** de projetos
- **Categorização** por área de atuaação
- **Galeria de imagens** para projetos
- **Busca e filtros** avançados
- **Recomendações personalizadas** baseadas em habilidades

### 4. Sistema de Matchmaking

- **Algoritmo de recomendação** baseado em habilidades
- **Score de compatibilidade** entre usuários e projetos
- **Recomendações automáticas** na dashboard
- **Estatísticas de match** (sent, received, accepted, rejected)

### 5. Solicitações de Colaboração

- **Envio de solicitações** para participar de projetos
- **Aceitar/Rejeitar/Bloquear** solicitações
- **Mensagens personalizadas** nas solicitações
- **Histórico completo** de solicitações enviadas e recebidas
- **Notificações automáticas** para novas solicitações

### 6. Notificações em Tempo Real

- **Notificações via WebSocket** (Socket.io)
- **Badge de contador** de notificações não lidas
- **Página dedicada** para visualizar todas as notificações
- **Marcar como lida** individualmente ou em massa
- **Tipos de notificação**: matches, conexões, projetos

### 7. Interface Responsiva

- **Design mobile-first** com Tailwind CSS
- **Componentes reutilizáveis** e consistentes
- **Navegação intuitiva** com React Router
- **Feedback visual** com toasts e loading states
- **Acessibilidade** considerada no design

---

## 📊 Casos de Uso

### Caso de Uso 1: Criar um Projeto

**Ator**: Empreendedor  
**Pré-condições**: Usuário autenticado  
**Fluxo Principal**:
1. Usuário acessa a página "Criar Projeto"
2. Preenche informações do projeto (título, descrição, tecnologias, etc.)
3. Adiciona imagens do projeto
4. Define habilidades necessárias
5. Submete o formulário
6. Sistema valida e cria o projeto
7. Projeto fica disponível para busca e matchmaking

**Fluxo Alternativo**: Validação falha → Sistema exibe erros → Usuário corrige

### Caso de Uso 2: Solicitar Participação em Projeto

**Ator**: Profissional  
**Pré-condições**: Usuário autenticado, projeto existente  
**Fluxo Principal**:
1. Usuário visualiza projeto recomendado ou busca projeto
2. Acessa detalhes do projeto
3. Clica em "Solicitar Participação"
4. Escreve mensagem personalizada
5. Envia solicitação
6. Criador do projeto recebe notificação
7. Criador pode aceitar/rejeitar/bloquear

### Caso de Uso 3: Receber Recomendações

**Ator**: Usuário autenticado  
**Pré-condições**: Usuário com habilidades cadastradas  
**Fluxo Principal**:
1. Usuário acessa dashboard
2. Sistema calcula compatibilidade com projetos existentes
3. Exibe projetos recomendados ordenados por score
4. Usuário pode visualizar detalhes e solicitar participação

---

## 🏗️ Arquitetura do Sistema

### Arquitetura Geral

A aplicação segue os princípios de **Clean Architecture** e **SOLID**, organizando o código em camadas bem definidas:

```
┌─────────────────────────────────────────┐
│         Frontend (React + Vite)          │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │  Pages   │  │Components│  │Services││
│  └──────────┘  └──────────┘  └────────┘│
└─────────────────────────────────────────┘
                    ↕ HTTP/REST
┌─────────────────────────────────────────┐
│      Backend (Node.js + Express)        │
│  ┌──────────┐  ┌──────────┐  ┌────────┐│
│  │Controllers│ │ Services │ │Repos    ││
│  └──────────┘  └──────────┘  └────────┘│
│  ┌──────────┐  ┌──────────┐           │
│  │ Domain   │  │Middleware │           │
│  └──────────┘  └──────────┘           │
└─────────────────────────────────────────┘
                    ↕
┌──────────────┐  ┌──────────────┐
│  PostgreSQL  │  │    Redis     │
└──────────────┘  └──────────────┘
```

### Camadas do Backend

1. **Domain Layer**: Modelos de domínio puros (User, Project, Match)
2. **Repository Layer**: Acesso a dados (abstração do banco)
3. **Service Layer**: Lógica de negócio
4. **Controller Layer**: Tratamento de requisições HTTP
5. **Middleware**: Autenticação, validação, logging

### Camadas do Frontend

1. **Pages**: Componentes de página (rotas)
2. **Components**: Componentes reutilizáveis
3. **Services**: Comunicação com API
4. **Stores**: Gerenciamento de estado (Zustand)
5. **Utils**: Funções utilitárias

---

## 📡 API Endpoints

### Autenticação

- `POST /api/users/register` - Registrar novo usuário
- `POST /api/users/login` - Login e obter tokens
- `POST /api/users/refresh-token` - Renovar access token
- `GET /api/users/profile` - Obter perfil do usuário autenticado
- `PUT /api/users/profile` - Atualizar perfil

### Usuários

- `GET /api/users/public/:userId` - Obter perfil público
- `GET /api/users/search` - Buscar usuários
- `GET /api/users/:userId/connections` - Obter conexões do usuário
- `POST /api/users/:userId/connect` - Conectar com usuário
- `DELETE /api/users/:userId/disconnect` - Desconectar de usuário

### Projetos

- `POST /api/projects` - Criar projeto
- `GET /api/projects` - Listar projetos (com paginação)
- `GET /api/projects/:id` - Obter detalhes do projeto
- `PUT /api/projects/:id` - Atualizar projeto
- `DELETE /api/projects/:id` - Deletar projeto
- `GET /api/projects/search` - Buscar projetos
- `GET /api/projects/recommended` - Obter projetos recomendados
- `GET /api/projects/:id/team` - Obter equipe do projeto
- `POST /api/projects/:id/team/:userId` - Adicionar membro à equipe
- `DELETE /api/projects/:id/team/:userId` - Remover membro da equipe

### Matches (Solicitações)

- `POST /api/matches` - Criar solicitação de colaboração
- `GET /api/matches/received` - Obter solicitações recebidas
- `GET /api/matches/sent` - Obter solicitações enviadas
- `GET /api/matches/stats` - Obter estatísticas de matches
- `GET /api/matches/:id` - Obter detalhes de um match
- `PATCH /api/matches/:id/accept` - Aceitar solicitação
- `PATCH /api/matches/:id/reject` - Rejeitar solicitação
- `PATCH /api/matches/:id/block` - Bloquear usuário
- `DELETE /api/matches/:id` - Cancelar solicitação
- `GET /api/matches/can-request/:projectId` - Verificar se pode solicitar

### Recomendações

- `GET /api/recommendations/projects` - Obter projetos recomendados
- `GET /api/recommendations/users` - Obter usuários recomendados
- `GET /api/recommendations/match-score/:projectId` - Obter score de match

### Notificações

- `GET /api/notifications` - Listar notificações
- `PUT /api/notifications/:id/read` - Marcar como lida
- `PUT /api/notifications/read-all` - Marcar todas como lidas

### Sistema

- `GET /health` - Health check
- `GET /api/audit` - Logs de auditoria (admin)

---

## 🔄 Fluxos Principais

### Fluxo de Autenticação

```
1. Usuário registra → Backend cria usuário → Retorna tokens
2. Usuário faz login → Backend valida → Retorna access + refresh tokens
3. Frontend armazena tokens → Usa access token em requisições
4. Token expira → Frontend usa refresh token → Obtém novo access token
```

### Fluxo de Matchmaking

```
1. Usuário acessa dashboard → Backend calcula compatibilidade
2. Sistema compara habilidades do usuário com tecnologias dos projetos
3. Calcula score de match (0-100)
4. Retorna projetos ordenados por score
5. Usuário visualiza e pode solicitar participação
```

### Fluxo de Solicitação de Colaboração

```
1. Usuário solicita participação → Backend valida → Cria match
2. Sistema envia notificação via WebSocket ao criador do projeto
3. Criador visualiza solicitação → Aceita/Rejeita/Bloqueia
4. Sistema atualiza status → Envia notificação ao solicitante
5. Se aceito → Usuário é adicionado à equipe do projeto
```

---

## 📈 Métricas e Estatísticas

### Métricas de Usuário

- Total de projetos criados
- Total de solicitações enviadas/recebidas
- Taxa de aceitação de solicitações
- Conexões estabelecidas
- Score médio de match

### Métricas de Projeto

- Total de visualizações
- Total de solicitações recebidas
- Taxa de aceitação
- Tamanho da equipe
- Status do projeto

---

## 🔗 Links Relacionados

- **[Especificação Técnica](./02-especificacao-tecnica.md)** - Detalhes técnicos da implementação
- **[Deploy](./04-deploy.md)** - Guias de deploy
- **[Testes](./03-testes.md)** - Estratégia de testes
- **[Voltar ao Índice](./00-indice.md)**


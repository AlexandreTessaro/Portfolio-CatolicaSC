# 🚀 Guia de Otimização - Suporte a 1000 Usuários Simultâneos (RNF03)

Este guia documenta as otimizações implementadas para suportar 1000+ usuários simultâneos.

---

## ✅ Otimizações Implementadas

### 1. **Connection Pooling Otimizado**

**Arquivo:** `backend/src/config/database.js`

**Mudanças:**
- **Produção**: `max: 100` conexões (antes: 20)
- **Desenvolvimento**: `max: 50` conexões (antes: 20)
- **Mínimo de conexões**: `min: 10` (produção), `min: 5` (dev)
- **Keep-Alive**: Habilitado para manter conexões vivas
- **Timeout**: Configurável via variáveis de ambiente

**Variáveis de Ambiente:**
```env
DB_POOL_MAX=100              # Máximo de conexões no pool
DB_POOL_MIN=10               # Mínimo de conexões mantidas
DB_POOL_IDLE_TIMEOUT=30000   # Timeout para conexões idle (ms)
DB_POOL_CONNECTION_TIMEOUT=30000  # Timeout para criar conexão (ms)
```

**Benefícios:**
- Reduz overhead de criar/fechar conexões
- Melhora tempo de resposta em alta carga
- Suporta mais requisições simultâneas

---

### 2. **Cache Redis Implementado**

**Arquivo:** `backend/src/services/CacheService.js`

**Funcionalidades:**
- Cache de projetos por ID (TTL: 30 minutos)
- Cache de listas de projetos (TTL: 10 minutos)
- Cache de projetos populares (TTL: 5 minutos)
- Cache de recomendações (TTL: 10 minutos)
- Invalidação automática ao atualizar/deletar

**Integração:**
- `ProjectService` usa cache para `getProject()`
- Cache-aside pattern (busca cache, se não encontrar busca DB)
- Invalidação automática em updates/deletes

**Benefícios:**
- Reduz carga no banco de dados
- Melhora tempo de resposta para leituras frequentes
- Suporta mais usuários simultâneos

---

### 3. **Índices Otimizados**

**Arquivo:** `backend/scripts/migrate.js`

**Índices Existentes:**
- `idx_users_email` - Busca por email
- `idx_users_skills` - Busca por habilidades (GIN)
- `idx_projects_creator_id` - Projetos por criador
- `idx_projects_status` - Filtro por status
- `idx_projects_category` - Filtro por categoria
- `idx_projects_technologies` - Busca por tecnologias (GIN)
- `idx_collaboration_requests_project_id` - Matches por projeto
- `idx_collaboration_requests_user_id` - Matches por usuário
- `idx_audit_logs_user_id` - Logs por usuário
- `idx_audit_logs_action` - Logs por ação
- `idx_audit_logs_created_at` - Logs por data

**Benefícios:**
- Queries mais rápidas
- Menos full table scans
- Melhor performance em buscas e filtros

---

### 4. **Testes de Carga com Artillery**

**Arquivo:** `backend/artillery-config.yml`

**Cenários de Teste:**
1. **Browse Projects** (40% do tráfego)
   - Listar projetos
   - Ver detalhes de projeto
   - Filtrar por status

2. **Search** (20% do tráfego)
   - Buscar projetos
   - Buscar usuários

3. **Authenticated Actions** (30% do tráfego)
   - Login
   - Ver perfil
   - Ver matches

4. **Create Project** (10% do tráfego)
   - Criar novo projeto

**Fases de Teste:**
- **Warmup**: 10 usuários/seg por 30s
- **Normal Load**: 50 usuários/seg por 2min
- **High Load**: 200 usuários/seg por 2min
- **Peak Load**: 500 usuários/seg por 1min
- **Recovery**: 100 usuários/seg por 1min

---

## 📊 Como Executar Testes de Carga

### Pré-requisitos

```bash
# Instalar Artillery
npm install -g artillery

# Ou localmente no projeto
cd backend
npm install --save-dev artillery
```

### Executar Teste

```bash
cd backend
artillery run artillery-config.yml
```

### Executar com Relatório HTML

```bash
artillery run --output report.json artillery-config.yml
artillery report report.json
```

### Métricas Esperadas

**Bom desempenho:**
- ✅ Tempo de resposta médio < 500ms
- ✅ 95% das requisições < 1s
- ✅ Taxa de erro < 1%
- ✅ Throughput > 100 req/s

**Atenção:**
- ⚠️ Tempo de resposta médio > 1s
- ⚠️ Taxa de erro > 5%
- ⚠️ Timeouts frequentes

---

## 🔧 Configuração de Produção

### Variáveis de Ambiente Recomendadas

```env
# Database Pool
DB_POOL_MAX=100
DB_POOL_MIN=10
DB_POOL_IDLE_TIMEOUT=30000
DB_POOL_CONNECTION_TIMEOUT=30000

# Redis Cache
REDIS_URL=redis://your-redis-host:6379
REDIS_ENABLED=true

# Node.js
NODE_ENV=production
NODE_OPTIONS="--max-old-space-size=2048"
```

### Configuração do PostgreSQL

**postgresql.conf:**
```conf
max_connections = 200
shared_buffers = 256MB
effective_cache_size = 1GB
maintenance_work_mem = 64MB
checkpoint_completion_target = 0.9
wal_buffers = 16MB
default_statistics_target = 100
random_page_cost = 1.1
effective_io_concurrency = 200
work_mem = 4MB
min_wal_size = 1GB
max_wal_size = 4GB
```

---

## 📈 Monitoramento

### Métricas Importantes

1. **Connection Pool**
   - Conexões ativas vs. máximo
   - Tempo de espera por conexão
   - Taxa de reutilização

2. **Cache Hit Rate**
   - Taxa de acerto do cache Redis
   - Objetivo: > 70%

3. **Tempo de Resposta**
   - P50, P95, P99
   - Endpoints mais lentos

4. **Throughput**
   - Requisições por segundo
   - Requisições simultâneas

### Ferramentas Recomendadas

- **APM**: New Relic, Datadog, ou Prometheus
- **Logs**: ELK Stack ou CloudWatch
- **Database**: pg_stat_statements para análise de queries

---

## 🔄 Load Balancing

### Opção 1: Nginx (Recomendado)

**nginx.conf:**
```nginx
upstream backend {
    least_conn;
    server localhost:5000;
    server localhost:5001;
    server localhost:5002;
}

server {
    listen 80;
    
    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

### Opção 2: PM2 Cluster Mode

```bash
# Instalar PM2
npm install -g pm2

# Iniciar em modo cluster
pm2 start index.js -i max --name "startup-collab-api"

# Monitorar
pm2 monit
```

### Opção 3: Kubernetes (Produção)

**deployment.yaml:**
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: startup-collab-api
spec:
  replicas: 3
  selector:
    matchLabels:
      app: startup-collab-api
  template:
    metadata:
      labels:
        app: startup-collab-api
    spec:
      containers:
      - name: api
        image: startup-collab-api:latest
        resources:
          requests:
            memory: "512Mi"
            cpu: "500m"
          limits:
            memory: "1Gi"
            cpu: "1000m"
```

---

## 🎯 Próximos Passos (Opcionais)

1. **CDN para Assets Estáticos**
   - CloudFlare, AWS CloudFront
   - Reduz carga no servidor

2. **Database Read Replicas**
   - Separar leituras de escritas
   - Escalar horizontalmente

3. **Message Queue**
   - Processar tarefas assíncronas
   - Email, notificações, etc.

4. **Rate Limiting Avançado**
   - Por usuário, por IP
   - Proteção contra abuso

5. **Compressão**
   - Gzip/Brotli para respostas
   - Reduz bandwidth

---

## ✅ Checklist de Verificação

- [ ] Connection pooling configurado (max: 100)
- [ ] Redis cache implementado e funcionando
- [ ] Índices criados no banco de dados
- [ ] Testes de carga executados com sucesso
- [ ] Métricas de performance dentro do esperado
- [ ] Load balancer configurado (se necessário)
- [ ] Monitoramento configurado
- [ ] Variáveis de ambiente de produção configuradas

---

## 📚 Referências

- [PostgreSQL Connection Pooling](https://www.postgresql.org/docs/current/runtime-config-connection.html)
- [Redis Caching Patterns](https://redis.io/docs/manual/patterns/)
- [Artillery Documentation](https://www.artillery.io/docs)
- [Node.js Performance Best Practices](https://nodejs.org/en/docs/guides/simple-profiling/)

---

**Última atualização:** 2025-11-10


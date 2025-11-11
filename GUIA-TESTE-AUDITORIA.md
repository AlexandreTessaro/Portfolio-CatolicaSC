# 🧪 Guia de Testes - Sistema de Auditoria (RNF14)

Este guia mostra como testar o sistema de auditoria completo implementado.

---

## 📋 Pré-requisitos

1. **Backend rodando** na porta 5000 (ou configurada)
2. **Banco de dados** com a tabela `audit_logs` criada
3. **Usuário administrador** criado no sistema
4. **Token de autenticação** válido

---

## 🔧 Configuração Inicial

### 1. Criar um usuário administrador (se não existir)

```sql
-- Conectar ao PostgreSQL
-- Atualizar um usuário existente para admin
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

Ou via API (se você já tem um usuário):

```bash
# Primeiro, faça login para obter o token
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'
```

### 2. Verificar se a tabela audit_logs existe

```sql
-- Verificar estrutura da tabela
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'audit_logs';
```

---

## 🧪 TESTE 1: Verificar Logging de Login

### Passo 1: Fazer login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu-email@exemplo.com",
    "password": "sua-senha"
  }'
```

**Salve o `accessToken` retornado!**

### Passo 2: Verificar log no banco

```sql
SELECT * FROM audit_logs 
WHERE action = 'user.login' 
ORDER BY created_at DESC 
LIMIT 5;
```

**Resultado esperado:**
- `action`: `user.login`
- `user_id`: ID do usuário que fez login
- `resource_type`: `user`
- `resource_id`: ID do usuário
- `ip_address`: IP da requisição
- `user_agent`: User Agent do navegador
- `details`: JSON com email do usuário

---

## 🧪 TESTE 2: Verificar Logging de Logout

### Passo 1: Fazer logout

```bash
curl -X POST http://localhost:5000/api/users/logout \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'user.logout' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🧪 TESTE 3: Verificar Logging de Criação de Projeto

### Passo 1: Criar um projeto

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Projeto de Teste",
    "description": "Descrição do projeto de teste para auditoria",
    "technologies": ["React", "Node.js"],
    "status": "idea"
  }'
```

**Salve o `id` do projeto retornado!**

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'project.create' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado:**
- `action`: `project.create`
- `resource_type`: `project`
- `resource_id`: ID do projeto criado
- `details`: JSON com `title` e `creatorId`

---

## 🧪 TESTE 4: Verificar Logging de Atualização de Projeto

### Passo 1: Atualizar o projeto

```bash
curl -X PUT http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Projeto Atualizado",
    "status": "development"
  }'
```

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'project.update' 
  AND resource_id = PROJECT_ID
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado:**
- `action`: `project.update`
- `details`: JSON com `fieldsUpdated` (array com campos alterados)

---

## 🧪 TESTE 5: Verificar Logging de Exclusão de Projeto

### Passo 1: Deletar o projeto

```bash
curl -X DELETE http://localhost:5000/api/projects/PROJECT_ID \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'project.delete' 
  AND resource_id = PROJECT_ID
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado:**
- `action`: `project.delete`
- `details`: JSON com `deletedBy` (ID do usuário que deletou)

---

## 🧪 TESTE 6: Verificar Logging de Matches

### Passo 1: Criar um match

```bash
curl -X POST http://localhost:5000/api/matches \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "projectId": PROJECT_ID,
    "message": "Gostaria de colaborar neste projeto"
  }'
```

**Salve o `id` do match retornado!**

### Passo 2: Aceitar o match (como criador do projeto)

```bash
curl -X PUT http://localhost:5000/api/matches/MATCH_ID/accept \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Passo 3: Verificar logs

```sql
-- Log de criação de match
SELECT * FROM audit_logs 
WHERE action = 'match.create' 
ORDER BY created_at DESC 
LIMIT 1;

-- Log de aceitação de match
SELECT * FROM audit_logs 
WHERE action = 'match.accept' 
ORDER BY created_at DESC 
LIMIT 1;
```

---

## 🧪 TESTE 7: Verificar Logging de Atualização de Perfil

### Passo 1: Atualizar perfil

```bash
curl -X PUT http://localhost:5000/api/users/profile \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nome Atualizado",
    "bio": "Nova bio"
  }'
```

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'user.profile.update' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado:**
- `details`: JSON com `fieldsUpdated` (array com campos alterados)

---

## 🧪 TESTE 8: Testar Endpoints de Auditoria (Admin)

### Passo 1: Listar todos os logs

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?limit=10&page=1" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "user_id": 1,
      "action": "user.login",
      "resource_type": "user",
      "resource_id": 1,
      "details": {"email": "usuario@exemplo.com"},
      "ip_address": "127.0.0.1",
      "user_agent": "Mozilla/5.0...",
      "created_at": "2025-11-10T10:00:00.000Z"
    },
    ...
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 50,
    "totalPages": 5
  }
}
```

### Passo 2: Filtrar por ação

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?action=user.login&limit=5" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### Passo 3: Filtrar por usuário

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?userId=1&limit=10" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### Passo 4: Filtrar por tipo de recurso

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?resourceType=project&limit=10" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### Passo 5: Filtrar por data

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?startDate=2025-11-10&endDate=2025-11-11" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### Passo 6: Buscar log específico

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs/1" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### Passo 7: Buscar logs de um usuário específico

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs/user/1?limit=20" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

---

## 🧪 TESTE 9: Verificar Acesso Restrito (Não Admin)

### Passo 1: Tentar acessar logs sem ser admin

```bash
# Use um token de usuário comum (não admin)
curl -X GET "http://localhost:5000/api/admin/audit-logs" \
  -H "Authorization: Bearer TOKEN_USUARIO_COMUM"
```

**Resposta esperada:**
```json
{
  "success": false,
  "message": "Acesso negado. Apenas administradores podem acessar este recurso"
}
```

**Status Code:** `403 Forbidden`

---

## 🧪 TESTE 10: Verificar Logging de Direito ao Esquecimento (LGPD)

### Passo 1: Exercer direito ao esquecimento

```bash
curl -X DELETE http://localhost:5000/api/users/forget-me \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN"
```

### Passo 2: Verificar log

```sql
SELECT * FROM audit_logs 
WHERE action = 'user.forget_me' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado:**
- `action`: `user.forget_me`
- `details`: JSON com `lgpd: true` e `anonymized: true`

---

## 📊 Consultas SQL Úteis

### Ver todas as ações registradas

```sql
SELECT DISTINCT action 
FROM audit_logs 
ORDER BY action;
```

### Contar logs por ação

```sql
SELECT action, COUNT(*) as total
FROM audit_logs
GROUP BY action
ORDER BY total DESC;
```

### Ver logs recentes (últimas 24 horas)

```sql
SELECT * FROM audit_logs
WHERE created_at >= NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Ver logs de um usuário específico

```sql
SELECT * FROM audit_logs
WHERE user_id = 1
ORDER BY created_at DESC
LIMIT 20;
```

### Ver logs de ações administrativas

```sql
SELECT * FROM audit_logs
WHERE action LIKE 'admin.%'
ORDER BY created_at DESC;
```

### Ver logs de projetos

```sql
SELECT * FROM audit_logs
WHERE resource_type = 'project'
ORDER BY created_at DESC;
```

---

## 🐛 Troubleshooting

### Problema: Nenhum log está sendo criado

**Soluções:**
1. Verifique se a tabela `audit_logs` existe:
   ```sql
   SELECT * FROM information_schema.tables WHERE table_name = 'audit_logs';
   ```

2. Verifique se há erros no console do backend ao executar ações

3. Verifique se o `AuditService` está sendo importado corretamente

### Problema: Erro 403 ao acessar endpoints de auditoria

**Solução:** Verifique se o usuário é administrador:
```sql
SELECT id, email, is_admin FROM users WHERE id = SEU_USER_ID;
```

### Problema: IP address aparece como NULL

**Solução:** O Express pode não estar capturando o IP corretamente. Verifique se está usando um proxy reverso (Nginx, etc.) e configure `trust proxy` no Express.

---

## ✅ Checklist de Testes

- [ ] Login gera log de auditoria
- [ ] Logout gera log de auditoria
- [ ] Criação de projeto gera log
- [ ] Atualização de projeto gera log
- [ ] Exclusão de projeto gera log
- [ ] Criação de match gera log
- [ ] Aceitação de match gera log
- [ ] Rejeição de match gera log
- [ ] Bloqueio de match gera log
- [ ] Atualização de perfil gera log
- [ ] Direito ao esquecimento gera log
- [ ] Endpoint de listagem de logs funciona (admin)
- [ ] Endpoint de busca por ID funciona (admin)
- [ ] Endpoint de busca por usuário funciona (admin)
- [ ] Filtros funcionam corretamente
- [ ] Paginação funciona
- [ ] Acesso negado para usuários não-admin
- [ ] IP e User Agent são registrados
- [ ] Detalhes JSON são salvos corretamente

---

## 🎯 Próximos Passos

1. **Dashboard de Auditoria no Frontend** (opcional)
   - Criar interface visual para visualizar logs
   - Gráficos de ações mais comuns
   - Filtros visuais

2. **Alertas Automáticos** (opcional)
   - Notificar admin sobre ações suspeitas
   - Múltiplos logins falhados
   - Muitas exclusões em pouco tempo

3. **Exportação de Logs** (opcional)
   - Exportar logs para CSV/JSON
   - Relatórios periódicos

---

**Última atualização:** 2025-11-10


# ⚡ Teste Rápido - Sistema de Auditoria

Guia rápido para testar o sistema de auditoria em 5 minutos.

---

## 🚀 Passo 1: Verificar Sistema

```bash
cd backend
npm run test:audit
```

Este script verifica:
- ✅ Se a tabela `audit_logs` existe
- ✅ Estrutura da tabela
- ✅ Logs existentes
- ✅ Usuários administradores

---

## 🔐 Passo 2: Criar Usuário Admin (se necessário)

```sql
-- Conecte ao PostgreSQL e execute:
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

---

## 🧪 Passo 3: Testar Logging Automático

### 3.1 Fazer Login

```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email": "seu-email@exemplo.com", "password": "sua-senha"}'
```

**Copie o `accessToken` retornado!**

### 3.2 Criar um Projeto

```bash
curl -X POST http://localhost:5000/api/projects \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Projeto Teste",
    "description": "Testando sistema de auditoria",
    "technologies": ["React"]
  }'
```

### 3.3 Verificar Log no Banco

```sql
SELECT * FROM audit_logs 
WHERE action = 'project.create' 
ORDER BY created_at DESC 
LIMIT 1;
```

**Deve aparecer um log com:**
- `action`: `project.create`
- `resource_type`: `project`
- `resource_id`: ID do projeto criado
- `user_id`: Seu ID de usuário
- `ip_address`: Seu IP
- `details`: JSON com informações do projeto

---

## 📊 Passo 4: Testar Endpoints de Auditoria

### 4.1 Listar Todos os Logs (Admin)

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?limit=10" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

**Resposta esperada:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {...}
}
```

### 4.2 Filtrar por Ação

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs?action=user.login" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

### 4.3 Ver Logs de um Usuário

```bash
curl -X GET "http://localhost:5000/api/admin/audit-logs/user/1" \
  -H "Authorization: Bearer SEU_ACCESS_TOKEN_ADMIN"
```

---

## ✅ Checklist Rápido

- [ ] Script `npm run test:audit` executa sem erros
- [ ] Login gera log (`user.login`)
- [ ] Criar projeto gera log (`project.create`)
- [ ] Endpoint `/api/admin/audit-logs` retorna logs (admin)
- [ ] Usuário não-admin recebe 403 ao acessar logs

---

## 🐛 Problemas Comuns

### "Tabela audit_logs não existe"
```bash
npm run db:migrate
```

### "Acesso negado" (403)
```sql
UPDATE users SET is_admin = TRUE WHERE email = 'seu-email@exemplo.com';
```

### "Nenhum log encontrado"
Execute algumas ações na aplicação (login, criar projeto, etc.) e verifique novamente.

---

## 📚 Documentação Completa

Para testes mais detalhados, consulte: **`GUIA-TESTE-AUDITORIA.md`**

---

**Tempo estimado:** 5 minutos


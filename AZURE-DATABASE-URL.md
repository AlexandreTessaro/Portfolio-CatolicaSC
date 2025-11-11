# 🔗 DATABASE_URL para Azure PostgreSQL

## 📋 **Suas Informações:**

- **Host**: `startup-collab-db.postgres.database.azure.com`
- **Port**: `5432`
- **Database**: `postgres`
- **User**: `alexandre` (administrator login) ou `al.vieira@catolicasc.edu.br` (Azure AD)

---

## 🔐 **Opção 1: Autenticação Tradicional (Senha)**

Se você criou uma senha para o usuário `alexandre`, use:

```
postgresql://alexandre:9MTciAThHmNhJ4D@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

**Substitua `SENHA_AQUI` pela senha real do PostgreSQL.**

---

## 🔐 **Opção 2: Autenticação Azure AD**

Para Azure AD, a connection string é mais complexa. Você tem duas opções:

### A) Usar Managed Identity (Recomendado)

1. No App Service, vá em **"Identity"**
2. Ative **"System assigned"** → **"On"** → **"Save"**
3. No PostgreSQL, adicione essa Managed Identity como usuário

Depois use variáveis individuais em vez de `DATABASE_URL`:
```env
DB_HOST=startup-collab-db.postgres.database.azure.com
DB_PORT=5432
DB_USER=alexandre
DB_NAME=postgres
DB_SSL=true
```

### B) Connection String com Token (Mais Complexo)

Para Azure AD, você precisaria obter o token dinamicamente. Isso requer código adicional.

---

## ✅ **RECOMENDAÇÃO: Criar Usuário com Senha**

A forma mais simples é criar um usuário PostgreSQL tradicional com senha:

### 1. No Portal Azure:

1. Vá para o PostgreSQL (`startup-collab-db`)
2. Vá em **"Query editor"** (ou use Azure CLI)
3. Execute:

```sql
-- Criar usuário para a aplicação
CREATE USER appuser WITH PASSWORD 'SuaSenhaForteAqui123!@#';

-- Dar permissões
GRANT ALL PRIVILEGES ON DATABASE postgres TO appuser;

-- Dar permissões no schema public
\c postgres
GRANT ALL ON SCHEMA public TO appuser;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO appuser;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO appuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO appuser;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO appuser;
```

### 2. Use esta DATABASE_URL:

```
postgresql://appuser:SuaSenhaForteAqui123!@#@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

**⚠️ IMPORTANTE**: Substitua `SuaSenhaForteAqui123!@#` pela senha real que você criou!

---

## 📝 **Como Adicionar no Azure App Service:**

1. No App Service → **"Configuration"** → **"Application settings"**
2. Se já existe `DATABASE_URL`, clique nela para editar
3. Se não existe, clique em **"+ Add"**
4. **Name**: `DATABASE_URL`
5. **Value**: Cole a connection string completa
6. Clique em **"OK"**
7. Clique em **"Save"** no topo

---

## 🔍 **Verificar DATABASE_URL Atual:**

No Azure App Service:
1. Vá em **"Configuration"** → **"Application settings"**
2. Procure por `DATABASE_URL`
3. Clique no ícone do **olho** 👁️ para mostrar o valor
4. Verifique se está correto

---

## ⚠️ **Formato Correto:**

A connection string deve seguir este formato:
```
postgresql://[usuario]:[senha]@[host]:[port]/[database]?sslmode=require
```

**Exemplo completo:**
```
postgresql://appuser:MinhaSenha123!@startup-collab-db.postgres.database.azure.com:5432/postgres?sslmode=require
```

---

## 🐛 **Se Não Funcionar:**

1. **Verifique o firewall**: PostgreSQL → Networking → Permitir Azure services
2. **Verifique a senha**: Teste a conexão localmente primeiro
3. **Use variáveis individuais**: Em vez de `DATABASE_URL`, use `DB_HOST`, `DB_USER`, etc.

---

**💡 Dica**: A forma mais fácil é criar um usuário com senha (Opção "Criar Usuário com Senha" acima)!


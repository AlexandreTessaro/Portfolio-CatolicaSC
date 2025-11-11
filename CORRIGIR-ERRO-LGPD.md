# 🔧 Corrigir Erro: "column consent_accepted does not exist"

Este erro ocorre porque as colunas de LGPD ainda não foram criadas no banco de dados.

## ✅ Solução Rápida

### Opção 1: Executar Migração (Recomendado)

No terminal, dentro da pasta `backend`, execute:

```bash
npm run db:migrate
```

Isso irá:
- ✅ Adicionar as colunas `consent_accepted` e `consent_timestamp` na tabela `users`
- ✅ Criar a tabela `user_consents` para log de consentimentos
- ✅ Criar os índices necessários

### Opção 2: Executar SQL Manualmente

Se preferir, você pode executar o SQL diretamente no banco:

1. Conecte-se ao PostgreSQL (via psql, pgAdmin, ou DBeaver)
2. Execute o arquivo: `backend/scripts/add-lgpd-columns.sql`

Ou execute este SQL diretamente:

```sql
-- Adicionar colunas de consentimento
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS consent_accepted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS consent_timestamp TIMESTAMP;

-- Criar tabela de consentimentos
CREATE TABLE IF NOT EXISTS user_consents (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  consent_type VARCHAR(50) NOT NULL,
  consent_version VARCHAR(20) NOT NULL,
  accepted BOOLEAN NOT NULL DEFAULT TRUE,
  ip_address VARCHAR(45),
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, consent_type, consent_version)
);

-- Criar índices
CREATE INDEX IF NOT EXISTS idx_user_consents_user_id ON user_consents(user_id);
CREATE INDEX IF NOT EXISTS idx_user_consents_type ON user_consents(consent_type);
```

### Opção 3: Via Docker (se estiver usando Docker)

```bash
# Se estiver usando Docker Compose
docker-compose exec backend npm run db:migrate

# Ou conecte ao container do banco
docker-compose exec db psql -U user -d mydb -f /docker-entrypoint-initdb.d/add-lgpd-columns.sql
```

## 🔍 Verificar se Funcionou

Após executar a migração, verifique:

```sql
-- Verificar se as colunas existem
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name IN ('consent_accepted', 'consent_timestamp');

-- Verificar se a tabela de consentimentos existe
SELECT * FROM information_schema.tables 
WHERE table_name = 'user_consents';
```

## ✅ Após Executar

1. Reinicie o backend (se estiver rodando)
2. Tente registrar um novo usuário novamente
3. O erro não deve mais aparecer

## 🐛 Se Ainda Der Erro

Se ainda der erro após executar a migração:

1. Verifique se está conectado ao banco correto
2. Verifique se as variáveis de ambiente estão corretas (`.env`)
3. Verifique os logs do backend para mais detalhes
4. Execute o SQL manualmente (Opção 2)


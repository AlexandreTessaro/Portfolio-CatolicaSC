-- Script para adicionar colunas de LGPD na tabela users
-- Execute este script se a migração não foi executada automaticamente

-- Adicionar colunas de consentimento (se não existirem)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'consent_accepted'
  ) THEN
    ALTER TABLE users ADD COLUMN consent_accepted BOOLEAN DEFAULT FALSE;
    RAISE NOTICE 'Coluna consent_accepted adicionada';
  ELSE
    RAISE NOTICE 'Coluna consent_accepted já existe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'consent_timestamp'
  ) THEN
    ALTER TABLE users ADD COLUMN consent_timestamp TIMESTAMP;
    RAISE NOTICE 'Coluna consent_timestamp adicionada';
  ELSE
    RAISE NOTICE 'Coluna consent_timestamp já existe';
  END IF;
END $$;

-- Criar tabela de consentimentos (se não existir)
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

-- Comentários
COMMENT ON TABLE user_consents IS 'Tabela para registrar consentimentos LGPD dos usuários';
COMMENT ON COLUMN users.consent_accepted IS 'Indica se o usuário aceitou os termos e política de privacidade';
COMMENT ON COLUMN users.consent_timestamp IS 'Data e hora em que o consentimento foi dado';


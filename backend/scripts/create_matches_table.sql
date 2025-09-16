-- Script de migração para criar tabela de matches
-- Execute este script no seu banco PostgreSQL

CREATE TABLE IF NOT EXISTS matches (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    message TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign keys
    FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    
    -- Constraints
    CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    CONSTRAINT valid_message_length CHECK (LENGTH(message) >= 10 AND LENGTH(message) <= 500),
    
    -- Unique constraint para evitar múltiplas solicitações do mesmo usuário para o mesmo projeto
    CONSTRAINT unique_user_project_match UNIQUE (user_id, project_id)
);

-- Índices para melhorar performance
CREATE INDEX IF NOT EXISTS idx_matches_project_id ON matches(project_id);
CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);
CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);
CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);

-- Trigger para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_updated_at 
    BEFORE UPDATE ON matches 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Comentários para documentação
COMMENT ON TABLE matches IS 'Tabela para armazenar solicitações de participação em projetos';
COMMENT ON COLUMN matches.project_id IS 'ID do projeto para o qual a solicitação foi enviada';
COMMENT ON COLUMN matches.user_id IS 'ID do usuário que enviou a solicitação';
COMMENT ON COLUMN matches.status IS 'Status da solicitação: pending, accepted, rejected, blocked';
COMMENT ON COLUMN matches.message IS 'Mensagem enviada junto com a solicitação (10-500 caracteres)';
COMMENT ON COLUMN matches.created_at IS 'Data e hora de criação da solicitação';
COMMENT ON COLUMN matches.updated_at IS 'Data e hora da última atualização da solicitação';

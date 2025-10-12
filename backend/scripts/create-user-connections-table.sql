-- Criar tabela de conexões entre usuários
CREATE TABLE IF NOT EXISTS user_connections (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(requester_id, receiver_id)
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_user_connections_requester ON user_connections(requester_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_receiver ON user_connections(receiver_id);
CREATE INDEX IF NOT EXISTS idx_user_connections_status ON user_connections(status);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION update_user_connections_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_user_connections_updated_at
    BEFORE UPDATE ON user_connections
    FOR EACH ROW
    EXECUTE FUNCTION update_user_connections_updated_at();

-- Comentários
COMMENT ON TABLE user_connections IS 'Tabela para gerenciar conexões diretas entre usuários';
COMMENT ON COLUMN user_connections.requester_id IS 'ID do usuário que solicitou a conexão';
COMMENT ON COLUMN user_connections.receiver_id IS 'ID do usuário que recebeu a solicitação';
COMMENT ON COLUMN user_connections.status IS 'Status da conexão: pending, accepted, rejected, blocked';
COMMENT ON COLUMN user_connections.message IS 'Mensagem opcional enviada com a solicitação';

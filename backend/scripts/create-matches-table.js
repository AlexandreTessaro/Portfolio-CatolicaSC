import pool from './src/config/database.js';

async function createMatchesTable() {
  try {
    console.log('🔄 Criando tabela matches...');
    
    const createTableSQL = `
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
    `;

    await pool.query(createTableSQL);
    console.log('✅ Tabela matches criada com sucesso!');

    // Criar índices
    const createIndexesSQL = [
      'CREATE INDEX IF NOT EXISTS idx_matches_project_id ON matches(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);',
      'CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);'
    ];

    for (const sql of createIndexesSQL) {
      await pool.query(sql);
    }
    console.log('✅ Índices criados com sucesso!');

    // Criar trigger para updated_at
    const createTriggerSQL = `
      CREATE OR REPLACE FUNCTION update_updated_at_column()
      RETURNS TRIGGER AS $$
      BEGIN
          NEW.updated_at = CURRENT_TIMESTAMP;
          RETURN NEW;
      END;
      $$ language 'plpgsql';

      DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
      CREATE TRIGGER update_matches_updated_at 
          BEFORE UPDATE ON matches 
          FOR EACH ROW 
          EXECUTE FUNCTION update_updated_at_column();
    `;

    await pool.query(createTriggerSQL);
    console.log('✅ Trigger criado com sucesso!');

    console.log('🎉 Migração concluída com sucesso!');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabela matches:', error);
  } finally {
    await pool.end();
  }
}

createMatchesTable();

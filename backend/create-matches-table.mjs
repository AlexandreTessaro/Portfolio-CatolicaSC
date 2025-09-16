import pool from './src/config/database.js';

async function createMatchesTable() {
  try {
    console.log('🔄 Criando tabela matches...');
    
    const sql = `
      CREATE TABLE IF NOT EXISTS matches (
          id SERIAL PRIMARY KEY,
          project_id INTEGER NOT NULL,
          user_id INTEGER NOT NULL,
          status VARCHAR(20) NOT NULL DEFAULT 'pending',
          message TEXT NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
          
          FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
          FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
          
          CONSTRAINT valid_status CHECK (status IN ('pending', 'accepted', 'rejected', 'blocked')),
          CONSTRAINT valid_message_length CHECK (LENGTH(message) >= 10 AND LENGTH(message) <= 500),
          CONSTRAINT unique_user_project_match UNIQUE (user_id, project_id)
      );
    `;
    
    await pool.query(sql);
    console.log('✅ Tabela matches criada com sucesso!');
    
    // Criar índices
    const indexes = [
      'CREATE INDEX IF NOT EXISTS idx_matches_project_id ON matches(project_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_user_id ON matches(user_id);',
      'CREATE INDEX IF NOT EXISTS idx_matches_status ON matches(status);',
      'CREATE INDEX IF NOT EXISTS idx_matches_created_at ON matches(created_at);'
    ];
    
    for (const indexSql of indexes) {
      await pool.query(indexSql);
    }
    console.log('✅ Índices criados com sucesso!');
    
    await pool.end();
    console.log('🎉 Migração concluída!');
    
  } catch (error) {
    console.error('❌ Erro:', error);
    await pool.end();
  }
}

createMatchesTable();

/**
 * Script de teste rápido para o sistema de auditoria
 * 
 * Uso:
 *   node scripts/test-audit.js
 * 
 * Requisitos:
 *   - Backend rodando na porta 5000
 *   - Usuário admin criado
 *   - Variáveis de ambiente configuradas
 */

import dotenv from 'dotenv';
import pg from 'pg';

dotenv.config();

const { Pool } = pg;

const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: parseInt(process.env.DB_PORT) || 5432,
        user: process.env.DB_USER || 'user',
        password: process.env.DB_PASSWORD || 'password',
        database: process.env.DB_NAME || 'mydb',
      }
);

async function testAuditSystem() {
  console.log('🧪 Testando Sistema de Auditoria\n');

  try {
    // 1. Verificar se a tabela existe
    console.log('1️⃣ Verificando tabela audit_logs...');
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'audit_logs'
      );
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('❌ Tabela audit_logs não existe! Execute a migração primeiro.');
      process.exit(1);
    }
    console.log('✅ Tabela audit_logs existe\n');

    // 2. Verificar estrutura da tabela
    console.log('2️⃣ Verificando estrutura da tabela...');
    const columns = await pool.query(`
      SELECT column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'audit_logs'
      ORDER BY ordinal_position;
    `);
    
    console.log('Colunas encontradas:');
    columns.rows.forEach(col => {
      console.log(`   - ${col.column_name} (${col.data_type})`);
    });
    console.log('');

    // 3. Contar logs existentes
    console.log('3️⃣ Contando logs existentes...');
    const countResult = await pool.query('SELECT COUNT(*) FROM audit_logs');
    const totalLogs = parseInt(countResult.rows[0].count, 10);
    console.log(`   Total de logs: ${totalLogs}\n`);

    // 4. Verificar logs por ação
    console.log('4️⃣ Verificando logs por ação...');
    const actionsResult = await pool.query(`
      SELECT action, COUNT(*) as total
      FROM audit_logs
      GROUP BY action
      ORDER BY total DESC;
    `);
    
    if (actionsResult.rows.length > 0) {
      console.log('Ações registradas:');
      actionsResult.rows.forEach(row => {
        console.log(`   - ${row.action}: ${row.total} log(s)`);
      });
    } else {
      console.log('   ⚠️ Nenhum log encontrado ainda');
    }
    console.log('');

    // 5. Verificar logs recentes (últimas 24 horas)
    console.log('5️⃣ Verificando logs recentes (últimas 24h)...');
    const recentLogs = await pool.query(`
      SELECT id, action, user_id, resource_type, resource_id, created_at
      FROM audit_logs
      WHERE created_at >= NOW() - INTERVAL '24 hours'
      ORDER BY created_at DESC
      LIMIT 10;
    `);
    
    if (recentLogs.rows.length > 0) {
      console.log(`   Encontrados ${recentLogs.rows.length} log(s) recente(s):`);
      recentLogs.rows.forEach(log => {
        console.log(`   - [${log.created_at.toISOString()}] ${log.action} (user: ${log.user_id || 'N/A'}, resource: ${log.resource_type || 'N/A'})`);
      });
    } else {
      console.log('   ⚠️ Nenhum log nas últimas 24 horas');
    }
    console.log('');

    // 6. Verificar índices
    console.log('6️⃣ Verificando índices...');
    const indexes = await pool.query(`
      SELECT indexname, indexdef
      FROM pg_indexes
      WHERE tablename = 'audit_logs';
    `);
    
    if (indexes.rows.length > 0) {
      console.log('Índices encontrados:');
      indexes.rows.forEach(idx => {
        console.log(`   - ${idx.indexname}`);
      });
    } else {
      console.log('   ⚠️ Nenhum índice encontrado');
    }
    console.log('');

    // 7. Testar inserção de log (simulação)
    console.log('7️⃣ Testando inserção de log...');
    try {
      const testLog = await pool.query(`
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, details, ip_address, user_agent, created_at)
        VALUES (NULL, 'test.audit_check', 'system', NULL, '{"test": true}', '127.0.0.1', 'test-script', NOW())
        RETURNING id, action, created_at;
      `);
      
      console.log(`   ✅ Log de teste criado: ID ${testLog.rows[0].id}`);
      
      // Limpar log de teste
      await pool.query('DELETE FROM audit_logs WHERE id = $1', [testLog.rows[0].id]);
      console.log('   ✅ Log de teste removido\n');
    } catch (error) {
      console.error('   ❌ Erro ao criar log de teste:', error.message);
    }

    // 8. Verificar usuários admin
    console.log('8️⃣ Verificando usuários administradores...');
    const admins = await pool.query(`
      SELECT id, email, name, is_admin
      FROM users
      WHERE is_admin = TRUE
      LIMIT 5;
    `);
    
    if (admins.rows.length > 0) {
      console.log(`   Encontrados ${admins.rows.length} administrador(es):`);
      admins.rows.forEach(admin => {
        console.log(`   - ${admin.email} (ID: ${admin.id})`);
      });
    } else {
      console.log('   ⚠️ Nenhum administrador encontrado');
      console.log('   💡 Dica: Execute: UPDATE users SET is_admin = TRUE WHERE email = \'seu-email@exemplo.com\';');
    }
    console.log('');

    console.log('✅ Teste do sistema de auditoria concluído!');
    console.log('\n📝 Próximos passos:');
    console.log('   1. Faça login na aplicação');
    console.log('   2. Execute algumas ações (criar projeto, fazer match, etc.)');
    console.log('   3. Verifique os logs usando os endpoints de auditoria');
    console.log('   4. Consulte o GUIA-TESTE-AUDITORIA.md para mais detalhes');

  } catch (error) {
    console.error('❌ Erro durante o teste:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executar teste
testAuditSystem();


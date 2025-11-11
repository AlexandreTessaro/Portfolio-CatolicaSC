# Guia de Testes - Conformidade LGPD

Este guia mostra como testar todas as funcionalidades de LGPD implementadas.

## 📋 Pré-requisitos

1. Backend rodando (porta 5000)
2. Frontend rodando (porta 5173)
3. Banco de dados PostgreSQL configurado e migrado

## 🧪 Testes Manuais

### 1. Testar Consentimento no Cadastro

#### Passo 1: Acessar página de registro
```
http://localhost:5173/register
```

#### Passo 2: Tentar cadastrar SEM marcar o checkbox
- Preencha nome, email e senha
- **NÃO** marque o checkbox "Eu concordo com os Termos de Uso..."
- Tente clicar em "Criar conta gratuitamente"
- **Resultado esperado**: Botão desabilitado ou mensagem de erro

#### Passo 3: Cadastrar COM consentimento
- Marque o checkbox de consentimento
- Preencha todos os campos
- Clique em "Criar conta gratuitamente"
- **Resultado esperado**: Conta criada com sucesso

#### Passo 4: Verificar no banco de dados
```sql
-- Verificar se consentimento foi registrado
SELECT id, email, name, consent_accepted, consent_timestamp 
FROM users 
ORDER BY created_at DESC 
LIMIT 1;

-- Verificar log de consentimentos
SELECT * FROM user_consents 
ORDER BY created_at DESC 
LIMIT 1;
```

**Resultado esperado**: 
- `consent_accepted = true`
- `consent_timestamp` preenchido
- Registro na tabela `user_consents`

---

### 2. Testar Páginas de Termos e Política

#### Teste 2.1: Acessar Termos de Uso
```
http://localhost:5173/terms
```
**Resultado esperado**: Página com conteúdo completo dos termos

#### Teste 2.2: Acessar Política de Privacidade
```
http://localhost:5173/privacy
```
**Resultado esperado**: Página com política de privacidade completa

#### Teste 2.3: Links no formulário de registro
- Acesse `/register`
- Verifique se os links "Termos de Uso" e "Política de Privacidade" abrem em nova aba
- **Resultado esperado**: Links funcionando e abrindo em nova aba

---

### 3. Testar Direito ao Esquecimento (API)

#### Passo 1: Fazer login e obter token
```bash
# Fazer login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "seu@email.com",
    "password": "suaSenha"
  }'
```

**Copie o `accessToken` da resposta**

#### Passo 2: Executar direito ao esquecimento
```bash
# Substitua YOUR_ACCESS_TOKEN pelo token obtido
curl -X DELETE http://localhost:5000/api/users/forget-me \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json"
```

**Resultado esperado**:
```json
{
  "success": true,
  "message": "Seus dados pessoais foram anonimizados conforme solicitado...",
  "data": {
    "anonymized": true
  }
}
```

#### Passo 3: Verificar anonimização no banco
```sql
-- Verificar dados anonimizados
SELECT id, email, name, bio, profile_image, social_links 
FROM users 
WHERE email LIKE 'deleted_%@deleted.local';

-- Verificar consentimentos revogados
SELECT * FROM user_consents 
WHERE user_id = SEU_USER_ID 
  AND accepted = false;
```

**Resultado esperado**:
- Email: `deleted_{userId}_{timestamp}@deleted.local`
- Nome: "Usuário Excluído"
- Bio: `NULL`
- Profile Image: `NULL`
- Social Links: `{}`
- Consentimentos: `accepted = false`

---

### 4. Testar via Frontend (Interface)

#### Opção 1: Usar Postman/Insomnia
1. Importe a coleção de requisições
2. Configure autenticação Bearer Token
3. Execute `DELETE /api/users/forget-me`

#### Opção 2: Criar botão no perfil (Futuro)
Você pode adicionar um botão "Excluir meus dados" na página de perfil:

```jsx
// Em frontend/src/pages/Profile.jsx
const handleForgetMe = async () => {
  if (!confirm('Tem certeza? Esta ação não pode ser desfeita.')) return;
  
  try {
    await userService.forgetMe(); // Você precisa criar este método
    alert('Seus dados foram anonimizados.');
    // Fazer logout
    logout();
    navigate('/login');
  } catch (error) {
    alert('Erro ao processar solicitação');
  }
};
```

---

### 5. Testar Log de Consentimentos

#### Verificar histórico de consentimentos
```sql
-- Ver todos os consentimentos de um usuário
SELECT 
  uc.id,
  uc.consent_type,
  uc.consent_version,
  uc.accepted,
  uc.ip_address,
  uc.user_agent,
  uc.created_at,
  u.email,
  u.name
FROM user_consents uc
JOIN users u ON uc.user_id = u.id
WHERE uc.user_id = SEU_USER_ID
ORDER BY uc.created_at DESC;
```

**Resultado esperado**: Histórico completo de consentimentos com IP, User Agent e timestamps

---

## 🧪 Testes Automatizados (Opcional)

### Criar teste com Jest/Supertest

Crie `backend/tests/lgpd.test.js`:

```javascript
import request from 'supertest';
import app from '../app.js';
import { pool } from '../src/config/database.js';

describe('LGPD Tests', () => {
  let authToken;
  let userId;

  beforeAll(async () => {
    // Criar usuário de teste
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'testlgpd@test.com',
        password: 'Test123!@#',
        name: 'Test User',
        consentAccepted: true
      });
    
    authToken = res.body.data.accessToken;
    userId = res.body.data.user.id;
  });

  test('Deve exigir consentimento no registro', async () => {
    const res = await request(app)
      .post('/api/users/register')
      .send({
        email: 'test2@test.com',
        password: 'Test123!@#',
        name: 'Test User 2',
        consentAccepted: false // SEM consentimento
      });
    
    expect(res.status).toBe(400);
    expect(res.body.message).toContain('Consentimento');
  });

  test('Deve registrar consentimento no banco', async () => {
    const result = await pool.query(
      'SELECT * FROM user_consents WHERE user_id = $1',
      [userId]
    );
    
    expect(result.rows.length).toBeGreaterThan(0);
    expect(result.rows[0].accepted).toBe(true);
  });

  test('Deve anonimizar dados no direito ao esquecimento', async () => {
    const res = await request(app)
      .delete('/api/users/forget-me')
      .set('Authorization', `Bearer ${authToken}`);
    
    expect(res.status).toBe(200);
    expect(res.body.data.anonymized).toBe(true);

    // Verificar no banco
    const user = await pool.query(
      'SELECT email, name FROM users WHERE id = $1',
      [userId]
    );
    
    expect(user.rows[0].email).toMatch(/deleted_.*@deleted\.local/);
    expect(user.rows[0].name).toBe('Usuário Excluído');
  });

  afterAll(async () => {
    await pool.end();
  });
});
```

---

## 📊 Checklist de Testes

- [ ] Checkbox de consentimento é obrigatório no registro
- [ ] Links de Termos e Política abrem corretamente
- [ ] Consentimento é registrado no banco de dados
- [ ] IP e User Agent são capturados no log
- [ ] Endpoint `/forget-me` anonimiza dados corretamente
- [ ] Consentimentos são revogados após esquecimento
- [ ] Dados anonimizados não podem ser identificados
- [ ] Páginas de Termos e Política são acessíveis sem login

---

## 🔍 Verificações Adicionais

### Verificar estrutura do banco
```sql
-- Verificar colunas de consentimento
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'users' 
  AND column_name IN ('consent_accepted', 'consent_timestamp');

-- Verificar tabela de consentimentos
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'user_consents';
```

### Verificar logs de auditoria
```sql
-- Ver ações relacionadas a LGPD
SELECT * FROM audit_logs
WHERE action LIKE '%consent%' OR action LIKE '%forget%'
ORDER BY created_at DESC;
```

---

## 🐛 Troubleshooting

### Problema: Checkbox não valida
**Solução**: Verifique se o `register('consent')` está no formulário e se a validação está correta.

### Problema: Consentimento não é salvo
**Solução**: 
1. Verifique se a migração foi executada
2. Verifique logs do backend
3. Confirme que `ConsentRepository` está sendo chamado

### Problema: Endpoint `/forget-me` retorna 401
**Solução**: 
1. Verifique se o token está sendo enviado
2. Confirme que o token é válido
3. Verifique middleware de autenticação

### Problema: Dados não são anonimizados
**Solução**:
1. Verifique se `UserRepository.update()` está funcionando
2. Confirme que o `userId` está correto
3. Verifique logs de erro no backend

---

## 📝 Notas

- Os dados anonimizados são mantidos para fins estatísticos e legais
- O email anonimizado não pode ser reutilizado
- Consentimentos revogados mantêm histórico para auditoria
- A anonimização é irreversível

---

## 🚀 Próximos Passos

1. Adicionar interface no perfil para exercer direitos LGPD
2. Implementar exportação de dados (portabilidade)
3. Adicionar notificação por email ao anonimizar
4. Criar dashboard de consentimentos para admin


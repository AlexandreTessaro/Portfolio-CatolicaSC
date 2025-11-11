# 🚀 Teste Rápido - LGPD

Guia rápido para testar as funcionalidades de LGPD em 5 minutos.

## ⚡ Teste Rápido (5 minutos)

### 1️⃣ Testar Consentimento no Cadastro (2 min)

1. **Acesse**: http://localhost:5173/register

2. **Teste SEM consentimento**:
   - Preencha nome, email e senha
   - **NÃO marque** o checkbox
   - Tente clicar em "Criar conta"
   - ✅ **Esperado**: Botão desabilitado ou erro

3. **Teste COM consentimento**:
   - Marque o checkbox ✅
   - Preencha todos os campos
   - Clique em "Criar conta"
   - ✅ **Esperado**: Conta criada com sucesso

---

### 2️⃣ Testar Páginas de Documentação (1 min)

- **Termos**: http://localhost:5173/terms
- **Política**: http://localhost:5173/privacy

✅ **Esperado**: Páginas carregam com conteúdo completo

---

### 3️⃣ Testar Direito ao Esquecimento (2 min)

#### Opção A: Via Console do Navegador

1. **Faça login** na aplicação
2. **Abra o Console** (F12)
3. **Execute**:

```javascript
// Obter token do localStorage
const token = localStorage.getItem('accessToken');

// Fazer requisição
fetch('http://localhost:5000/api/users/forget-me', {
  method: 'DELETE',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => {
  console.log('✅ Sucesso:', data);
  alert('Dados anonimizados! Faça logout.');
})
.catch(err => console.error('❌ Erro:', err));
```

#### Opção B: Via cURL (Terminal)

```bash
# 1. Fazer login e copiar o token
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"seu@email.com","password":"suaSenha"}'

# 2. Usar o token (substitua YOUR_TOKEN)
curl -X DELETE http://localhost:5000/api/users/forget-me \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

✅ **Esperado**: 
```json
{
  "success": true,
  "message": "Seus dados pessoais foram anonimizados...",
  "data": { "anonymized": true }
}
```

---

## 🔍 Verificação Rápida no Banco

```sql
-- Ver último usuário criado
SELECT id, email, name, consent_accepted, consent_timestamp 
FROM users 
ORDER BY created_at DESC 
LIMIT 1;

-- Ver consentimentos
SELECT * FROM user_consents 
ORDER BY created_at DESC 
LIMIT 1;

-- Ver usuários anonimizados
SELECT id, email, name 
FROM users 
WHERE email LIKE 'deleted_%@deleted.local';
```

---

## ✅ Checklist Rápido

- [ ] Checkbox obrigatório no registro
- [ ] Links de Termos/Política funcionam
- [ ] Consentimento salvo no banco
- [ ] Endpoint `/forget-me` funciona
- [ ] Dados são anonimizados corretamente

---

## 🐛 Problemas Comuns

**Erro 401 no `/forget-me`**:
- Verifique se está logado
- Confirme que o token está sendo enviado

**Consentimento não salva**:
- Execute a migração: `npm run db:migrate`
- Verifique logs do backend

**Páginas não carregam**:
- Verifique se o frontend está rodando
- Confirme rotas no `App.jsx`

---

## 📝 Próximo Passo

Para testes completos, veja: **[GUIA-TESTE-LGPD.md](./GUIA-TESTE-LGPD.md)**


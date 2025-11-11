# 🎥 Guia para Vídeo de Demonstração - Aplicação Completa

## 📋 Requisitos do Vídeo

- ✅ **Duração máxima**: 3 minutos
- ✅ **Áudio obrigatório**: Explicar o que está sendo mostrado
- ✅ **Edição mínima**: Sem cortes excessivos
- ✅ **Ferramenta sugerida**: OBS Studio
- ✅ **Mostrar**: Todas as funcionalidades com fluxo lógico
- ✅ **Evidenciar**: Persistência dos dados

---

## 🔄 FLUXO LÓGICO - O que demonstrar

O **fluxo lógico** é a sequência de ações do usuário navegando pela aplicação. Demonstre na seguinte ordem:

### 1. **Cadastro de Usuário** (0:00 - 0:30)
- Acessar `/register`
- Preencher formulário (nome, email, senha)
- Mostrar validações em tempo real
- Clicar em "Criar conta"
- **Evidência de persistência**: 
  - ✅ Usuário criado → Banco de dados
  - Mostrar no backend (logs do Koyeb) OU fazer novo login

### 2. **Login e Autenticação** (0:30 - 0:50)
- Acessar `/login`
- Inserir credenciais do usuário criado
- **Evidência**: Token JWT gerado e salvo (mostrar no DevTools → Application → LocalStorage)

### 3. **Criação de Projeto** (0:50 - 1:20)
- Navegar para `/projects/create`
- Preencher:
  - Título, descrição
  - Objetivos (adicionar múltiplos)
  - Tecnologias desejadas
  - Status, categoria
- Clicar em "Criar projeto"
- **Evidência de persistência**:
  - ✅ Projeto aparece na lista `/projects`
  - ✅ Projeto criado → Banco de dados (tabela `projects`)
  - Mostrar detalhes do projeto criado

### 4. **Busca e Filtros** (1:20 - 1:35)
- Acessar `/projects`
- Usar filtros (tecnologia, status, categoria)
- **Evidência**: Resultados filtrados vêm do banco

### 5. **Sistema de Match/Solicitações** (1:35 - 2:10)
- Visualizar projeto de outro usuário (`/projects/:id`)
- Clicar em "Solicitar participação"
- Enviar mensagem
- **Evidência de persistência**:
  - ✅ Solicitação salva → Banco (`collaboration_requests`)
  - Mostrar em "Matches recebidos" (criador do projeto)
  - Aceitar/rejeitar solicitação
  - ✅ Status atualizado no banco

### 6. **Edição de Perfil** (2:10 - 2:30)
- Acessar `/profile`
- Atualizar: nome, bio, habilidades, redes sociais
- Salvar
- **Evidência de persistência**:
  - ✅ Mudanças refletem imediatamente
  - ✅ Dados atualizados no banco (tabela `users`)
  - Mostrar perfil público para confirmar

### 7. **Sistema de Recomendações** (2:30 - 2:50)
- Mostrar porcentagem de match em projetos
- **Evidência**: Cálculo baseado em skills do usuário vs tecnologias do projeto (dados do banco)

### 8. **Finalização** (2:50 - 3:00)
- Mostrar dashboard/resumo
- **Evidência final**: Todos os dados persistem após refresh/relogin

---

## 💾 PERSISTÊNCIA DOS DADOS - Como evidenciar

A **persistência** significa que os dados salvos no banco permanecem mesmo após fechar o navegador ou reiniciar o servidor.

### **Estratégias para demonstrar:**

#### **Opção 1: Mostrar via API/Banco (Recomendado)**
1. Após cada ação importante (cadastro, criar projeto, etc.)
2. Abrir nova aba → Fazer requisição direta à API:
   ```
   https://olympic-mandie-portfolio-catolicasc-ddfd6b64.koyeb.app/api/users/public/1
   ```
3. Mostrar JSON retornado → **Dados vêm do banco PostgreSQL**

#### **Opção 2: Mostrar via Console do Backend (Koyeb)**
1. Após criar usuário/projeto
2. Abrir Koyeb → Services → Console (logs)
3. Mostrar logs de INSERT/UPDATE no banco
4. Ou mostrar query direta no Neon (se tiver acesso)

#### **Opção 3: Fluxo de Relogin (Mais Simples)**
1. Criar projeto → Logout
2. Login novamente → **Projeto ainda está lá**
3. Editar perfil → Fechar navegador
4. Reabrir → Login → **Mudanças persistem**

#### **Opção 4: Comparação Antes/Depois**
1. Antes: Mostrar lista vazia de projetos
2. Criar 2-3 projetos
3. Depois: Mostrar lista populada
4. **Evidência**: Dados persistem entre ações

---

## 🎬 Script Sugerido para o Vídeo

### **0:00 - 0:15 | Introdução**
> "Esta é a aplicação Collabra, uma plataforma de colaboração para startups. Vou demonstrar o fluxo completo e como os dados persistem no banco."

### **0:15 - 0:45 | Cadastro**
> "Primeiro, vou criar uma nova conta. Preencho os dados... [clicar em criar] Veja que o usuário foi salvo no banco de dados PostgreSQL."

**Evidência**: Mostrar resposta da API ou novo login funcionando.

### **0:45 - 1:00 | Login**
> "Faço login... [mostrar token sendo gerado] O token JWT é criado e salvo localmente para manter a sessão."

### **1:00 - 1:30 | Criar Projeto**
> "Agora vou criar um projeto de startup. Preencho título, descrição, tecnologias... [salvar] O projeto foi persistido no banco e aparece na lista."

**Evidência**: Lista de projetos atualizada.

### **1:30 - 2:00 | Match/Solicitações**
> "Vou solicitar participação em outro projeto... [enviar] A solicitação foi salva. O criador pode aceitar ou rejeitar, e o status é atualizado no banco."

**Evidência**: Mostrar match sendo aceito → usuário aparece na equipe.

### **2:00 - 2:20 | Edição de Perfil**
> "Atualizo meu perfil... [salvar] As mudanças são persistidas imediatamente."

**Evidência**: Atualizar página → dados ainda lá.

### **2:20 - 2:45 | Persistência Final**
> "Para demonstrar persistência, vou fazer logout, fechar o navegador, e fazer login novamente... [fazer isso] Todos os dados criados anteriormente persistem no banco PostgreSQL."

### **2:45 - 3:00 | Conclusão**
> "A aplicação demonstra persistência completa dos dados usando PostgreSQL e foi desenvolvida seguindo princípios SOLID e Clean Code."

---

## 🔍 Onde Mostrar Dados Persistindo

### **Pontos-chave para evidenciar:**

1. **Tabela `users`**:
   - Cadastro → Login funciona
   - Edição de perfil → Mudanças aparecem

2. **Tabela `projects`**:
   - Criar projeto → Aparece na lista
   - Editar projeto → Mudanças salvas

3. **Tabela `collaboration_requests`**:
   - Enviar solicitação → Criador vê em "Matches recebidos"
   - Aceitar → Usuário adicionado à equipe

4. **Tabela `user_connections`** (se implementado):
   - Conectar com usuário → Conexão salva

---

## ✅ Checklist Antes de Gravar

- [ ] Servidor backend rodando (Koyeb Healthy)
- [ ] Frontend deployado (Vercel)
- [ ] Banco de dados conectado (Neon)
- [ ] Conta de teste criada
- [ ] Projetos de exemplo criados
- [ ] OBS Studio configurado (áudio + tela)
- [ ] Testar fluxo completo antes de gravar
- [ ] Script do vídeo preparado

---

## 📝 Dicas Técnicas para o Vídeo

### **Demonstrar Arquitetura (se necessário):**
- Backend: Node.js + Express + PostgreSQL
- Frontend: React + Vite
- Autenticação: JWT
- Deploy: Koyeb (backend) + Vercel (frontend)

### **Mostrar em Ação:**
- ✅ Validações em tempo real
- ✅ Feedback visual (loading, sucesso, erro)
- ✅ Navegação fluida entre páginas
- ✅ Respostas rápidas da API

---

**🎯 Objetivo**: Demonstrar que a aplicação não apenas funciona, mas **salva e recupera dados** corretamente do banco, mostrando persistência real.



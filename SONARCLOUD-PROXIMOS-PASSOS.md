# 🎯 Próximos Passos - Configuração SonarCloud

Você está logado no SonarCloud! Agora siga estes passos:

---

## 📋 Passo 1: Obter o Nome da Organização

1. No canto superior direito, clique no seu **ícone de perfil** (ou no nome)
2. Veja o nome da organização (geralmente é seu username do GitHub)
3. **Anote esse nome** - você precisará dele!

**Exemplo:** Se aparecer "Alexandre Tessaro Vieira", esse é o nome da organização.

---

## 🔑 Passo 2: Gerar Token do SonarCloud

1. Clique no seu **ícone de perfil** (canto superior direito)
2. Clique em **My Account**
3. No menu lateral esquerdo, clique em **Security**
4. Na seção **Generate Tokens**, digite um nome: `github-actions`
5. Clique em **Generate**
6. **⚠️ COPIE O TOKEN IMEDIATAMENTE!** Ele não será exibido novamente.

**Exemplo de token:** `abc123def456ghi789jkl012mno345pqr678stu901vwx234yz`

---

## 🆕 Passo 3: Criar os Projetos (2 opções)

### Opção A: Criar Projetos Manualmente (Recomendado)

1. No topo da página, clique no botão **"+"** (plus icon) ou **"Analyze a project"**
2. Selecione **"From GitHub"** ou **"Manually"**
3. Se escolher **"Manually"**:
   - **Project Key:** `startup-collab-backend`
   - **Display Name:** `Startup Collab Platform - Backend`
   - Clique em **Set Up**
4. Repita para criar o segundo projeto:
   - **Project Key:** `startup-collab-frontend`
   - **Display Name:** `Startup Collab Platform - Frontend`
   - Clique em **Set Up**

### Opção B: Deixar o GitHub Actions Criar Automaticamente

Se você não criar os projetos manualmente, o GitHub Actions criará automaticamente na primeira execução. Mas é melhor criar manualmente para ter controle.

---

## 🔐 Passo 4: Configurar Secrets no GitHub

1. Abra seu repositório no GitHub: `Portfolio-CatolicaSC`
2. Vá em **Settings** (no topo do repositório)
3. No menu lateral esquerdo, clique em **Secrets and variables** → **Actions**
4. Clique em **New repository secret**

### Secret 1: SONAR_TOKEN
- **Name:** `SONAR_TOKEN`
- **Secret:** Cole o token que você copiou no Passo 2
- Clique em **Add secret**

### Secret 2: SONAR_ORGANIZATION
- Clique em **New repository secret** novamente
- **Name:** `SONAR_ORGANIZATION`
- **Secret:** Cole o nome da organização (do Passo 1)
- Clique em **Add secret**

---

## ✅ Passo 5: Verificar Configuração

Você deve ter:
- ✅ Token gerado no SonarCloud
- ✅ Nome da organização anotado
- ✅ 2 projetos criados (ou deixar criar automaticamente):
  - `startup-collab-backend`
  - `startup-collab-frontend`
- ✅ 2 secrets configurados no GitHub:
  - `SONAR_TOKEN`
  - `SONAR_ORGANIZATION`

---

## 🚀 Passo 6: Testar a Integração

1. Faça um commit pequeno ou abra um Pull Request
2. Vá em **Actions** no GitHub
3. Você verá o workflow **"SonarCloud Analysis"** executando
4. Aguarde a conclusão (pode levar alguns minutos)
5. Volte ao SonarCloud e veja os resultados!

---

## 🐛 Troubleshooting

### Erro: "Organization not found"
- Verifique se o nome da organização está correto (case-sensitive)
- Deve ser exatamente como aparece no SonarCloud

### Erro: "Invalid token"
- Gere um novo token no SonarCloud
- Atualize o secret `SONAR_TOKEN` no GitHub

### Projetos não aparecem
- Aguarde alguns minutos após a primeira análise
- Verifique os logs do GitHub Actions para erros

---

## 📊 O que Esperar

Após a primeira análise bem-sucedida, você verá:
- ✅ Métricas de qualidade de código
- ✅ Cobertura de testes
- ✅ Bugs e vulnerabilidades encontrados
- ✅ Code smells
- ✅ Technical debt

---

**Pronto! Siga esses passos e seu SonarCloud estará funcionando! 🎉**


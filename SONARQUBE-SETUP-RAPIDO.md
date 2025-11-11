# ⚡ Setup Rápido - SonarCloud (5 minutos)

## 🚀 Passo a Passo

### 1. Criar Conta SonarCloud

1. Acesse: https://sonarcloud.io
2. Clique em **Log in with GitHub**
3. Autorize o SonarCloud

### 2. Criar Organização

1. Clique em **Create Organization**
2. Nome: `seu-usuario-github` (ou outro nome)
3. Plano: **Free**

### 3. Adicionar Projeto

1. Clique em **Analyze a project**
2. Selecione seu repositório GitHub
3. SonarCloud criará automaticamente:
   - `startup-collab-backend`
   - `startup-collab-frontend`

### 4. Obter Token

1. **My Account** → **Security**
2. **Generate Token**
3. Nome: `github-actions`
4. **Copie o token!**

### 5. Configurar GitHub Secrets

No GitHub, vá em:
**Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Adicione:

```
Name: SONAR_TOKEN
Value: <token-copiado>
```

```
Name: SONAR_ORGANIZATION
Value: <nome-da-organizacao>
```

### 6. Verificar

1. Faça um commit ou abra um PR
2. O workflow `.github/workflows/sonarcloud.yml` executará automaticamente
3. Veja os resultados em: https://sonarcloud.io

---

## ✅ Pronto!

O SonarCloud agora analisará seu código automaticamente em cada PR e push.

---

**Documentação completa:** `GUIA-SONARQUBE.md`


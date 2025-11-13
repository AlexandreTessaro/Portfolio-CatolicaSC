# 🎯 Criar Quality Gate Customizado no SonarCloud

## Por que criar um Quality Gate customizado?

O Quality Gate "Sonar way" padrão é muito rigoroso para projetos em desenvolvimento:
- **Coverage >= 80%** (pode ser difícil de atingir inicialmente)
- **Duplicated Lines <= 3%** (muito restritivo)
- **No new bugs** (qualquer bug novo falha)

## Passo a Passo

### 1. Criar Quality Gate Customizado

1. Acesse: https://sonarcloud.io/quality_gates
2. Clique em **"Create"** ou **"+"**
3. Nome: `Startup Collab - Custom`
4. Descrição: `Quality Gate customizado para projeto em desenvolvimento`

### 2. Configurar Condições

#### Condições para "New Code" (Código Novo):

**Reliability (Confiabilidade):**
- ✅ **No new bugs** (manter)
- ✅ **Reliability rating is A** (manter)

**Security (Segurança):**
- ✅ **No new vulnerabilities** (manter - CRÍTICO)
- ✅ **Security rating is A** (manter)
- ✅ **Security Hotspots Reviewed is 100%** (manter)

**Maintainability (Manutenibilidade):**
- ✅ **Maintainability rating is A** (manter)

**Coverage (Cobertura):**
- ⚙️ **Coverage is greater than or equal to 70.0%** (ajustar de 80% para 70%)
  - Clique em **"Add Condition"** → **"Coverage"** → **"on New Code"**
  - Operator: **"is greater than or equal to"**
  - Error: **70**

**Duplications (Duplicação):**
- ⚙️ **Duplicated Lines (%) is less than or equal to 5.0%** (ajustar de 3% para 5%)
  - Clique em **"Add Condition"** → **"Duplicated Lines (%)"** → **"on New Code"**
  - Operator: **"is less than or equal to"**
  - Error: **5**

### 3. Aplicar ao Projeto

1. Vá em: https://sonarcloud.io/project/settings?id=startup-collab-backend
2. Clique em **"Quality Gate"** no menu lateral
3. Selecione **"Startup Collab - Custom"**
4. Clique em **"Save"**

### 4. Verificar Resultado

Após o próximo push, o Quality Gate customizado será usado e deve passar se:
- Coverage >= 70% (em vez de 80%)
- Duplicated Lines <= 5% (em vez de 3%)
- Outras condições permanecem as mesmas

## Alternativa: Ajustar Thresholds Temporariamente

Se preferir manter o "Sonar way" mas ajustar temporariamente:

1. Vá em: https://sonarcloud.io/quality_gates/show/1
2. Clique em **"Copy"** para criar uma cópia
3. Ajuste os thresholds conforme acima
4. Aplique ao projeto

## Recomendações por Fase do Projeto

### Desenvolvimento Inicial:
- Coverage: **60-70%**
- Duplicated Lines: **5-7%**

### Desenvolvimento Avançado:
- Coverage: **70-80%**
- Duplicated Lines: **3-5%**

### Produção:
- Coverage: **80%+**
- Duplicated Lines: **< 3%**
- Usar "Sonar way" padrão

## Verificar Métricas Atuais

No dashboard do projeto, verifique:
- **Coverage atual**: X%
- **Duplicated Lines**: X%
- **Bugs**: X
- **Vulnerabilities**: X

Isso ajudará a definir thresholds apropriados.


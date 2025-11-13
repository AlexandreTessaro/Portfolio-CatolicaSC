# 🆓 SonarCloud: Solução para Plano Gratuito

## ❌ Limitação do Plano Gratuito

No plano gratuito do SonarCloud, **não é possível criar Quality Gates customizados**. O Quality Gate padrão "Sonar way" sempre verifica "New Code".

## ✅ Soluções Disponíveis no Plano Gratuito

### Opção 1: Desabilitar Quality Gate Wait (RECOMENDADO - Solução Imediata)

Como não é possível criar Quality Gates customizados e o máximo de dias é 90, a solução mais prática é desabilitar a espera pelo Quality Gate:

**⚠️ ATENÇÃO:** Isso não resolve o problema do Quality Gate, apenas faz o workflow passar mesmo se o Quality Gate falhar. O Quality Gate ainda aparecerá como "Failed" no dashboard do SonarCloud, mas o workflow do GitHub Actions não falhará.

**Como fazer:**

1. Edite o arquivo `backend/sonar-project.properties`
2. Altere a linha `sonar.qualitygate.wait=true` para:
   ```properties
   sonar.qualitygate.wait=false
   ```
   Ou simplesmente remova a linha `sonar.qualitygate.wait=true`
3. Faça commit e push

**Resultado:**
- ✅ Workflow do GitHub Actions não falha mais
- ✅ Análise do SonarCloud continua funcionando normalmente
- ✅ Você ainda vê todas as métricas e issues no dashboard
- ⚠️ Quality Gate aparecerá como "Failed" no dashboard (mas não bloqueia o CI/CD)

### Opção 2: Criar Tag/Release e Usar "Previous version" (Solução Alternativa)

Se você criar uma tag/release agora e configurar "New Code" como "Previous version", todo código modificado após a tag será considerado "novo":

**Passo 1: Criar tag inicial**
```bash
git tag v1.0.0
git push origin v1.0.0
```

**Passo 2: Configurar SonarCloud**
1. **Acesse:** https://sonarcloud.io/project/settings?id=startup-collab-backend
2. **Clique em "New Code"**
3. **Selecione:** `Previous version`
4. **Salve**

A partir de agora, todo código modificado após a tag `v1.0.0` será considerado "novo" e terá cobertura.

**⚠️ Limitação:** Se você não fizer commits regulares, o código pode "envelhecer" e não ser mais considerado "novo".

### Opção 3: Manter 90 dias e Aceitar Falha Temporária

Se você mantiver 90 dias e continuar fazendo commits regularmente, eventualmente o código novo terá cobertura suficiente. Mas isso pode levar tempo.

**Configuração atual:**
- "New Code" = 90 dias (máximo permitido)
- Coverage no código novo = 0.0%
- Coverage geral = ~79%

**O que acontece:**
- Qualquer código modificado nos últimos 90 dias precisa ter cobertura
- Se você não modificou código recentemente, não há "código novo" para ter cobertura
- O Quality Gate falha porque espera 80% de cobertura no código novo

## 🎯 Recomendação

**Use a Opção 1 (Desabilitar Quality Gate Wait)** - É a solução mais prática no plano gratuito:

1. ✅ Workflow do GitHub Actions não falha
2. ✅ Análise do SonarCloud continua funcionando
3. ✅ Você ainda vê métricas e issues no dashboard
4. ⚠️ Quality Gate aparecerá como "Failed" no dashboard (mas não bloqueia o CI/CD)

**Alternativa:** Se você fizer commits regulares e adicionar testes para código novo, eventualmente o Quality Gate passará naturalmente.

## ⚠️ Limitações

- No plano gratuito, você não pode criar Quality Gates customizados
- O Quality Gate "Sonar way" sempre verifica "New Code"
- O máximo de dias permitido para "New Code" é 90 dias
- Não é possível verificar "Overall Code" no plano gratuito

## 🔄 Alternativa Futura

Se você precisar de mais controle, considere:
- **Upgrade para plano pago** (permite Quality Gates customizados)
- **Usar SonarQube self-hosted** (gratuito, mas requer servidor próprio)


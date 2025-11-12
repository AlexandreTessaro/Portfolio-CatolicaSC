# 🔧 Corrigir Coverage Zerado no SonarCloud

## ❌ Problema

O SonarCloud está mostrando **0.0% de coverage** mesmo tendo testes, porque:
- O Vitest não estava gerando o arquivo `lcov.info` (formato necessário para o SonarCloud)
- O SonarCloud precisa do formato **LCOV** para ler os dados de coverage

## ✅ Solução Aplicada

Adicionado `'lcov'` ao reporter do coverage nos arquivos de configuração:

### Backend (`backend/vitest.config.js`)
```js
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'], // ← Adicionado 'lcov'
  ...
}
```

### Frontend (`frontend/vitest.config.js`)
```js
coverage: {
  provider: 'v8',
  reporter: ['text', 'json', 'html', 'lcov'], // ← Adicionado 'lcov'
  ...
}
```

## 📋 O Que Foi Feito

1. ✅ Adicionado `'lcov'` ao reporter do coverage no backend
2. ✅ Adicionado `'lcov'` ao reporter do coverage no frontend
3. ✅ O workflow já estava configurado corretamente para ler `coverage/lcov.info`

## 🚀 Próximos Passos

1. **Fazer commit e push** das alterações:
   ```bash
   git add backend/vitest.config.js frontend/vitest.config.js
   git commit -m "fix: adiciona reporter lcov para SonarCloud coverage"
   git push origin main
   ```

2. **Aguardar o workflow executar** automaticamente

3. **Verificar o coverage** no SonarCloud após a execução:
   - Backend: https://sonarcloud.io/dashboard?id=startup-collab-backend
   - Frontend: https://sonarcloud.io/dashboard?id=startup-collab-frontend

## 📊 Resultado Esperado

Após o próximo push:
- ✅ O arquivo `coverage/lcov.info` será gerado durante os testes
- ✅ O SonarCloud vai ler esse arquivo e mostrar o coverage real
- ✅ O coverage não estará mais zerado

## 🔍 Verificação Local (Opcional)

Para testar localmente antes de fazer push:

### Backend:
```bash
cd backend
npm test
# Verificar se o arquivo foi criado:
ls coverage/lcov.info
```

### Frontend:
```bash
cd frontend
npm run test:coverage
# Verificar se o arquivo foi criado:
ls coverage/lcov.info
```

Se os arquivos forem criados, está funcionando! ✅

---

## 📝 Nota sobre a Página Overview em Branco

A página Overview do Frontend pode estar em branco porque:
- É a primeira análise completa
- O SonarCloud precisa processar os dados
- Após o próximo push com coverage correto, a página deve ser preenchida

---

## ✅ Checklist

- [x] Adicionar `'lcov'` ao reporter do backend
- [x] Adicionar `'lcov'` ao reporter do frontend
- [ ] Fazer commit e push
- [ ] Aguardar workflow executar
- [ ] Verificar coverage no SonarCloud


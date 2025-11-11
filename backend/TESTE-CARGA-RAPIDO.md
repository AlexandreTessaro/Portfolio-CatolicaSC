# ⚡ Teste de Carga Rápido

## 🔍 Verificar se o Backend está Rodando

Antes de executar os testes, certifique-se de que o backend está rodando:

```bash
# Em outro terminal, inicie o backend
cd backend
npm run dev
```

Ou verifique se está rodando:
```bash
curl http://localhost:5000/health
```

Deve retornar:
```json
{
  "success": true,
  "message": "API funcionando corretamente"
}
```

## 🧪 Executar Teste de Carga

```bash
cd backend
npm run test:load
```

## 📊 Interpretar Resultados

### ✅ Bom Desempenho
- Tempo de resposta médio < 500ms
- 95% das requisições < 1s
- Taxa de erro < 1%
- Throughput > 50 req/s

### ⚠️ Atenção Necessária
- Tempo de resposta médio > 1s
- Taxa de erro > 5%
- Timeouts frequentes
- Throughput < 20 req/s

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED"
**Causa:** Backend não está rodando  
**Solução:** Inicie o backend com `npm run dev`

### Erro: "Many Errors"
**Causa:** Backend está retornando erros  
**Solução:** 
1. Verifique os logs do backend
2. Verifique se o banco de dados está conectado
3. Verifique se há dados de teste no banco

### Erro: "Timeout"
**Causa:** Backend está lento ou sobrecarregado  
**Solução:**
1. Reduza o `arrivalRate` no arquivo de configuração
2. Verifique a performance do banco de dados
3. Verifique se o Redis está funcionando (se habilitado)

## 📝 Ajustar Configuração

Para testar com menos carga, edite `artillery-config.yml`:

```yaml
phases:
  - duration: 30
    arrivalRate: 5  # Reduzir de 20 para 5
    name: "Teste Leve"
```

Para testar com mais carga:
```yaml
phases:
  - duration: 120
    arrivalRate: 200  # Aumentar de 50 para 200
    name: "Teste Pesado"
```


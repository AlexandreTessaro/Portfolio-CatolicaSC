# 📊 Diagramas PlantUML - Sistema de Recomendação

Este diretório contém diagramas PlantUML que explicam detalhadamente o sistema de recomendação da plataforma Startup Collab.

## 📋 Diagramas Disponíveis

### 1. **algoritmo-recomendacao-fluxo.puml** ⭐ RECOMENDADO PARA PÔSTER
**Tipo:** Diagrama de Atividade  
**Descrição:** Mostra o fluxo completo do algoritmo passo a passo, desde a solicitação até o cálculo do score final.

**Ideal para:** Entender o processo completo, visualizar em pôster

### 2. **algoritmo-recomendacao-componentes.puml**
**Tipo:** Diagrama de Componentes  
**Descrição:** Mostra os componentes do sistema de recomendação e como eles interagem entre si.

**Ideal para:** Entender arquitetura técnica, documentação

### 3. **algoritmo-recomendacao-exemplo.puml**
**Tipo:** Diagrama de Sequência  
**Descrição:** Exemplo prático mostrando um caso real de cálculo de score com dados específicos.

**Ideal para:** Entender exemplo prático, apresentações

### 4. **algoritmo-recomendacao-infografico.puml** ⭐ RECOMENDADO PARA PÔSTER
**Tipo:** Diagrama de Atividade (Infográfico)  
**Descrição:** Versão visual simplificada mostrando os 3 componentes principais e o cálculo final.

**Ideal para:** Pôster, apresentações rápidas, visualização rápida

## 🎯 Qual Usar no Pôster?

### Para o Pôster A0:
- **Recomendado:** `algoritmo-recomendacao-infografico.puml`
- **Alternativa:** `algoritmo-recomendacao-fluxo.puml`
- **Razão:** São mais visuais e fáceis de entender rapidamente

### Para Documentação:
- **Use:** `algoritmo-recomendacao-componentes.puml`
- **Razão:** Mostra arquitetura técnica completa

### Para Apresentação:
- **Use:** `algoritmo-recomendacao-exemplo.puml`
- **Razão:** Mostra exemplo prático com números reais

## 🚀 Como Gerar as Imagens

### Opção 1: PlantUML Online (Mais Rápido)
1. Acesse: https://www.plantuml.com/plantuml/uml/
2. Cole o conteúdo do arquivo `.puml`
3. Visualize e exporte como PNG/SVG

### Opção 2: VS Code Extension
1. Instale extensão "PlantUML"
2. Abra o arquivo `.puml`
3. Use `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"

### Opção 3: Exportar para SVG/PNG
```bash
# Gerar PNG de alta resolução
plantuml -tpng -SDPI=300 algoritmo-recomendacao-infografico.puml

# Gerar SVG (vetorial, melhor para impressão)
plantuml -tsvg algoritmo-recomendacao-infografico.puml

# Gerar PDF
plantuml -tpdf algoritmo-recomendacao-infografico.puml
```

## 📊 Descrição dos Componentes

### 1. Match de Skills (0-100%)
- Compara skills do usuário com tecnologias do projeto
- Conta quantas skills fazem match
- Calcula porcentagem baseada no total de skills do usuário

### 2. Bonus Histórico (0-10%)
- Verifica projetos aceitos anteriormente pelo usuário
- Compara tecnologias desses projetos com o projeto atual
- Calcula bonus proporcional (até 10%)

### 3. Bonus Categoria (0-5%)
- Verifica categoria do projeto atual
- Verifica se usuário já trabalhou em projetos da mesma categoria
- Aplica bonus fixo de 5% se verdadeiro

### 4. Score Final
- Soma os três componentes
- Limita ao máximo de 100%
- Arredonda para número inteiro

## 🎨 Exemplo de Uso no Pôster

1. **Gere o diagrama** `algoritmo-recomendacao-infografico.puml` como PNG/SVG
2. **Exporte em alta resolução** (300 DPI mínimo)
3. **Insira no pôster** na seção de algoritmo
4. **Ajuste tamanho** para ser legível à distância

## 📝 Notas

- Todos os diagramas foram criados seguindo as convenções UML
- Os diagramas são baseados no código real do `RecommendationService.js`
- Atualize os diagramas se houver mudanças no algoritmo
- Para o pôster, recomendo usar o infográfico simplificado

---

**Última atualização:** 2024  
**Versão:** 1.0  
**Projeto:** Startup Collab Platform - Católica SC







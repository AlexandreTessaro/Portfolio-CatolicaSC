# 📐 Diagramas UML da Arquitetura - Startup Collab Platform

Este diretório contém diagramas UML em formato PlantUML que descrevem a arquitetura completa da aplicação Startup Collab.

## 📋 Diagramas Disponíveis

### 1. **arquitetura-componentes.puml**
**Tipo:** Diagrama de Componentes  
**Descrição:** Mostra a arquitetura de alto nível com todos os componentes principais, suas tecnologias e como se comunicam.

**Elementos principais:**
- Frontend (React + Vite)
- Backend (Express.js)
- Banco de dados (PostgreSQL)
- Cache (Redis)
- Infraestrutura (Docker, Deploy)

### 2. **arquitetura-camadas.puml**
**Tipo:** Diagrama de Camadas (Clean Architecture)  
**Descrição:** Detalha a arquitetura em camadas do backend seguindo os princípios de Clean Architecture.

**Camadas:**
- Camada de Apresentação (Routes, Controllers, Middleware)
- Camada de Aplicação (Services)
- Camada de Domínio (Domain Models, Business Rules)
- Camada de Infraestrutura (Repositories, Database, Cache)

### 3. **arquitetura-fluxo-autenticacao.puml**
**Tipo:** Diagrama de Sequência  
**Descrição:** Detalha o fluxo completo de autenticação JWT com refresh tokens, desde login até logout.

**Fluxos incluídos:**
- Login com credenciais
- Requisições autenticadas
- Refresh de token
- Logout

### 4. **arquitetura-deployment.puml**
**Tipo:** Diagrama de Deployment  
**Descrição:** Mostra a arquitetura de produção com Vercel (frontend) e Koyeb (backend), além do ambiente de desenvolvimento local.

**Ambientes:**
- Produção (Vercel + Koyeb + Managed DB + Redis)
- Desenvolvimento (Docker Compose local)

### 5. **arquitetura-completa.puml**
**Tipo:** Diagrama de Componentes Completo  
**Descrição:** Diagrama mais detalhado que mostra todos os componentes, páginas, serviços, modelos de domínio e repositórios.

**Inclui:**
- Todas as páginas do frontend
- Todos os serviços e controllers
- Todos os modelos de domínio
- Estrutura completa de repositórios
- Tabelas do banco de dados

### 6. **arquitetura-resumida.puml** ⭐
**Tipo:** Diagrama de Componentes Resumido  
**Descrição:** Versão intermediária que mostra os componentes principais organizados por camadas, com notas explicativas.

**Ideal para:** Documentação técnica e apresentações

### 7. **arquitetura-simples.puml** ⭐⭐ RECOMENDADO PARA PÔSTER
**Tipo:** Diagrama de Componentes Simplificado  
**Descrição:** Versão mais simples e visual, focada apenas nos componentes essenciais e fluxo principal de dados.

**Ideal para:** Pôster A0, apresentações rápidas, visão geral executiva

## 🚀 Como Usar

### Opção 1: PlantUML Online
1. Acesse https://www.plantuml.com/plantuml/uml/
2. Cole o conteúdo do arquivo `.puml`
3. Visualize e exporte como PNG, SVG ou PDF

### Opção 2: VS Code Extension
1. Instale a extensão "PlantUML" no VS Code
2. Abra o arquivo `.puml`
3. Use `Ctrl+Shift+P` → "PlantUML: Preview Current Diagram"

### Opção 3: PlantUML Local
```bash
# Instalar PlantUML (requer Java)
# Windows: choco install plantuml
# Mac: brew install plantuml
# Linux: sudo apt-get install plantuml

# Gerar imagem
plantuml arquitetura-componentes.puml
```

### Opção 4: Docker
```bash
docker run -d -p 8080:8080 plantuml/plantuml-server:jetty
# Acesse http://localhost:8080
```

## 📊 Recomendações de Uso

### Para o Pôster:
- **⭐ RECOMENDADO:** `arquitetura-simples.puml` - Versão mais limpa e fácil de ler
- **Alternativa:** `arquitetura-resumida.puml` - Mais detalhes, mas ainda adequado
- **Razão:** Diagramas simples são mais legíveis em pôsteres impressos
- **Dica:** Exporte em alta resolução (300 DPI) como PNG ou SVG

### Para Documentação Técnica:
- **Use:** `arquitetura-completa.puml` ou `arquitetura-camadas.puml`
- **Razão:** Mostram mais detalhes e são ideais para documentação
- **Formato:** Exporte como PNG de alta resolução ou SVG

### Para Apresentações:
- **Use:** `arquitetura-fluxo-autenticacao.puml` para mostrar fluxos específicos
- **Razão:** Diagramas de sequência são ótimos para explicar processos
- **Formato:** Exporte como PNG ou inclua no PowerPoint/Google Slides

## 🎨 Personalização

Você pode personalizar os diagramas editando os arquivos `.puml`:

- **Cores:** Edite os códigos de cor hexadecimais (ex: `#E3F2FD`)
- **Notas:** Adicione ou remova blocos `note`
- **Componentes:** Adicione ou remova componentes conforme necessário
- **Estilo:** Ajuste `skinparam` para mudar o estilo visual

## 📝 Exemplo de Exportação

```bash
# Gerar PNG de alta resolução
plantuml -tpng -SDPI=300 arquitetura-componentes.puml

# Gerar SVG (vetorial, melhor para impressão)
plantuml -tsvg arquitetura-componentes.puml

# Gerar PDF
plantuml -tpdf arquitetura-componentes.puml
```

## 🔗 Links Úteis

- [PlantUML Documentation](https://plantuml.com/)
- [PlantUML Online Editor](https://www.plantuml.com/plantuml/uml/)
- [PlantUML Cheat Sheet](https://real-world-plantuml.com/)

## 📌 Notas

- Todos os diagramas foram criados seguindo as convenções UML
- Os diagramas são baseados na estrutura real do projeto
- Atualize os diagramas quando houver mudanças significativas na arquitetura
- Para o pôster, recomendamos usar um diagrama simplificado e exportar em alta resolução (300 DPI mínimo)

---

**Última atualização:** 2024  
**Versão:** 1.0  
**Projeto:** Startup Collab - Católica SC


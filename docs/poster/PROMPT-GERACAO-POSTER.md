# 🎨 Prompt Completo para Geração de Pôster A0 - Poster + Demo Day Católica SC

## 📋 Contexto do Projeto

**Título do Projeto:** Startup Collab – Plataforma de Colaboração para Startups

**Descrição:** Plataforma web para divulgação e colaboração de startups, conectando ideias a talentos e facilitando a formação de equipes multidisciplinares. O projeto foi desenvolvido como parte do curso de Engenharia de Software do Centro Universitário de Santa Catarina (Católica SC).

**Autor:** Alexandre Tessaro Vieira  
**E-mail:** (inserir e-mail institucional @catolicasc.edu.br)

---

## 🎯 Especificações Técnicas do Pôster

### Dimensões e Formato
- **Tamanho:** A0 (841 x 1189 mm)
- **Orientação:** Retrato (vertical)
- **Formato de arquivo:** SVG vetorial (preferencial) ou PDF de alta resolução
- **DPI recomendado:** 300 DPI para impressão

### Padrão Visual
- **Cores principais:** 
  - Fundo: Branco (#ffffff)
  - Destaque/Accent: Azul (#0d47a1) - cor institucional Católica SC
  - Texto escuro: #111111 ou #000000
  - Texto claro (sobre fundo escuro): #ffffff
  - Cards/Seções: #f7f9fc (cinza muito claro)
  - Bordas: #e0e6f1 (cinza suave)
- **Harmonia visual:** Margens consistentes (mínimo 30mm), espaçamento adequado entre elementos, hierarquia visual clara

---

## 📐 Elementos Obrigatórios a Incluir

### 1. Logomarca da Católica SC
- **Posição:** Topo direito do pôster
- **Tamanho:** Aproximadamente 120x40mm
- **Formato:** Vetorial (SVG) ou imagem de alta resolução (PNG 300 DPI)
- **Nota:** Substituir placeholder/retângulo com a logomarca oficial

### 2. Título do Projeto
- **Texto:** "Startup Collab – Plataforma de Colaboração para Startups"
- **Posição:** Topo esquerdo, dentro do banner azul
- **Fonte:** Arial ou equivalente, tamanho mínimo 24pt (escalável para A0)
- **Cor:** Branco (texto claro sobre fundo azul)
- **Peso:** Negrito (700)

### 3. Identificação do Evento
- **Texto:** "Católica SC — Poster + Demo Day"
- **Posição:** Abaixo do título, no banner azul
- **Fonte:** Arial, tamanho mínimo 7pt
- **Cor:** Branco

### 4. Nome e E-mail do Integrante
- **Nome:** Alexandre Tessaro Vieira
- **E-mail:** (inserir e-mail institucional completo)
- **Formato:** "Nome do integrante — email@catolicasc.edu.br"
- **Posição:** Card de metadados no topo, abaixo do banner
- **Fonte:** Arial, tamanho mínimo 14pt para subtítulo, 8pt para corpo
- **Seção:** "Autores"

### 5. QR Codes (3 obrigatórios)
Todos os QR Codes devem ter:
- **Tamanho:** 60x60mm cada
- **Borda:** Azul (#0d47a1), espessura 0.8mm
- **Fundo:** Branco
- **Posição:** Topo direito, ao lado do card de metadados

**QR Code 1 - Produção:**
- **Descrição:** Link para solução em ambiente produtivo (deploy)
- **URL:** (inserir URL do deploy - ex: Vercel, Netlify, etc.)
- **Rótulo:** "QR — Produção"

**QR Code 2 - Repositório:**
- **Descrição:** Link para repositório do projeto (GitHub, GitLab, etc.)
- **URL:** (inserir URL do repositório)
- **Rótulo:** "QR — Repositório"

**QR Code 3 - Vídeo:**
- **Descrição:** Link para vídeo de demonstração (YouTube, Vimeo, etc.)
- **URL:** (inserir URL do vídeo)
- **Rótulo:** "QR — Vídeo"

**Como gerar QR Codes:**
- Usar gerador online (qrcode-monkey.com, qr-code-generator.com)
- Exportar como PNG/SVG de alta resolução
- Importar no layout do pôster

### 6. Contexto / Problema
- **Título da seção:** "Contexto / Problema"
- **Posição:** Coluna esquerda, abaixo do header
- **Conteúdo sugerido:**
  - Startups e talentos têm dificuldade em se conectar de forma eficiente para colaboração em projetos, mentorias e validação de ideias
  - Interações dispersas em múltiplos canais, sem curadoria
  - Baixa taxa de compatibilidade e acompanhamento
  - Descoberta de projetos desalinhada com interesses e habilidades
  - Falta de visibilidade de oportunidades em tempo real
  - Baixa taxa de engajamento pós-match
- **Formato:** Texto em parágrafos e tópicos
- **Fonte:** Arial, tamanho mínimo 8pt (20pt ao imprimir em A0)
- **Layout:** Card com fundo #f7f9fc, bordas suaves

### 7. Solução Proposta
- **Título da seção:** "Solução Proposta"
- **Posição:** Coluna esquerda, abaixo de "Contexto / Problema"
- **Conteúdo sugerido:**
  - Plataforma web que conecta startups, estudantes e profissionais
  - Cadastro de perfis, publicação de projetos
  - Mecanismo de matching baseado em interesses e competências
  - Front-end em React + Vite com UI responsiva
  - API Node.js/Express com autenticação JWT, validação e rate limiting
  - Banco relacional (PostgreSQL) e cache Redis para desempenho
  - Deploy do front-end (Vercel) e API (Koyeb)
  - Fluxos: login, gestão de perfil, cadastro de projetos, busca e candidatura, mensagens e feedback
- **Formato:** Texto em parágrafos e lista de funcionalidades
- **Fonte:** Arial, tamanho mínimo 8pt
- **Layout:** Card com fundo #f7f9fc

### 8. Arquitetura (Diagrama Visual)
- **Título da seção:** "Arquitetura"
- **Posição:** Coluna direita, lado a lado com Contexto/Solução
- **Elementos a incluir:**
  - **Frontend:** React + Vite (deploy Vercel)
  - **Backend:** Node.js / Express (deploy Koyeb)
  - **Banco de Dados:** PostgreSQL
  - **Cache:** Redis (cache e rate limiting)
  - **Segurança:** JWT, express-validator, Helmet, CORS, Rate Limit
- **Formato:** Diagrama visual com caixas representando componentes, setas indicando fluxo de dados
- **Estilo:** Caixas brancas com bordas azuis, setas azuis conectando componentes
- **Layout:** Card grande (#f7f9fc) contendo o diagrama

### 9. Referências
- **Título da seção:** "Referências"
- **Posição:** Parte inferior do pôster, ocupando toda a largura
- **Conteúdo a incluir:**
  - React, Vite e React Router — Documentação oficial
  - Express, express-validator, Helmet — Documentação oficial
  - PostgreSQL — Guia e referências
  - Redis — Uso para cache e rate limiting
  - Boas práticas de UX para posters acadêmicos
  - Repositório do projeto: (inserir URL completa)
  - Deploy de produção: (inserir URL completa)
  - Vídeo de demonstração: (inserir URL completa)
- **Formato:** Lista com marcadores
- **Fonte:** Arial, tamanho mínimo 8pt
- **Layout:** Card horizontal (#f7f9fc)

---

## ✍️ Padronização de Texto

### Fontes
- **Família:** Arial, Helvetica, ou equivalente sans-serif
- **Tamanho mínimo:** 20 pontos (considerando impressão final em A0)
- **Tamanhos relativos no SVG:**
  - Título principal: 24pt
  - Títulos de seção: 14pt (negrito)
  - Subtítulos: 14pt
  - Texto corpo: 8pt (escalável para 20pt+ em A0)
  - Texto pequeno: 7pt (escalável para 16pt+ em A0)

### Cores e Contraste
- **Bom contraste:** Texto escuro (#111111) sobre fundo claro (#ffffff, #f7f9fc)
- **Texto claro:** Branco (#ffffff) sobre fundo escuro (azul #0d47a1)
- **Evitar:** Cores muito próximas (ex: cinza médio sobre branco)
- **Acessibilidade:** Garantir contraste mínimo de 4.5:1 para texto normal

### Conteúdo
- **Priorizar:** Imagens, diagramas e tópicos sobre texto corrido
- **Evitar:** Excessos de texto - o pôster deve ser visual
- **Estrutura:** Usar bullet points, listas e parágrafos curtos
- **Clareza:** Linguagem objetiva e técnica, mas acessível

---

## 💡 Boas Práticas Visuais

### Autoexplicatividade
- O pôster deve ser compreensível mesmo sem a presença do autor
- Informações claras e organizadas hierarquicamente
- Fluxo de leitura natural: topo → baixo, esquerda → direita

### Imagens e Gráficos
- **Resolução:** Alta resolução (300 DPI mínimo)
- **Formato:** Preferencialmente vetorial (SVG) ou PNG de alta qualidade
- **Diagramas:** Claros, com legendas quando necessário
- **Screenshots:** Se incluir screenshots da aplicação, usar versões de alta qualidade

### Layout e Espaçamento
- **Margens:** Mínimo 30mm de todas as bordas
- **Espaçamento:** Consistente entre elementos (mínimo 10mm entre seções)
- **Grid:** Usar grid invisível para alinhamento
- **Hierarquia visual:** Títulos maiores e mais destacados que subtítulos

### QR Codes
- **Tamanho adequado:** Mínimo 60x60mm para fácil leitura
- **Bordas:** Espaço em branco ao redor (quiet zone) de pelo menos 5mm
- **Teste:** Verificar se todos os QR Codes funcionam antes de imprimir
- **Rótulos:** Identificar claramente cada QR Code

---

## ✅ Checklist de Validação

### Formato e Dimensões
- [ ] Formato A0 (841 x 1189 mm)
- [ ] Orientação retrato (vertical)
- [ ] Resolução adequada para impressão (300 DPI)

### Elementos Obrigatórios
- [ ] Logomarca da Católica SC inserida
- [ ] Título do projeto presente
- [ ] Nome e e-mail do integrante completos
- [ ] Três QR Codes funcionais (Produção, Repositório, Vídeo)
- [ ] Seção "Contexto / Problema" preenchida
- [ ] Seção "Solução Proposta" preenchida
- [ ] Diagrama de Arquitetura presente
- [ ] Seção "Referências" completa com URLs

### Texto e Legibilidade
- [ ] Fonte mínima de 20 pontos (no tamanho final impresso)
- [ ] Bom contraste entre texto e fundo
- [ ] Texto legível sem esforço
- [ ] Sem erros ortográficos ou gramaticais

### Visual e Design
- [ ] Cores harmoniosas e consistentes
- [ ] Margens adequadas
- [ ] Espaçamento consistente entre elementos
- [ ] Imagens e diagramas em alta resolução
- [ ] Layout equilibrado e profissional

### QR Codes e Links
- [ ] QR Code de produção testado e funcional
- [ ] QR Code de repositório testado e funcional
- [ ] QR Code de vídeo testado e funcional
- [ ] URLs correspondentes inseridas na seção Referências

### Revisão Final
- [ ] Pôster autoexplicativo (compreensível sem autor presente)
- [ ] Informações principais destacadas
- [ ] Fluxo de leitura natural
- [ ] Revisão completa de conteúdo e formatação

---

## 🎨 Estrutura Sugerida do Layout

```
┌─────────────────────────────────────────────────────────┐
│ [Banner Azul]                                           │
│ Título do Projeto              [Logo Católica SC]       │
│ Católica SC — Poster + Demo Day                         │
├─────────────────────────────────────────────────────────┤
│ [Card Metadados]                                        │
│ Autores: Nome — email              [QR] [QR] [QR]       │
│                                            Prod Repo Vid│
├──────────────────────────┬──────────────────────────────┤
│ Contexto / Problema       │ Arquitetura                 │
│ [Card com texto]         │ [Card com diagrama]         │
│                          │                              │
│ Solução Proposta         │ [Diagrama de componentes]   │
│ [Card com texto]         │                              │
│                          │                              │
├──────────────────────────┴──────────────────────────────┤
│ Referências                                              │
│ [Card horizontal com lista de referências]             │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 Observações Finais

1. **Exportação:** Exportar o SVG final como PDF de alta qualidade para impressão
2. **Cores de impressão:** Verificar se a gráfica exige cores CMYK (converter se necessário)
3. **Sangria:** Considerar sangria de 3-5mm se a gráfica exigir
4. **Preview:** Visualizar o pôster em escala real antes de imprimir
5. **Backup:** Manter versões do arquivo fonte (SVG) e PDF final

---

## 🔗 Links Úteis para Gerar QR Codes

- https://www.qrcode-monkey.com
- https://www.qr-code-generator.com
- https://qrcode.tec-it.com

---

**Data de criação:** 2024  
**Versão:** 1.0  
**Projeto:** Startup Collab - Católica SC












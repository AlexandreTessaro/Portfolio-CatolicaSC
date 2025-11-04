# 🎯 Como Funciona o Algoritmo de Recomendação de Projetos

## 📊 Visão Geral

O algoritmo calcula uma **porcentagem de compatibilidade (match)** entre um usuário e um projeto baseado em três fatores principais:

1. **Matching de Skills** (até 100%)
2. **Histórico de Projetos** (bonus até 10%)
3. **Categoria Familiar** (bonus até 5%)

**Score Final**: Máximo de 100%

---

## 🧮 Como o Algoritmo Calcula o Match

### 1️⃣ **Score Base - Matching de Skills** (0-100%)

```javascript
// Compara as skills do usuário com as tecnologias do projeto
matchingSkills = userSkills.filter(skill => projectTechs.includes(skill))
matchPercentage = (matchingSkills.length / userSkills.length) * 100
```

**Exemplo:**
- Usuário tem: `["React", "Node.js", "PostgreSQL", "JavaScript"]`
- Projeto precisa: `["React", "Node.js", "Express", "PostgreSQL"]`
- Skills que fazem match: `["React", "Node.js", "PostgreSQL"]` = 3 skills
- **Score base**: `(3/4) * 100 = 75%`

### 2️⃣ **Bonus por Histórico** (0-10%)

```javascript
// Verifica projetos aceitos anteriormente com tecnologias similares
historyBonus = (similarProjects / acceptedProjects.length) * 10
```

**Exemplo:**
- Usuário já aceitou 5 projetos anteriormente
- 3 desses projetos têm tecnologias em comum com o projeto atual
- **Bonus**: `(3/5) * 10 = 6%`

### 3️⃣ **Bonus por Categoria** (0-5%)

```javascript
// Verifica se usuário já trabalhou em projetos da mesma categoria
if (userHasAcceptedProjectsInSameCategory) {
  categoryBonus = 5; // Bonus fixo de 5%
}
```

**Exemplo:**
- Projeto atual é da categoria "fintech"
- Usuário já aceitou projetos da categoria "fintech" antes
- **Bonus**: `5%`

### 🎯 **Score Final**

```javascript
finalScore = Math.min(100, matchPercentage + historyBonus + categoryBonus)
```

**Exemplo Completo:**
- Score base: 75%
- Bonus histórico: 6%
- Bonus categoria: 5%
- **Score final**: `75 + 6 + 5 = 86%`

---

## 📈 Como AUMENTAR o Match com Projetos

### ✅ **1. Adicione Mais Skills ao Seu Perfil**

**Quanto mais skills você tiver, maior a chance de match:**

```javascript
// Se você tem apenas 2 skills:
userSkills = ["React", "Node.js"]
// Match máximo possível: 50% (se projeto tiver exatamente essas 2)

// Se você tem 8 skills:
userSkills = ["React", "Node.js", "PostgreSQL", "TypeScript", "Express", "MongoDB", "AWS", "Docker"]
// Match máximo possível: 100% (se projeto tiver todas essas)
```

**Dica:** Adicione skills relacionadas às tecnologias que você domina ou está aprendendo!

### ✅ **2. Skills Comuns vs. Específicas**

**Prefira skills comuns mas relevantes:**

❌ **Ruim:** `["FrameworkXYZ", "LibraryABC"]` (muito específicas, pouco match)  
✅ **Bom:** `["React", "Node.js", "PostgreSQL", "TypeScript"]` (comuns e relevantes)

**Skills Mais Procuradas:**
- React, Vue, Angular (Frontend)
- Node.js, Express, Python, Java (Backend)
- PostgreSQL, MongoDB, MySQL (Banco de Dados)
- Docker, AWS, Kubernetes (DevOps)

### ✅ **3. Aceite Projetos para Melhorar Histórico**

**Quanto mais projetos você aceitar, maior o bonus histórico:**

```javascript
// Usuário novo: 0 projetos aceitos
historyBonus = 0%

// Usuário com 5 projetos aceitos, 3 similares
historyBonus = (3/5) * 10 = 6%

// Usuário com 10 projetos aceitos, 8 similares
historyBonus = (8/10) * 10 = 8%
```

**Dica:** Aceite projetos mesmo que o match inicial seja baixo - isso melhora seu histórico para futuros matches!

### ✅ **4. Foque em Categorias Específicas**

**Trabalhe em projetos da mesma categoria para ganhar bonus:**

```javascript
// Se você trabalhar em vários projetos "fintech"
// Todos os novos projetos "fintech" terão +5% de bonus
categoryBonus = 5%
```

**Categorias Populares:**
- fintech (Financeiro)
- sustainability (Sustentabilidade)
- education (Educação)
- healthcare (Saúde)
- ecommerce (Comércio Eletrônico)

### ✅ **5. Mantenha Seu Perfil Atualizado**

**Atualize suas skills regularmente:**
- Adicione novas tecnologias que você aprendeu
- Remova skills obsoletas ou que não usa mais
- Mantenha um bom equilíbrio entre frontend e backend

---

## 📊 Exemplos Práticos

### Exemplo 1: Match Alto (85%)

**Usuário:**
- Skills: `["React", "Node.js", "PostgreSQL", "TypeScript"]`
- Histórico: 3 projetos aceitos, 2 com tecnologias similares
- Categoria: 2 projetos aceitos em "fintech"

**Projeto:**
- Tecnologias: `["React", "Node.js", "PostgreSQL", "Express"]`
- Categoria: "fintech"

**Cálculo:**
- Score base: `(3/4) * 100 = 75%`
- Bonus histórico: `(2/3) * 10 = 6.67%`
- Bonus categoria: `5%`
- **Total: 86.67% ≈ 87%**

### Exemplo 2: Match Médio (45%)

**Usuário:**
- Skills: `["React", "Node.js"]`
- Histórico: 0 projetos aceitos
- Categoria: Nenhum projeto na categoria

**Projeto:**
- Tecnologias: `["React", "Node.js", "PostgreSQL", "Express", "MongoDB"]`
- Categoria: "healthcare"

**Cálculo:**
- Score base: `(2/2) * 100 = 100%` → mas limitado pelos requisitos do projeto
- Bonus histórico: `0%`
- Bonus categoria: `0%`
- **Total: 45%** (aproximado, considerando que projeto precisa de mais tecnologias)

### Exemplo 3: Match Baixo (20%)

**Usuário:**
- Skills: `["Python", "Django"]`
- Histórico: 0 projetos aceitos

**Projeto:**
- Tecnologias: `["React", "Node.js", "PostgreSQL", "TypeScript"]`
- Categoria: "fintech"

**Cálculo:**
- Score base: `(0/2) * 100 = 0%`
- Bonus histórico: `0%`
- Bonus categoria: `0%`
- **Total: 0%** (sem skills em comum)

---

## 🎯 Dicas para Maximizar o Match

### ✅ **Para Desenvolvedores Frontend:**
- Adicione: React, Vue, Angular, TypeScript, Tailwind CSS, Redux
- Aprenda: Node.js básico para entender backend

### ✅ **Para Desenvolvedores Backend:**
- Adicione: Node.js, Express, Python, Java, PostgreSQL, MongoDB
- Aprenda: React básico para entender frontend

### ✅ **Para Full Stack:**
- Tenha pelo menos 6-8 skills cobrindo frontend e backend
- Mantenha balance entre frameworks e linguagens

### ✅ **Estratégia Geral:**
1. **Comece com projetos de match médio (40-60%)** para construir histórico
2. **Vá aumentando skills gradualmente** conforme aprende
3. **Foque em 2-3 categorias** para ganhar bonus de categoria
4. **Mantenha perfil atualizado** com tecnologias modernas

---

## 🔧 Melhorias Futuras do Algoritmo

O algoritmo pode ser melhorado adicionando:

1. **Peso por Skills** - Skills mais importantes têm mais peso
2. **Machine Learning** - Aprender com comportamento do usuário
3. **Feedback Loop** - Ajustar scores baseado em aceitações/rejeições
4. **Contexto Social** - Considerar conexões entre usuários
5. **Temporal** - Considerar quando projeto foi criado/atualizado

---

## 📝 Resumo Rápido

**Para aumentar o match:**

1. ✅ **Adicione mais skills** ao seu perfil
2. ✅ **Use skills comuns** (React, Node.js, PostgreSQL, etc.)
3. ✅ **Aceite projetos** para melhorar histórico
4. ✅ **Foque em categorias** específicas
5. ✅ **Mantenha perfil atualizado**

**Fórmula Simplificada:**
```
Match = (Skills em Comum / Total de Skills) × 100% 
      + Bonus Histórico (até 10%)
      + Bonus Categoria (até 5%)
```

---

**Última atualização:** 2024  
**Versão do algoritmo:** 1.0  
**Projeto:** Startup Collab Platform - Católica SC



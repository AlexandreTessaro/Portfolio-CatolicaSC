# 📊 Geração de Dados Sintéticos

Este diretório contém scripts para gerar dados sintéticos realistas para a aplicação Startup Collaboration.

## 🚀 Scripts Disponíveis

### 1. Geração de Dados Sintéticos (`generate-synthetic-data.js`)

Gera dados aleatórios em grande quantidade para testes e desenvolvimento.

**Uso básico:**
```bash
npm run db:seed-synthetic
```

**Com parâmetros personalizados:**
```bash
# Gerar 100 usuários, 50 projetos, 200 matches
node scripts/generate-synthetic-data.js --users 100 --projects 50 --matches 200

# Limpar dados existentes antes de gerar
node scripts/generate-synthetic-data.js --clear true

# Não incluir usuário administrador
node scripts/generate-synthetic-data.js --no-admin
```

**Parâmetros disponíveis:**
- `--users [número]`: Número de usuários a gerar (padrão: 50)
- `--projects [número]`: Número de projetos a gerar (padrão: 30)
- `--matches [número]`: Número de matches a gerar (padrão: 100)
- `--clear [true/false]`: Limpar dados existentes antes (padrão: false)
- `--no-admin`: Não criar usuário administrador

### 2. Geração de Dados Realistas (`generate-realistic-data.js`)

Gera dados mais específicos e realistas com usuários, projetos e matches pré-definidos.

**Uso básico:**
```bash
npm run db:seed-realistic
```

**Com parâmetros:**
```bash
# Limpar dados existentes
node scripts/generate-realistic-data.js --clear true

# Não incluir usuário administrador
node scripts/generate-realistic-data.js --no-admin
```

**Dados incluídos:**
- 10 usuários realistas com perfis específicos
- 10 projetos detalhados em diferentes categorias
- Matches realistas entre usuários e projetos

### 3. Gerenciador de Dados (`data-manager.js`)

Utilitário para visualizar, limpar e exportar dados.

**Comandos disponíveis:**

```bash
# Mostrar estatísticas gerais
npm run db:stats

# Mostrar usuários (últimos 10)
npm run db:users

# Mostrar usuários (últimos 20)
node scripts/data-manager.js users 20

# Mostrar projetos (últimos 10)
npm run db:projects

# Mostrar matches (últimos 10)
npm run db:matches

# Limpar todos os dados
npm run db:clear

# Exportar dados
npm run db:export
```

## 📋 Dados Gerados

### Usuários
- **Nome**: Nomes brasileiros realistas
- **Email**: Baseado no nome com domínios variados
- **Bio**: Descrições profissionais variadas
- **Skills**: 3-10 habilidades aleatórias de uma lista de 50+
- **Status**: 80% verificados, 20% não verificados

### Projetos
- **Título**: Títulos realistas de projetos
- **Descrição**: Descrições detalhadas e específicas
- **Objetivos**: 3-5 objetivos por projeto
- **Tecnologias**: 3-8 tecnologias relevantes por categoria
- **Status**: Distribuído entre idea, planning, development, testing, launched
- **Categoria**: 17 categorias diferentes (sustainability, education, healthcare, etc.)

### Matches
- **Mensagem**: Mensagens personalizadas baseadas nas skills do usuário
- **Status**: Distribuído entre pending, accepted, rejected
- **Relacionamento**: Evita matches entre criador e próprio projeto

## 🎯 Exemplos de Uso

### Cenário 1: Desenvolvimento Local
```bash
# Gerar dados realistas para desenvolvimento
npm run db:seed-realistic

# Verificar os dados gerados
npm run db:stats
```

### Cenário 2: Testes de Performance
```bash
# Gerar grande volume de dados
node scripts/generate-synthetic-data.js --users 500 --projects 200 --matches 1000

# Verificar estatísticas
npm run db:stats
```

### Cenário 3: Limpeza e Reset
```bash
# Limpar todos os dados
npm run db:clear

# Gerar novos dados
npm run db:seed-realistic
```

### Cenário 4: Análise de Dados
```bash
# Ver usuários específicos
npm run db:users 5

# Ver projetos por categoria
npm run db:projects 15

# Exportar para análise
npm run db:export
```

## 🔑 Credenciais de Acesso

### Dados Sintéticos
- **Admin**: `admin@startupcollab.com` / `admin123`
- **Usuários**: `[email gerado]` / `password123`

### Dados Realistas
- **Admin**: `admin@startupcollab.com` / `admin123`
- **Usuários específicos**: `[email específico]` / `password123`

**Usuários realistas criados:**
- João Silva: `joao.silva@startupcollab.com`
- Maria Santos: `maria.santos@startupcollab.com`
- Pedro Costa: `pedro.costa@startupcollab.com`
- Ana Oliveira: `ana.oliveira@startupcollab.com`
- Carlos Mendes: `carlos.mendes@startupcollab.com`
- Lucia Fernandes: `lucia.fernandes@startupcollab.com`
- Roberto Alves: `roberto.alves@startupcollab.com`
- Juliana Rocha: `juliana.rocha@startupcollab.com`
- Marcos Pereira: `marcos.pereira@startupcollab.com`
- Camila Lima: `camila.lima@startupcollab.com`

## 📊 Categorias de Projetos

1. **sustainability** - Projetos de sustentabilidade
2. **education** - Plataformas educacionais
3. **healthcare** - Soluções de saúde
4. **fintech** - Tecnologia financeira
5. **ecommerce** - Comércio eletrônico
6. **social** - Redes sociais e impacto social
7. **gaming** - Jogos e entretenimento
8. **iot** - Internet das Coisas
9. **ai** - Inteligência Artificial
10. **blockchain** - Tecnologia blockchain
11. **mobile** - Aplicativos móveis
12. **web** - Aplicações web
13. **desktop** - Aplicações desktop
14. **enterprise** - Soluções empresariais
15. **startup** - Projetos de startup
16. **nonprofit** - Organizações sem fins lucrativos
17. **general** - Projetos gerais

## 🛠️ Personalização

### Adicionando Novos Usuários
Edite o array `REALISTIC_USERS` em `generate-realistic-data.js`:

```javascript
const REALISTIC_USERS = [
  {
    name: 'Seu Nome',
    email: 'seu.email@startupcollab.com',
    bio: 'Sua biografia profissional',
    skills: ['Skill1', 'Skill2', 'Skill3']
  },
  // ... outros usuários
];
```

### Adicionando Novos Projetos
Edite o array `REALISTIC_PROJECTS` em `generate-realistic-data.js`:

```javascript
const REALISTIC_PROJECTS = [
  {
    title: 'Título do Projeto',
    description: 'Descrição detalhada...',
    objectives: ['Objetivo 1', 'Objetivo 2'],
    technologies: ['Tech1', 'Tech2'],
    status: 'development',
    category: 'sustainability'
  },
  // ... outros projetos
];
```

### Adicionando Novas Skills
Edite o array `SKILLS` em `generate-synthetic-data.js`:

```javascript
const SKILLS = [
  // ... skills existentes
  'Nova Skill',
  'Outra Skill'
];
```

## ⚠️ Notas Importantes

1. **Backup**: Sempre faça backup do banco antes de limpar dados
2. **Performance**: Dados sintéticos em grande volume podem impactar performance
3. **Desenvolvimento**: Use dados realistas para desenvolvimento, sintéticos para testes
4. **Produção**: Nunca execute estes scripts em produção sem cuidado

## 🔧 Troubleshooting

### Erro de Conexão com Banco
```bash
# Verificar se o banco está rodando
# Verificar variáveis de ambiente no .env
```

### Erro de Permissão
```bash
# Verificar se o usuário do banco tem permissões adequadas
```

### Dados Duplicados
```bash
# Limpar dados existentes antes de gerar novos
npm run db:clear
npm run db:seed-realistic
```


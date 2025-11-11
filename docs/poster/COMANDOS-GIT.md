# 📋 Comandos Git para Commit e Push

## 🚀 Execute os comandos abaixo no terminal:

```bash
# 1. Navegar para o diretório do projeto
cd "C:\Users\alexa\OneDrive\Área de Trabalho\Portfolio-CatolicaSC"

# 2. Verificar status das alterações
git status

# 3. Adicionar todos os arquivos novos/modificados na pasta docs/poster
git add docs/poster/

# 4. Verificar o que será commitado
git status

# 5. Fazer commit das alterações
git commit -m "docs: adiciona diagramas UML, resumos e melhorias do pôster

- Adiciona diagramas PlantUML da arquitetura (completo, resumido, simples)
- Adiciona diagramas do algoritmo de recomendação (fluxo, componentes, infográfico)
- Cria versão melhorada do pôster SVG com elementos visuais
- Adiciona resumos do projeto em diferentes formatos
- Adiciona referências bibliográficas e técnicas
- Adiciona documentação sobre como aumentar o match
- Inclui guias e análises do pôster"

# 6. Fazer push para o repositório remoto
git push origin master

# OU se estiver usando branch main:
git push origin main
```

## 🔍 Se der erro de branch, verifique qual branch está usando:

```bash
git branch
```

## 📝 Resumo dos arquivos criados/modificados:

**Novos arquivos:**
- `docs/poster/PROMPT-GERACAO-POSTER.md`
- `docs/poster/arquitetura-componentes.puml`
- `docs/poster/arquitetura-camadas.puml`
- `docs/poster/arquitetura-fluxo-autenticacao.puml`
- `docs/poster/arquitetura-deployment.puml`
- `docs/poster/arquitetura-completa.puml`
- `docs/poster/arquitetura-resumida.puml`
- `docs/poster/arquitetura-simples.puml`
- `docs/poster/algoritmo-recomendacao-fluxo.puml`
- `docs/poster/algoritmo-recomendacao-componentes.puml`
- `docs/poster/algoritmo-recomendacao-exemplo.puml`
- `docs/poster/algoritmo-recomendacao-infografico.puml`
- `docs/poster/algoritmo-recomendacao-infografico-compacto.puml`
- `docs/poster/algoritmo-recomendacao-ultra-compacto.puml`
- `docs/poster/algoritmo-recomendacao-horizontal.puml`
- `docs/poster/REFERENCIAS.md`
- `docs/poster/referencias-poster-resumido.txt`
- `docs/poster/COMO-AUMENTAR-MATCH.md`
- `docs/poster/RESUMO-PROJETO.md`
- `docs/poster/resumo-projeto-poster.txt`
- `docs/poster/README-ARQUITETURA.md`
- `docs/poster/README-ALGORITMO-PLANTUML.md`
- `docs/poster/ANALISE-COMPLETA-POSTER.md`
- `docs/poster/GUIA-MELHORIAS-POSTER.md`
- `docs/poster/GUIA-POSTER-MELHORADO.md`

**Arquivos modificados:**
- `docs/poster/poster-a0.svg` (referências atualizadas)
- `docs/poster/poster-a0-melhorado.svg` (novo)

## ⚠️ Se houver problemas:

### Erro de autenticação:
```bash
# Configure suas credenciais do git
git config --global user.name "Seu Nome"
git config --global user.email "seu.email@exemplo.com"
```

### Verificar se está conectado ao repositório remoto:
```bash
git remote -v
```

### Se não houver remote configurado:
```bash
git remote add origin https://github.com/AlexandreTessaro/Portfolio-CatolicaSC.git
```

---

**Copie e cole os comandos no seu terminal PowerShell ou Git Bash!**







# 🔧 Resolver Conflito Git - Push Rejeitado

## ❌ **Erro:**

```
! [rejected]        main -> main (fetch first)
error: failed to push some refs
```

## ✅ **Solução:**

O repositório remoto tem mudanças que você não tem localmente. Você precisa fazer pull primeiro.

### **Passo a Passo:**

1. **Abra o terminal no diretório do projeto**

2. **Faça pull das mudanças remotas:**
   ```bash
   git pull origin main
   ```
   
   Se houver conflitos, o Git vai avisar. Nesse caso, use:
   ```bash
   git pull origin main --no-rebase
   ```

3. **Se houver conflitos de merge:**
   - O Git vai mostrar quais arquivos têm conflitos
   - Resolva os conflitos manualmente
   - Depois faça:
   ```bash
   git add .
   git commit -m "merge: resolver conflitos"
   ```

4. **Faça push novamente:**
   ```bash
   git push origin main
   ```

---

## 🔄 **Alternativa: Forçar Push (CUIDADO!)**

⚠️ **Só use se tiver certeza que quer sobrescrever o remoto:**

```bash
git push origin main --force
```

**Isso vai sobrescrever o histórico remoto!** Use apenas se você tem certeza que as mudanças remotas não são importantes.

---

## 📋 **Comandos Completos:**

```bash
# 1. Verificar status
git status

# 2. Fazer pull
git pull origin main

# 3. Se tudo ok, fazer push
git push origin main
```

---

## 🐛 **Se der erro de merge:**

```bash
# Abortar merge
git merge --abort

# Ou continuar e resolver conflitos
# Edite os arquivos com conflitos
git add .
git commit -m "merge: resolver conflitos"
git push origin main
```

---

**💡 Dica**: O Azure pode ter criado um workflow automaticamente no GitHub, por isso há mudanças remotas que você não tem localmente.


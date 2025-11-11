# ⚠️ Function App vs Web App - Qual Escolher?

## 🚨 Você está vendo "Function App"?

Se você está vendo a tela **"Create Function App"**, você clicou na opção errada!

---

## ✅ **O QUE VOCÊ PRECISA: Web App (App Service)**

### Como Identificar:
- Título da página: **"Create Web App"** ou **"Create App Service"**
- **NÃO** deve dizer "Function App"

### Onde Encontrar:
1. Portal Azure → **"Create a resource"**
2. Busque: **"Web App"** (não "Function App")
3. Escolha: **"App Services"** (ícone de globo 🌐 com engrenagem)

---

## ❌ **O QUE VOCÊ NÃO PRECISA: Function App**

### Como Identificar:
- Título da página: **"Create Function App"**
- Tem opções de "Storage" (Storage Account)
- É para funções serverless, não para aplicação Express completa

### Se você está aqui:
- **VOLTE** e escolha "App Services" em vez de "Function App"

---

## 🔍 **Diferenças:**

| Característica | Web App (App Service) | Function App |
|---------------|------------------------|--------------|
| **Para que serve** | Aplicações web completas (Express, etc.) | Funções serverless individuais |
| **Runtime** | Node.js, Python, .NET, etc. | Node.js, Python, C#, etc. |
| **Estrutura** | Aplicação completa | Funções isoladas |
| **Você precisa** | ✅ SIM | ❌ NÃO |

---

## 📋 **Passos Corretos:**

1. **Feche** a tela atual de Function App
2. Volte para **"Create a resource"**
3. Busque: **"Web App"**
4. Escolha: **"App Services"** (não Function App)
5. Clique em **"Create"**

---

## 🎯 **Como Saber se Está Correto:**

Quando você criar um **Web App (App Service)**, você verá:
- ✅ Opção para **"Publish"**: Code, Docker, etc.
- ✅ Opção para **"Runtime stack"**: Node.js, Python, etc.
- ✅ Opção para **"App Service Plan"**: Com opção de criar novo plano

Se você vê opções de **"Storage Account"** ou **"Function App"**, você está no lugar errado!

---

**✅ Resumo: Escolha "App Services" (Web App), não "Function App"!**


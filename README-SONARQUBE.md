# 🔍 SonarQube / SonarCloud - Análise de Qualidade de Código

Este projeto utiliza SonarCloud para análise contínua de qualidade de código.

---

## 🚀 Configuração Rápida (5 minutos)

Siga o guia rápido: **`SONARQUBE-SETUP-RAPIDO.md`**

---

## 📊 Status da Análise

- **Backend**: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=startup-collab-backend&metric=alert_status)](https://sonarcloud.io/dashboard?id=startup-collab-backend)
- **Frontend**: [![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=startup-collab-frontend&metric=alert_status)](https://sonarcloud.io/dashboard?id=startup-collab-frontend)

---

## 📈 Métricas Principais

O SonarCloud analisa:
- ✅ **Bugs** - Erros no código
- 🔒 **Vulnerabilities** - Problemas de segurança
- 🧹 **Code Smells** - Problemas de manutenibilidade
- 📊 **Coverage** - Cobertura de testes
- 🔄 **Duplications** - Código duplicado
- ⏱️ **Technical Debt** - Dívida técnica

---

## 🔧 Executar Análise Localmente

### Backend

```bash
cd backend
npm test -- --coverage
npm run sonar
```

### Frontend

```bash
cd frontend
npm run test:coverage
npm run sonar
```

---

## 📚 Documentação

- **Guia Completo**: `GUIA-SONARQUBE.md`
- **Setup Rápido**: `SONARQUBE-SETUP-RAPIDO.md`

---

## 🔗 Links Úteis

- [SonarCloud Dashboard](https://sonarcloud.io)
- [Documentação SonarCloud](https://docs.sonarcloud.io/)


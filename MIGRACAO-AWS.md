# 🚀 Migração de Koyeb para AWS

## ✅ O que foi configurado

A aplicação **Startup Collab** agora está pronta para deploy na AWS, migrando do Koyeb.

### 📁 Arquivos Criados

1. **`aws-deploy-guide.md`** - Guia completo de deploy na AWS
2. **`apprunner.yaml`** - Configuração para AWS App Runner
3. **`ecs-task-definition.json`** - Configuração para AWS ECS Fargate
4. **`deploy-backend-aws.sh`** - Script de deploy do backend
5. **`deploy-frontend-aws.sh`** - Script de deploy do frontend
6. **`.github/workflows/deploy-aws.yml`** - CI/CD para AWS
7. **`backend/.dockerignore`** - Otimização do build Docker

### 📝 Documentação Atualizada

- **`GUIA-DEPLOY.md`** - Atualizado com informações AWS
- **`docs/poster/RESUMO-PROJETO.md`** - Atualizado com stack AWS

## 🎯 Arquitetura AWS

```
Frontend: S3 + CloudFront (CDN Global)
Backend: AWS App Runner ou ECS Fargate
Database: RDS PostgreSQL
```

## 🚀 Próximos Passos

1. **Leia o guia completo**: `aws-deploy-guide.md`
2. **Configure credenciais AWS** no GitHub Secrets:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_APP_RUNNER_SERVICE_ARN` (se usar App Runner)
   - `AWS_BACKEND_URL`
   - `AWS_CLOUDFRONT_DISTRIBUTION_ID`
   - `AWS_ECS_CLUSTER` (se usar ECS)
   - `AWS_ECS_SERVICE` (se usar ECS)

3. **Crie os recursos AWS**:
   - ECR Repository
   - RDS PostgreSQL
   - S3 Bucket
   - CloudFront Distribution
   - App Runner Service ou ECS Cluster

4. **Execute o deploy**:
   ```bash
   # Backend
   ./deploy-backend-aws.sh apprunner
   
   # Frontend
   ./deploy-frontend-aws.sh
   ```

## 📚 Documentação

- **[aws-deploy-guide.md](./aws-deploy-guide.md)** - Guia completo passo a passo
- **[GUIA-DEPLOY.md](./GUIA-DEPLOY.md)** - Guia geral de deploy

## ⚠️ Importante

- Configure todas as variáveis de ambiente no console AWS
- Use AWS Secrets Manager para secrets sensíveis
- Configure Security Groups adequadamente
- Execute migrações após criar o banco RDS

---

**✅ Migração configurada e pronta para uso!**



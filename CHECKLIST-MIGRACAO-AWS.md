# ✅ Checklist de Migração Koyeb → AWS

Use este checklist para garantir que a migração está completa.

## 📋 Pré-Migração

### Configuração AWS
- [ ] Conta AWS criada e configurada
- [ ] AWS CLI instalado e configurado (`aws configure`)
- [ ] Permissões IAM adequadas configuradas
- [ ] Budget alerts configurados (opcional, mas recomendado)

### Recursos AWS a Criar
- [ ] **ECR Repository** criado para backend
- [ ] **RDS PostgreSQL** criado e configurado
- [ ] **S3 Bucket** criado para frontend
- [ ] **CloudFront Distribution** criada
- [ ] **App Runner Service** ou **ECS Cluster** criado
- [ ] **Security Groups** configurados corretamente
- [ ] **Secrets Manager** configurado (opcional, mas recomendado)

## 🔧 Configuração Backend

### Variáveis de Ambiente
- [ ] `NODE_ENV=production` configurado
- [ ] `PORT=5000` configurado
- [ ] `DATABASE_URL` configurado (RDS endpoint)
- [ ] `FRONTEND_URL` configurado (CloudFront URL)
- [ ] `JWT_SECRET` gerado e configurado (secret forte)
- [ ] `JWT_REFRESH_SECRET` gerado e configurado (secret forte diferente)
- [ ] `REDIS_ENABLED` configurado (true/false)
- [ ] `REDIS_URL` configurado (se usar ElastiCache)
- [ ] `MIGRATION_TOKEN` gerado e configurado
- [ ] `BCRYPT_SALT_ROUNDS=12` configurado

### Build e Deploy
- [ ] Dockerfile do backend testado localmente
- [ ] Imagem Docker buildada e testada
- [ ] Imagem enviada para ECR
- [ ] App Runner/ECS configurado com a imagem
- [ ] Health check endpoint funcionando (`/health`)

### Banco de Dados
- [ ] RDS PostgreSQL acessível do App Runner/ECS
- [ ] Security Group permite conexão na porta 5432
- [ ] Migrações executadas no banco RDS
- [ ] Seed executado (se necessário)
- [ ] Backup automático configurado no RDS

## 🌐 Configuração Frontend

### Build
- [ ] `VITE_API_URL` configurado com URL do backend AWS
- [ ] Build do frontend testado localmente
- [ ] Build funciona sem erros

### Deploy S3 + CloudFront
- [ ] Arquivos do build enviados para S3
- [ ] Bucket S3 configurado como website estático
- [ ] Política de bucket configurada (public read)
- [ ] CloudFront distribution criada
- [ ] CloudFront apontando para S3 bucket
- [ ] Error pages configuradas (404 → /index.html)
- [ ] HTTPS configurado no CloudFront
- [ ] Cache invalidation testada

## 🔐 Segurança

### Secrets e Credenciais
- [ ] Todos os secrets removidos do código
- [ ] Secrets configurados via AWS Console ou Secrets Manager
- [ ] JWT secrets são fortes e únicos
- [ ] Senha do RDS é forte
- [ ] `.env` files não estão commitados

### Network e Acesso
- [ ] Security Groups configurados corretamente
- [ ] RDS não está publicamente acessível (ou está com restrições)
- [ ] CORS configurado com URL correta do CloudFront
- [ ] Rate limiting configurado

## 🚀 CI/CD

### GitHub Actions
- [ ] Secrets do GitHub configurados:
  - [ ] `AWS_ACCESS_KEY_ID`
  - [ ] `AWS_SECRET_ACCESS_KEY`
  - [ ] `AWS_APP_RUNNER_SERVICE_ARN` (se usar App Runner)
  - [ ] `AWS_BACKEND_URL`
  - [ ] `AWS_CLOUDFRONT_DISTRIBUTION_ID`
  - [ ] `AWS_ECS_CLUSTER` (se usar ECS)
  - [ ] `AWS_ECS_SERVICE` (se usar ECS)
- [ ] Workflow `.github/workflows/deploy-aws.yml` testado
- [ ] Deploy automático funcionando

## ✅ Testes Pós-Deploy

### Backend
- [ ] Health check responde: `GET /health`
- [ ] Endpoint de registro funciona: `POST /api/users/register`
- [ ] Endpoint de login funciona: `POST /api/users/login`
- [ ] Autenticação JWT funciona
- [ ] CORS permite requisições do frontend
- [ ] Logs aparecem no CloudWatch

### Frontend
- [ ] Site carrega no CloudFront
- [ ] Rotas do React Router funcionam
- [ ] API calls para backend funcionam
- [ ] Autenticação funciona
- [ ] Criação de projetos funciona
- [ ] Busca de projetos funciona

### Integração
- [ ] Frontend consegue se comunicar com backend
- [ ] Tokens JWT são enviados/recebidos corretamente
- [ ] CORS não bloqueia requisições
- [ ] Erros são tratados adequadamente

## 📊 Monitoramento

- [ ] CloudWatch logs configurados
- [ ] Métricas de App Runner/ECS sendo coletadas
- [ ] Alertas configurados (opcional)
- [ ] Dashboard de monitoramento criado (opcional)

## 🔄 Migração de Dados (se aplicável)

- [ ] Backup do banco Koyeb criado
- [ ] Dados migrados para RDS
- [ ] Dados validados após migração
- [ ] Rollback plan preparado (se necessário)

## 📝 Documentação

- [ ] URLs de produção documentadas
- [ ] Credenciais de acesso documentadas (em local seguro)
- [ ] Processo de deploy documentado
- [ ] Troubleshooting guide atualizado

## 🎯 Finalização

- [ ] Koyeb service desativado (após validação)
- [ ] Domínio customizado configurado (se aplicável)
- [ ] SSL/HTTPS funcionando
- [ ] Performance testada
- [ ] Equipe notificada sobre nova infraestrutura

---

## ⚠️ **IMPORTANTE**

1. **Não desative o Koyeb** até validar que tudo está funcionando na AWS
2. **Mantenha backup** do banco de dados antigo
3. **Teste tudo** antes de fazer o switch completo
4. **Monitore custos** da AWS (configure budget alerts)

---

**✅ Quando todos os itens estiverem marcados, a migração está completa!**





FROM node:18-alpine

WORKDIR /app

# Instalar dependências do sistema
RUN apk add --no-cache python3 make g++

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar código fonte
COPY . .

# Criar diretório de logs
RUN mkdir -p logs

# Expor porta
EXPOSE 5000

# Comando para executar a aplicação
CMD ["npm", "start"]

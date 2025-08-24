FROM node:18-alpine

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./

# Instalar dependências
RUN npm ci

# Copiar código fonte
COPY . .

# Expor porta
EXPOSE 3000

# Comando para executar a aplicação em modo de desenvolvimento
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

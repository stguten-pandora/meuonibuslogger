# Use a imagem oficial Node.js LTS (baseada em Alpine)
FROM node:current-alpine

# Instale o cliente PostgreSQL (necessário para pg_dump/psql)
# 'postgresql-client' é o nome do pacote no Alpine
RUN apk update && apk add postgresql-client && rm -rf /var/cache/apk/*

# Define o diretório de trabalho
WORKDIR /app

# Copia package.json e package-lock.json
COPY package*.json ./

# Instala dependências
RUN npm install --omit=dev

# Cria um diretório para dados da aplicação (pode ser usado para backups)
RUN mkdir -p /app/.data

# Copia o restante do código da aplicação
COPY . .

# Expõe a porta da sua aplicação Express
EXPOSE 3000

# Inicia a aplicação
CMD ["npm", "run", "start"]
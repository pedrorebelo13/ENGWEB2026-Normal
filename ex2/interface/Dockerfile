FROM node:18-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package.json package-lock.json* ./

# Instalar dependências
RUN npm install

# Copiar ficheiros da aplicação
COPY server.js ./
COPY index.html ./

# Expor a porta
EXPOSE 19021

# Comando para iniciar a aplicação
CMD ["npm", "start"]

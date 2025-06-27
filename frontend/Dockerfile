FROM node:20-alpine

WORKDIR /app

# Configurar mirror de npm antes de instalar dependencias
RUN npm config set registry https://registry.npmmirror.com

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]
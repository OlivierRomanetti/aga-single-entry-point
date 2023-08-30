FROM node:alpine

WORKDIR /app
COPY package.json .
RUN npm install --only=prod
COPY . .

# Exposez le port sur lequel le serveur Express s'exécute (3001 dans ce cas)
EXPOSE 8080

CMD ["npm", "start"]
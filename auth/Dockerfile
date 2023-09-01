# Étape 1 : Construction de l'application
FROM node:alpine AS builder

WORKDIR /app

# Copier les fichiers de configuration
COPY package.json .
COPY tsconfig.json .


# Installation des dépendances de production (utilisez le flag --production pour éviter les dépendances de développement)
RUN npm install --production

# Installation des dépendances de développement pour TypeScript (supprimées en production)
RUN npm install --save-dev @types/jest


# Copier le reste des fichiers de l'application
COPY . .

# Compilation TypeScript en JavaScript (remarque : ajustez ceci selon votre configuration)
RUN npm run build

# Étape 2 : Exécution de l'application
FROM node:alpine

WORKDIR /app

# Copier les fichiers de l'étape de construction
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json

# Exposez le port sur lequel votre application Express écoute
EXPOSE 8080

# Démarrez votre application Express
CMD ["npm", "start"]

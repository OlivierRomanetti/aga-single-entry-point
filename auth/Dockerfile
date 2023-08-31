FROM node:alpine

WORKDIR /app
COPY package.json .
COPY tsconfig.json .
RUN npm install --save-dev @types/cors
RUN npm install
COPY . .

CMD ["npm", "start"]
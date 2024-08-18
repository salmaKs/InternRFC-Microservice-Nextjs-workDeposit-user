FROM node:20

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .
COPY .env.local .env.local

RUN npm run build

EXPOSE 3002

CMD ["npm","start"]
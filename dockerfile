FROM node:current-alpine
RUN apk update && apk add postgresql-client && rm -rf /var/cache/apk/*

WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
RUN mkdir -p /app/.data
COPY . .
EXPOSE 3000

CMD ["npm", "run", "start"]
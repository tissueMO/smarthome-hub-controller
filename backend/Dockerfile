FROM node:10

ENV API_KEY xxxxxxxx

WORKDIR /app
ADD . .
RUN yarn

EXPOSE 8080
CMD ["node", "server.js"]

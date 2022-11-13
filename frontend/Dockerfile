# 開発ステージ
FROM node:10 AS development

WORKDIR /app

EXPOSE 3000
CMD ["yarn", "dev"]


# ビルドステージ
FROM development AS build

ADD . .
RUN yarn && yarn build


# 本番ステージ
FROM httpd:2.4

COPY --from=build /app/public /usr/local/apache2/htdocs/

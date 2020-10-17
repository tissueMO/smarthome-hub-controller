FROM node:10

# 必要な環境変数の宣言
ENV API_KEY xxxxxxxx

WORKDIR /app

# ソースコードをコピー
ADD . .

# 必要なパッケージをインストール
RUN yarn

EXPOSE 8080
CMD ["node", "server.js"]

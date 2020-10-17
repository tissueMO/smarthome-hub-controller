// ###################################################################
//    ローカル専用 アプリケーションサーバー
// ###################################################################
const express = require('express');
const main = require('./index.js');

// サーバー設定
const PORT = 8080;
const HOST = '0.0.0.0';

const app = express();
app.get('/', (req, res) => {
  main.main(req, res);
});

app.listen(PORT, HOST);
console.info(`Startup on http://${HOST}:${PORT}/`);

// ###################################################################
//    JS エントリーポイント
// ###################################################################
const request = require('sync-request');
const apiBaseUrl = 'https://maker.ifttt.com/trigger';

// 環境変数に格納されたIFTTTのAPIキーを取り出す
const apiKey = process.env.API_KEY;

exports.main = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    // CORS 対応
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.status(204).send('');
  } else if (req.method === 'GET') {
    // 指定されたイベントをIFTTTに送信
    const result = request('POST', `${apiBaseUrl}/${req.query.event}/with/key/${apiKey}`);
    if (result.statusCode == 200) {
      res.status(200).send('');
    } else {
      console.error(result);
      res.status(500).send('');
    }
  } else {
    res.status(405).send('');
  }
};

// ###################################################################
//    JS エントリーポイント
// ###################################################################
const request = require('sync-request');
const apiBaseUrl = 'https://maker.ifttt.com/trigger';

exports.main = (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');

  if (req.method === 'OPTIONS') {
    res.set('Access-Control-Allow-Methods', 'GET');
    res.set('Access-Control-Allow-Headers', 'Content-Type');
    res.set('Access-Control-Max-Age', '3600');
    res.sendStatus(204);
    return;
  }
  if (req.method !== 'GET') {
    res.sendStatus(405);
    return;
  }

  // 指定されたイベントをIFTTTに送信
  const result = request('POST', `${apiBaseUrl}/${req.query.event}/with/key/${process.env.API_KEY}`);
  if (result.statusCode == 200) {
    res.sendStatus(200);
  } else {
    console.error(result);
    res.sendStatus(500);
  }
};

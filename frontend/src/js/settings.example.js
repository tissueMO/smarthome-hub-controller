// ###################################################################
//    設定値 [サンプル]
//    settings.js としてコピーした上で適宜設定を行って下さい。
// ###################################################################

// バックエンドURL
export const apiBaseUrl = 'https://{DOMAIN_NAME}';

// カスタムAPIURL
export const customApiBaseUrl = 'http://localhost';

/**
 * パーティモード中の送信間隔ミリ秒
 */
export const PartyIntervalMilliSeconds = 2000;

/**
 * パーティモードの最大時間秒数
 */
export const PartyLimitTimeSeconds = 10800;

/**
 * パーティモード終了時に送信するボタンコード
 */
export const ButtonNameForPartyStopping = '';

/**
 * パーティモードに使用するシーンの数
 */
export const PartySceneCount = 5;

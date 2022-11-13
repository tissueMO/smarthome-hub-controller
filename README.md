# IFTTT向け Webhook 中継リモコン

## Summary

スマートホームの機能を集約するためのコントローラーWebアプリです。  
Webhook を介することで IFTTT 等の外部サービスと連携した任意の操作を行うことができます。  


## Description

### アーキテクチャー概略

#### フロントエンド [frontend]

- [HTTP/GET] スマホ (Webブラウザー) => Web サーバー
    - 画面表示
- [HTTP/GET] スマホ (Webブラウザー) => バックエンドサーバー
    - 実際に Webhook を使用するサーバーとの通信


#### バックエンド [backend]

- [HTTP/POST] バックエンドサーバー => IFTTT 等
    - Webhook を介して任意の操作の実行をトリガー
- [外部サービス連携] IFTTT 等 => 各種機器
    - 任意の操作を実行


## Dependency

### フロントエンド [frontend]

- Node.js 12+
- Yarn
- Nodes.js パッケージ
    - Webpack
    - Babel
    - Sass
    - EJS
    - ESLint
    - その他については `/front/package.json` を参照


### バックエンド [backend]

- Node.js 10+
- Yarn
- Docker
- Node.js パッケージ
    - Express
    - Sync-Request


## Setup

本リポジトリーから Clone してから実際に動かすまでの手順を示します。  

### フロントエンド [frontend]

- コマンドライン上で `/frontend` に移動した状態で以下のコマンドで Node.js で使用する依存パッケージをインストールします。
    - `$ yarn`
- `/frontend/src/js/settings.example.js` をもとに環境依存する値 (バックエンドサーバーのURL) を設定した `/frontend/src/js/settings.js` を作成します。
- 使用するボタンの名前やレイアウト情報を `/frontend/src/json/buttons.json` に書き込みます。
- 以下のコマンドで公開ファイル群をビルドします。
    - `$ yarn build:dev`
        - 本番モードでビルドするには `$ yarn build` とします。
        - 本番モードでの出力には、map ファイルが含まれず、CSS および JavaScript ファイルが Minify されたものになります。
- `/frontend/public/` 以下に作られたファイルを、任意の Web サーバーの公開ディレクトリーに配置します。
    - 前掲アーキテクチャー概略のうち、 Web サーバー に相当します。
    - 付属の `Dockerfile` を使用することで、ビルドしたファイルを封入した Web サーバーを作ることもできます。


### バックエンド [backend]

- コマンドライン上で `/backend` に移動した状態で、付属の `Dockerfile` をビルドしてイメージを作成します。
- コンテナーを起動する際、環境変数 `API_KEY` に任意のAPIキーを指定します。
    - APIキーは Webhook を使用するのに必要となることを想定しています。


## Usage

(前掲 Setup での工程が完了している前提とします)

- ビルドしたフロント用コンテンツを配置している Web サーバーに疎通できるクライアント環境のブラウザーから、フロント用コンテンツの index.html にアクセスします。
    - リモコン画面が表示されます。
    - 非最新のブラウザーや Internet Explorer 等では正しく動作しない可能性があります。
- 任意のボタンを押下し、任意の操作が行えることを確認します。
    - フロントエンド～バックエンドサーバーとの疎通、バックエンド～外部サービスとの連携がどちらも動作していれば成功メッセージが表示されます。


## Reference

- [ICOOON MONO](https://icooon-mono.com/)
    - このリポジトリーで使用している favicon の著作権は上記サイトの TopeconHeroes 様に帰属します。
    

## License

[MIT](LICENSE.md)


## Author

[tissueMO](https://github.com/tissueMO)

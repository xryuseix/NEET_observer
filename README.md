<!-- @format -->

![Python](https://img.shields.io/badge/Python-3.8.10-yellow?logo=python) ![Node](https://img.shields.io/badge/Node.js-14.17.1-6FA660?logo=Node.js) ![TypeScript](https://img.shields.io/badge/TypeScript-4.3.5-2E74C0?logo=TypeScript) ![Heroku](https://heroku-badge.herokuapp.com/?app=neet-obserber)

# NEET observer - 自宅警備員システム

帰省中に使う家の監視カメラ

- 動体検知して，人が入ってきた時のみ録画する
- 録画データはバックグラウンドで Heroku 常にある API へアップロードする
- Heroku 上の API は Google Drive へアップロードする

本スクリプトは Heroku の認証情報などを持たない PC で起動する．Heroku 上の API を一旦挟むことで，本 Python スクリプトや認証情報が攻撃者に盗まれたとしても，攻撃者は動画のアップロードのみしか行うことはできない (Google Drive や Heroku の保存可能領域を減らすことはできる)．

これは，それぞれが以下の権限を持つためである

| アクター                      | 権限                                                                     |
| ----------------------------- | ------------------------------------------------------------------------ |
| 攻撃者 (カメラ付き PC)        | Heroku の API へアップロード, ローカルのファイルを削除, スクリプトの停止 |
| 開発者 (攻撃者とは干渉しない) | Heroku の API へのアクセス，Google Drive へのアクセス                    |
| Heroku 上の API               | Google Drive へのアクセス，アップロード，削除など                        |

## バージョン情報

| ソフトウェア | バージョン    | 備考                                        |
| ------------ | ------------- | ------------------------------------------- |
| Python       | Python 3.8.10 | conda: [NEET_env](./NEET_env.yml)           |
| Node.js      | v14.17.1      | yarn: [package.json](./WebAPI/package.json) |
| TypeScript   | Version 4.3.5 | yarn: [package.json](./WebAPI/package.json) |

## 起動

### サーバ

以下の二つのスクリプトをそれぞれ起動する

```sh
tsc -w
```

```sh
npm run dev
```

### 監視カメラ

```sh
python main.py
```

## 認証情報

### secret.json

API アクセスへの Basic 認証

```json
{
  "heroku": {
    "username": "<USERNAME>",
    "password": "<PASSWORD>"
  }
}
```

### WebAPI/credentials.json

Google Console でもらえるやつ

### WebAPI/token.json

Node.js 実行時に気づいたら生成されてるやつ

### WebAPI/folderID.json

Google Drive のフォルダ ID

```json
{
  "folder_id": "<FOLDER ID>"
}
```

### WebAPI/userList.json

アクセス可能ユーザデータベース

```json
{
  "<USERNAME>": { "password": "<PASSWORD>" }
}
```

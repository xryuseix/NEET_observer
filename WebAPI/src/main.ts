/** @format */

import express from "express";
import { parse } from "path/posix";
// import { Request, Response } from "express";

const app = express();
// jsonデータを扱う
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// サーバー接続
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log("listen on port:", port);
});

// テスト用のエンドポイント
app.get("/", (req, res) => {
  res.status(200).send({ message: "hello, api sever!" });
});

/*
動画を取得するエンドポイント
以下の形式で受け取る
{
    "key": secret key,
    "name": filename,
    "data": base64 movie data
}
*/
app.post("/post", (req: express.Request, res: express.Response) => {
  if (req.body.key != "PASSWORD") {
    res.status(401).send({ ERROR: "invalid password" });
  } else {
    res.status(200).send({ A: req.body.name });
  }
});

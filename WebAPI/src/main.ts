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

// 動画を取得するエンドポイントaaa
app.post("/post", (req: express.Request, res: express.Response) => {
    const req_body = JSON.parse(Object.keys(req.body)[0]);
    res.status(200).send({ "A": req_body.Name });
});

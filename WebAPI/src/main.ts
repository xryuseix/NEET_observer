/** @format */

import express from "express";
import { Buffer } from "buffer";
import fs from "fs";

const app = express();
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
const auth = require("./auth");
app.use(auth);
const multer = require("multer");
const storage = multer.diskStorage({
  destination: function (req: any, file: any, cb: any) {
    cb(null, "./uploads");
  },
  filename: function (req: any, file: any, cb: any) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
app.post(
  "/upload",
  upload.single("file"),
  (req: express.Request, res: express.Request) => {
    const filename = req.file.originalname;
    const file = req.file;
    console.log(file);
    const content = fs.readFileSync(req.file.path, "utf-8");
    res.send(filename + ": uploaded ***\n");
  }
);

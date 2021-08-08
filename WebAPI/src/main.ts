/** @format */

import express from "express";
import { Buffer } from "buffer";
import fs from "fs";
import uploadFile from "./googleAPI";

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
  const response = {
    status: "OK",
    message: "hello, api sever!",
  };
  res.status(200).send(response);
});

/*
動画を取得するエンドポイント
curl --basic -u $username:$password ${url}/upload -F "file=@${filename}" 
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
    driveUpload(`uploads/${filename}`);
    const response = {
      status: "OK",
      file: filename,
    };
    res.status(201).send(response);
  }
);

/*
Google Driveへアップロード
*/
const driveUpload = (filename: string) => {
  uploadFile(filename);
};

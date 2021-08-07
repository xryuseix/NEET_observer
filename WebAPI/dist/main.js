"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { Request, Response } from "express";
const app = express_1.default();
// jsonデータを扱う
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
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
app.post("/post", (req, res) => {
    if (req.body.key != "PASSWORD") {
        res.status(401).send({ ERROR: "invalid password" });
    }
    else {
        res.status(200).send({ A: req.body.name });
    }
});
//# sourceMappingURL=main.js.map
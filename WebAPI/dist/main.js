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
// 動画を取得するエンドポイントaaa
app.post("/post", (req, res) => {
    const req_body = JSON.parse(Object.keys(req.body)[0]);
    res.status(200).send({ "A": req_body.Name });
});
//# sourceMappingURL=main.js.map
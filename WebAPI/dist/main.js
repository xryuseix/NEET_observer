"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = express_1.default();
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
const auth = require("./auth");
app.use(auth);
const multer = require("multer");
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./uploads");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single("file"), (req, res) => {
    const filename = req.file.originalname;
    const file = req.file;
    console.log(file);
    const content = fs_1.default.readFileSync(req.file.path, "utf-8");
    res.send(filename + ": uploaded ***\n");
});
//# sourceMappingURL=main.js.map
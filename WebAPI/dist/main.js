"use strict";
/** @format */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const googleAPI_1 = __importDefault(require("./googleAPI"));
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
    const response = {
        status: "OK",
        message: "Hello, NEET API Sever!",
    };
    res.status(200).send(response);
});
/*
動画を取得するエンドポイント
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
    try {
        const filename = req.file.originalname;
        const file = req.file;
        console.log(file);
        driveUpload(`uploads/${filename}`);
        const response = {
            status: "OK",
            message: `Nice record of ${filename}!`,
        };
        res.status(201).send(response);
    }
    catch (e) {
        const response = {
            status: "ERROR",
            message: "Internal Server Error",
        };
        res.status(500).send(response);
    }
});
/*
Google Driveへアップロード
*/
const driveUpload = (filename) => {
    googleAPI_1.default(filename);
};
//# sourceMappingURL=main.js.map